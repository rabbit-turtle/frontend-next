import { useEffect, useRef, memo } from 'react';

interface IDaumPostcode {
  onComplete: (_address: string) => void;
  onClose: () => void;
}

function DaumPostcode({ onComplete, onClose }: IDaumPostcode) {
  const containerRef = useRef(null);
  useEffect(() => {
    if (!containerRef.current) return;
    const initPostcode = async () => {
      const { daum } = window as any;
      new daum.Postcode({
        width: '100%',
        height: '100%',
        oncomplete: (data: any) => {
          onComplete(data.address);
        },
      }).embed(containerRef.current);
    };
    initPostcode();
  }, [containerRef]);

  return (
    <>
      <button
        className="absolute right-0 -top-1 flex justify-center items-center p-2 bg-gray-200"
        onClick={onClose}
      >
        닫기
      </button>
      <div
        className="absolute -left-1 -right-1 -bottom-1 top-6 border-2 border-solid border-gray-200 z-110"
        ref={containerRef}
      ></div>
      ;
    </>
  );
}

export default memo(DaumPostcode);
