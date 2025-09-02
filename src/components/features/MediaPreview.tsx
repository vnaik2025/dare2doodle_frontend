import React from "react";
import { extractImageUrl } from "../../utils/url";

interface MediaPreviewProps {
  url: string;
  type?: "image" | "video";
}

const MediaPreview: React.FC<MediaPreviewProps> = ({ url, type = "image" }) => {
  const cleanUrl = extractImageUrl(url);

  console.log("Clean media url:", cleanUrl);

  if (!cleanUrl) {
    return <div className="text-red-500">Invalid media URL</div>;
  }

  if (type === "video") {
    return (
      <video className="rounded-md w-full h-auto" controls>
        <source src={cleanUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  }

  return (
    <img
      src={cleanUrl}
      alt="preview"
      className="rounded-md w-full h-auto object-cover"
    />
  );
};

export default MediaPreview;
