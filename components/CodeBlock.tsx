import React, { useState } from 'react';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';

interface CodeBlockProps {
  code: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-opacity"
        aria-label="Copy code"
      >
        {copied ? (
          <CheckIcon className="w-5 h-5 text-green-500 dark:text-green-400" />
        ) : (
          <ClipboardIcon className="w-5 h-5" />
        )}
      </button>
      <pre className="bg-slate-100 dark:bg-black/50 text-slate-800 dark:text-slate-200 p-4 rounded-md overflow-x-auto text-sm">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  );
};