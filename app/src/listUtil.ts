
export const getChunks = (arr: unknown[], chunkSize: number): unknown[][] => {
  return arr.reduce((accumulator: unknown[][], value: unknown, index: number): unknown[][] => {
      const chunkIndex = Math.floor(index / chunkSize)
      if (!accumulator[chunkIndex]) {
         accumulator[chunkIndex] = [];
      }
      accumulator[chunkIndex].push(value)
      return accumulator
   }, []);
};
