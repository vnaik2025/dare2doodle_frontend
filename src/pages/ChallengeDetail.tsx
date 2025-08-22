import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { getChallenge, deleteChallenge } from '../apis/challengesApi';
import { getComments, createComment } from '../apis/commentsApi';
import type { RootState } from '../store/index';
import ChallengeCard from '../components/features/ChallengeCard';
import Comment from '../components/features/Comment';
import Input from '../components/common/Input';
import FileUpload from '../components/controls/FileUpload';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import { useState } from 'react';

interface CommentForm {
  text: string;
}

const ChallengeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);

  const { data: challenge, isLoading: challengeLoading, error: challengeError } = useQuery({
    queryKey: ['challenge', id],
    queryFn: () => getChallenge(id!), // Directly fetch challenge by ID
    enabled: !!id,
  });

  const { data: comments, isLoading: commentsLoading, error: commentsError } = useQuery({
    queryKey: ['comments', id],
    queryFn: () => getComments(id!),
    enabled: !!id,
  });

  const { register, handleSubmit, reset } = useForm<CommentForm>();
  const mutation = useMutation({
    mutationFn: (data: FormData) => createComment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', id] });
      reset();
      setFile(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteChallenge(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      window.location.href = '/';
    },
  });

  const onSubmit = (data: CommentForm) => {
    const formData = new FormData();
    formData.append('challengeId', id!);
    formData.append('text', data.text);
    if (file) formData.append('media', file);
    if (user) formData.append('userId', user.id);
    mutation.mutate(formData);
  };

  if (challengeLoading || commentsLoading) return <Loader />;
  if (challengeError || commentsError) return <ErrorMessage message="Failed to load challenge or comments" />;
  if (!challenge) return <ErrorMessage message="Challenge not found" />;

  return (
    <div>
      <ChallengeCard challenge={challenge} />
      {user && (
        <Button variant="outline" onClick={() => deleteMutation.mutate()} disabled={deleteMutation.isPending}>
          Delete Challenge
        </Button>
      )}
      <h2 className="text-2xl font-bold mt-8 mb-4">Comments</h2>
      {user && (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
          <Input placeholder="Add a comment" register={register('text', { required: 'Comment is required' })} />
          <FileUpload onChange={setFile} />
          <Button type="submit" className="mt-2" disabled={mutation.isPending}>Post Comment</Button>
          {mutation.error && <ErrorMessage message="Failed to post comment" />}
        </form>
      )}
      {comments?.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default ChallengeDetail;