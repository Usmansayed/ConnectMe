'use client';

import { useRef, useEffect, type KeyboardEvent } from 'react';

interface Props {
  value: string;
  onChange: (v: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function AutoResizeTextarea({ value, onChange, onKeyDown, placeholder, disabled }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = '0px';
    const newH = Math.min(el.scrollHeight, 220);
    el.style.height = `${newH}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      disabled={disabled}
      rows={1}
      className="w-full bg-transparent resize-none px-4 py-2.5 text-[15px] text-[#f3f4f6] placeholder-[#3d3e46] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 leading-relaxed"
      style={{ minHeight: '48px', maxHeight: '220px' }}
    />
  );
}
