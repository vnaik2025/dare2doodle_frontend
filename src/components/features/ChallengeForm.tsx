// import React from "react";
// import { useForm, Controller } from "react-hook-form";
// import FileUpload from "../controls/FileUpload";
// import Select from "../common/Select";
// import MultiSelect from "../common/MultiSelect";
// import Button from "../common/Button";

// export interface FormValues {
//   title: string;
//   description: string;
//   image?: File | null;
//   artStyle: string;
//   tags: string[];
// }

// interface Props {
//   onSubmit: (data: FormValues) => void;
//   initialData?: Partial<FormValues & { imageUrl?: string }>;
//   isSubmitting?: boolean;
// }

// const artStyles = ["Cartoon","Funny" ,"Realistic", "Anime", "Pixel", "Abstract"];
// const suggestedTags = ["cats","dogs","ocean","futuristic","architecture","sci-fi","cute","food","spooky"];

// const ChallengeForm: React.FC<Props> = ({ onSubmit, initialData, isSubmitting }) => {
//   const { control, register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
//     defaultValues: {
//       title: initialData?.title || "",
//       description: initialData?.description || "",
//       artStyle: initialData?.artStyle || "",
//       tags: initialData?.tags || [],
//     }
//   });

//   // Preview for image
//   const existingImageUrl = React.useMemo(() => {
//     if (!initialData?.imageUrl) return null;
//     return initialData.imageUrl.split('|')[0];
//   }, [initialData?.imageUrl]);

//   const [previewUrl, setPreviewUrl] = React.useState<string | null>(existingImageUrl);

//   const file = watch("image");

//   React.useEffect(() => {
//     if (file && file instanceof File) {
//       const obj = URL.createObjectURL(file);
//       setPreviewUrl(obj);
//       return () => URL.revokeObjectURL(obj);
//     } else {
//       setPreviewUrl(existingImageUrl || null);
//     }
//   }, [file, existingImageUrl]);

//   const handleFileChange = (f?: File | null) => {
//     setValue("image", f || undefined);
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-zinc-950 p-6 rounded-2xl shadow-lg">
//       <div>
//         <label className="text-sm text-gray-300">Title</label>
//         <input
//           {...register("title", { required: "Title is required" })}
//           placeholder="Challenge Title"
//           className="w-full p-3 rounded-lg bg-zinc-900 text-white border border-gray-700 focus:outline-none text-sm"
//         />
//         {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
//       </div>

//       <div>
//         <label className="text-sm text-gray-300">Description</label>
//         <textarea
//           {...register("description", { required: "Description is required" })}
//           placeholder="Describe the challenge..."
//           className="w-full p-3 rounded-lg bg-zinc-900 text-white border border-gray-700 focus:outline-none text-sm"
//           rows={4}
//         />
//         {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
//       </div>

//       {previewUrl && (
//         <div>
//           <p className="text-sm text-gray-400 mb-2">Image preview:</p>
//           <img src={previewUrl} alt="preview" className="w-full max-h-64 object-cover rounded-lg border border-gray-700" />
//         </div>
//       )}

//       <FileUpload onChange={handleFileChange} accept="image/*" />

//       {/* Art Style */}
//       <Controller
//         name="artStyle"
//         control={control}
//         render={({ field }) => (
//           <Select
//             label="Art Style"
//             options={artStyles}
//             value={field.value || ""}
//             onChange={(v) => field.onChange(v)}
//           />
//         )}
//       />

//       {/* Tags */}
//       <Controller
//         name="tags"
//         control={control}
//         render={({ field }) => (
//           <MultiSelect
//             label="Tags"
//             options={suggestedTags}
//             value={field.value || []}
//             onChange={(arr) => field.onChange(arr)}
//           />
//         )}
//       />

//       <Button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 text-white hover:bg-indigo-700">
//         {isSubmitting ? "Saving..." : "Save Challenge"}
//       </Button>
//     </form>
//   );
// };

// export default ChallengeForm;


import React from "react";
import { useForm, Controller } from "react-hook-form";
import FileUpload from "../controls/FileUpload";
import Select from "../common/Select";
import MultiSelect from "../common/MultiSelect";
import Button from "../common/Button";

export interface FormValues {
  title: string;
  description: string;
  image?: File | null;
  artStyle: string;
  tags: string[];
}

interface Props {
  onSubmit: (data: FormValues) => void;
  initialData?: Partial<FormValues & { imageUrl?: string }>;
  isSubmitting?: boolean;
}

const artStyles = ["Cartoon","Funny" ,"Realistic", "Anime", "Pixel", "Abstract"];
const suggestedTags = ["cats","dogs","ocean","futuristic","architecture","sci-fi","cute","food","spooky"];

const ChallengeForm: React.FC<Props> = ({ onSubmit, initialData, isSubmitting }) => {
  const { control, register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      artStyle: initialData?.artStyle || "",
      tags: initialData?.tags || [],
    }
  });

  const existingImageUrl = React.useMemo(() => {
    if (!initialData?.imageUrl) return null;
    return initialData.imageUrl.split('|')[0];
  }, [initialData?.imageUrl]);

  const [previewUrl, setPreviewUrl] = React.useState<string | null>(existingImageUrl);
  const file = watch("image");

  React.useEffect(() => {
    if (file && file instanceof File) {
      const obj = URL.createObjectURL(file);
      setPreviewUrl(obj);
      return () => URL.revokeObjectURL(obj);
    } else {
      setPreviewUrl(existingImageUrl || null);
    }
  }, [file, existingImageUrl]);

  const handleFileChange = (f?: File | null) => {
    setValue("image", f || undefined);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-zinc-950 p-6 rounded-2xl shadow-md">
      
      <div>
        <label className="text-sm text-gray-400">Title</label>
        <input
          {...register("title", { required: "Title is required" })}
          placeholder="Challenge Title"
          className="w-full p-3 rounded-lg bg-zinc-900 text-white border border-gray-700 focus:outline-none text-sm"
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label className="text-sm text-gray-400">Description</label>
        <textarea
          {...register("description", { required: "Description is required" })}
          placeholder="Describe the challenge..."
          className="w-full p-3 rounded-lg bg-zinc-900 text-white border border-gray-700 focus:outline-none text-sm"
          rows={4}
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
      </div>

      {previewUrl && (
        <div>
          <p className="text-sm text-gray-400 mb-2">Image preview:</p>
          <img src={previewUrl} alt="preview" className="w-full max-h-64 object-cover rounded-lg border border-gray-700" />
        </div>
      )}

      <FileUpload onChange={handleFileChange} accept="image/*" />

      {/* Art Style */}
      <Controller
        name="artStyle"
        control={control}
        render={({ field }) => (
          <Select
            label="Art Style"
            options={artStyles}
            value={field.value || ""}
            onChange={(v) => field.onChange(v)}
          />
        )}
      />

      {/* Tags */}
      <Controller
        name="tags"
        control={control}
        render={({ field }) => (
          <MultiSelect
            label="Tags"
            options={suggestedTags}
            value={field.value || []}
            onChange={(arr) => field.onChange(arr)}
          />
        )}
      />

      {/* Minimalistic Outlined Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full border border-gray-300 text-gray-300 rounded-[5px] px-4 py-2 hover:bg-gray-300 hover:text-black transition-colors"
      >
        {isSubmitting ? "Saving..." : "Save Challenge"}
      </Button>
    </form>
  );
};

export default ChallengeForm;
