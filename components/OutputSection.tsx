import React from 'react';
import { CodeBlock } from './CodeBlock';

interface OutputSectionProps {
  sasCode: string;
  isLoading: boolean;
  error: string | null;
}

const LoadingSkeleton: React.FC = () => (
    <div className="space-y-4 animate-pulse">
        <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-1/4"></div>
        <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-full"></div>
        <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-full"></div>
        <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-3/4"></div>
        <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-1/2"></div>
        <br/>
        <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-1/3"></div>
        <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-full"></div>
        <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-5/6"></div>
        <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-full"></div>
    </div>
);

export const OutputSection: React.FC<OutputSectionProps> = ({ sasCode, isLoading, error }) => {
  const renderContent = () => {
    if (isLoading && !sasCode) {
      return <LoadingSkeleton />;
    }
    if (error) {
      return (
        <div className="text-red-800 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-4 rounded-md border border-red-300 dark:border-red-600/50">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
        </div>
      );
    }
    if (sasCode) {
      return <CodeBlock code={sasCode} />;
    }
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 dark:text-slate-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
        <h3 className="text-lg font-medium text-slate-700 dark:text-white">Generated SAS Code</h3>
        <p>Your ready-to-run SAS program will appear here.</p>
      </div>
    );
  };

  return (
    <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-300 dark:border-slate-700/50 rounded-2xl shadow-2xl p-6 flex flex-col h-full min-h-[400px] lg:min-h-[616px]">
        <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">
            Output
        </h2>
        <div className="flex-grow overflow-auto">
            {renderContent()}
        </div>
    </div>
  );
};