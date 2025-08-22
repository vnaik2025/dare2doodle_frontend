import type { ChangeEvent } from 'react';

interface FileUploadProps {
  onChange: (file: File | null) => void;
  accept?: string;
}

const FileUpload = ({ onChange, accept = 'image/*' }: FileUploadProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.files?.[0] || null);
  };
  return (
    <input
      type="file"
      accept={accept}
      onChange={handleChange}
      className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-indigo-700"
    />
  );
};

export default FileUpload;