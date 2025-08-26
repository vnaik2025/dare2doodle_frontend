import { useState, type ChangeEvent } from "react";
import { Upload, X } from "lucide-react";

interface FileUploadProps {
  onChange: (file: File | null) => void;
  accept?: string;
}

const FileUpload = ({ onChange, accept = "image/*" }: FileUploadProps) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFileName(file ? file.name : null);
    onChange(file);
  };

  const handleClear = () => {
    setFileName(null);
    onChange(null);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-6 border-2 border-dashed border-zinc-700 rounded-2xl bg-zinc-900/60 hover:border-indigo-500 hover:bg-zinc-800/70 transition-colors duration-300">
      {!fileName ? (
        <>
          <Upload className="w-10 h-10 text-indigo-400" />
          <label className="flex flex-col items-center cursor-pointer">
            <span className="text-sm text-zinc-400 mb-1">Click to upload</span>
            <input
              type="file"
              accept={accept}
              onChange={handleChange}
              className="hidden"
            />
            <span className="text-xs text-zinc-500">
              {accept.replace("/*", "")} files supported
            </span>
          </label>
        </>
      ) : (
        <div className="flex items-center gap-3">
          <span className="text-sm text-zinc-300 truncate max-w-[200px]">
            {fileName}
          </span>
          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded-full bg-zinc-800 hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4 text-zinc-300" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
