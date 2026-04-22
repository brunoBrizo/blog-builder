'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@blog-builder/ui';

interface CodeBlockProps {
  language: string;
  code: string;
  className?: string;
}

export function CodeBlock({ language, code, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div
      className={cn(
        'my-6 rounded-lg overflow-hidden border border-zinc-800 bg-[#18181b]',
        className,
      )}
    >
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
        <span className="text-xs font-medium text-zinc-400">{language}</span>
        <button
          onClick={handleCopy}
          className="text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1 text-xs"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto custom-scrollbar">
        <pre className="font-mono text-sm leading-relaxed text-zinc-300">
          <code>
            {/* 
              In a real application, you would use a syntax highlighter here 
              like PrismJS, Highlight.js, or Shiki. 
              For this mockup, we are just rendering the raw string, 
              but allowing for simple HTML injection if the code string contains it.
            */}
            <span dangerouslySetInnerHTML={{ __html: code }} />
          </code>
        </pre>
      </div>
    </div>
  );
}
