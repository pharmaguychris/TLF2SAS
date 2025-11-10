import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white/30 dark:bg-black/20 backdrop-blur-lg border-b border-slate-300/80 dark:border-slate-700/80 sticky top-0 z-20">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-center flex-grow">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">TLF2SAS</h1>
          <p className="mt-1 text-md md:text-lg text-slate-600 dark:text-slate-300">
            Generate SAS Code from TLF Mock Shells Instantly
          </p>
        </div>
      </div>
    </header>
  );
};