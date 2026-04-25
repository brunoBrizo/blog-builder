'use client';

import { useState } from 'react';
import { Copy, Check, FileCode2 } from 'lucide-react';
import { cn } from '@blog-builder/ui';

interface CodeBlockProps {
  language: string;
  code: string;
  /** When `code` is HTML, copy this plain string instead */
  copyText?: string;
  variant?: 'default' | 'editorial';
  className?: string;
}

export function CodeBlock({
  language,
  code,
  copyText,
  variant = 'default',
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const textToCopy = copyText ?? code;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const isEditorial = variant === 'editorial';

  return (
    <div
      className={cn(
        isEditorial
          ? 'my-8 rounded-2xl overflow-hidden border border-zinc-800 bg-[#18181b] shadow-lg'
          : 'my-6 rounded-lg overflow-hidden border border-zinc-800 bg-[#18181b]',
        className,
      )}
    >
      <div
        className={cn(
          'flex items-center justify-between border-b border-zinc-800 bg-zinc-900',
          isEditorial ? 'px-4 py-3' : 'px-4 py-2',
        )}
      >
        <span
          className={cn(
            'text-xs font-medium text-zinc-400',
            isEditorial && 'flex items-center gap-2',
          )}
        >
          {isEditorial && <FileCode2 className="w-3.5 h-3.5 shrink-0" />}
          {language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            'text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1.5 text-xs',
            isEditorial && 'font-medium hover:text-white',
          )}
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div
        className={cn(
          'overflow-x-auto custom-scrollbar',
          isEditorial ? 'p-5' : 'p-4',
        )}
      >
        <pre className="font-mono text-sm leading-relaxed text-zinc-300">
          <code>
            <span dangerouslySetInnerHTML={{ __html: code }} />
          </code>
        </pre>
      </div>
    </div>
  );
}
