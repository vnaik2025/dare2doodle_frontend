// utils/url.ts
export const extractImageUrl = (src?: string): string | undefined => {
  if (!src) return undefined;
  return src.split("|")[0]; // first part is the real image URL
};
