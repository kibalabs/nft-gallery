

export const resolveUrl = (url: string): string => {
  return url.startsWith('ipfs://') ? url.replace('ipfs://', 'https://pablo-images.kibalabs.com/v1/ipfs/') : url;
};
