import React, { useRef } from 'react';

interface handleClipboardInput {
  defaultContent: string;
  onSucceed: () => void;
  onFailed: () => void;
}

type TUseClipBoard = (
  input: handleClipboardInput,
) => {
  handleClipboard: (e: React.MouseEvent) => void;
  setCopyContent: (room_id: string) => void;
};

export const useClipboard: TUseClipBoard = ({
  onSucceed,
  onFailed,
  defaultContent,
}: handleClipboardInput) => {
  const contentRef = useRef<string>('');
  const setCopyContent = (content: string) => {
    contentRef.current = content;
  };

  const handleClipboard = (e: React.MouseEvent) => {
    if (!navigator.clipboard) {
      let textarea = document.createElement('textarea');
      textarea.readOnly = true;
      textarea.style.position = 'fixed';
      textarea.value = `${defaultContent}${contentRef.current}`;
      document.body.appendChild(textarea);

      textarea.select();

      const range = document.createRange();
      range.selectNodeContents(textarea);

      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);

      textarea.setSelectionRange(0, textarea.value.length);
      const result = document.execCommand('copy');
      textarea.remove();

      if (result) onSucceed();
      else onFailed();

      return;
    }

    navigator.clipboard
      .writeText(`${defaultContent}${contentRef.current}`)
      .then(() => onSucceed())
      .catch(() => onFailed());
  };

  return { handleClipboard, setCopyContent };
};
