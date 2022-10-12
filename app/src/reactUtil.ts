import React from 'react';


export const useWindowScroll = (handler: (sizeScrolled: number, factorScrolled: number) => void): void => {
  const onScrolled = React.useCallback((): void => {
    const size = document.body.scrollHeight - window.innerHeight;
    const position = window.pageYOffset;
    handler(position, position / size);
  }, [handler]);

  React.useLayoutEffect((): (() => void) => {
    window.addEventListener('scroll', onScrolled);
    return (): void => {
      window.removeEventListener('scroll', onScrolled);
    };
  }, [onScrolled]);
};
