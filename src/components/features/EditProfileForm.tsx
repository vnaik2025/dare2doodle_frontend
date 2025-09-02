// src/components/features/EditProfileForm.tsx
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfile } from '../../apis/usersApi';
import Button from '../common/Button';
import Input from '../common/Input';
import FileUpload from '../controls/FileUpload';

interface EditProfileFormProps {
  user: any;
  onClose: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ user, onClose }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    username: user?.username ?? '',
    bio: user?.bio ?? '',
    avatarUrl: user?.avatarUrl ?? '',
    bannerUrl: user?.bannerUrl ?? '',
  });

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      onClose();
    },
    onError: (error) => {
      console.error('Profile update failed:', error);
      alert('Failed to update profile');
    },
  });

  const handleFileUpload = async (file: File, type: 'avatar' | 'banner') => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await api.post('/storage/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormData((prev) => ({
        ...prev,
        [type === 'avatar' ? 'avatarUrl' : 'bannerUrl']: response.data.url,
      }));
    } catch (error) {
      console.error('File upload failed:', error);
      alert('Failed to upload file');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Username"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        required
      />
      <Input
        label="Bio"
        value={formData.bio}
        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
        textarea
      />
      <FileUpload
        label="Avatar"
        onChange={(file) => handleFileUpload(file, 'avatar')}
        accept="image/*"
      />
      <FileUpload
        label="Banner"
        onChange={(file) => handleFileUpload(file, 'banner')}
        accept="image/*"
      />
      <div className="flex gap-2">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving...' : 'Save'}
        </Button>
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default EditProfileForm;