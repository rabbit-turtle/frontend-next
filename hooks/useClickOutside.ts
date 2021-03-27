import { useEffect } from 'react';

export const useClickOutside = (ref: any, callback: any, exceptRef: any = null) => {
  useEffect(() => {
    const handleClick = (event: any) => {
      if (exceptRef) {
        if (
          ref.current &&
          !ref.current.contains(event.target) &&
          exceptRef.current &&
          !exceptRef.current.contains(event.target)
        )
          callback();
        return;
      }
      if (ref.current && !ref.current.contains(event.target)) callback();
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [ref, callback, exceptRef]);
};
