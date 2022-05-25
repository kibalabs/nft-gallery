
export const truncateEnd = (text: string, maxLength: number): string => {
  const diff = text.length - maxLength;
  if (diff > 0) {
    const start = text.substring(0, maxLength);
    return `${start}...`;
  }
  return text;
};
