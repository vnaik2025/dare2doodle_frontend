// utils/url.ts
export const extractImageUrl = (src?: string): string | undefined => {


  console.log("source is",src)
  if (!src) return undefined;

  // Split on either "|" or "%" (first part is always the real URL)
  return src.split(/[%|]/)[0];
};
