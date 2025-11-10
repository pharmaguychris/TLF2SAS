import React, { useRef, useState, useCallback } from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { UploadIcon } from './icons/UploadIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface InputSectionProps {
  tlfShell: string;
  setTlfShell: (value: string) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  onGenerate: () => void;
  onClear: () => void;
  isLoading: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ tlfShell, setTlfShell, selectedFile, setSelectedFile, onGenerate, onClear, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const removeFile = useCallback(() => {
    setSelectedFile(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }, [setSelectedFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setTlfShell('');
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      if (e.dataTransfer.files[0].type.startsWith('image/')) {
        setSelectedFile(e.dataTransfer.files[0]);
        setTlfShell('');
      } else {
        alert('Please upload a valid image file (e.g., PNG, JPG).');
      }
    }
  };

  return (
    <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-300 dark:border-slate-700/50 rounded-2xl shadow-2xl p-6 flex flex-col h-full">
      <label htmlFor="tlf-shell" className="block text-lg font-semibold mb-2 text-slate-800 dark:text-slate-200">
        TLF Mock Shell
      </label>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        Paste your description, or upload a screenshot of your mock shell. For PDFs, please take a screenshot and upload the image.
      </p>
      <textarea
        id="tlf-shell"
        value={tlfShell}
        onChange={(e) => {
            setTlfShell(e.target.value);
            if (e.target.value && selectedFile) {
                removeFile();
            }
        }}
        placeholder="e.g., Table 14.1.1: Demographics and Baseline Characteristics..."
        className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md bg-white/50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out resize-none min-h-[200px] lg:min-h-[350px] disabled:bg-slate-200 dark:disabled:bg-slate-700/50 disabled:cursor-not-allowed"
        disabled={isLoading || !!selectedFile}
      />
      
      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-slate-300 dark:border-slate-600"></div>
        <span className="flex-shrink mx-4 text-slate-500 dark:text-slate-500 text-sm">OR</span>
        <div className="flex-grow border-t border-slate-300 dark:border-slate-600"></div>
      </div>

      {selectedFile ? (
        <div className="p-3 bg-blue-100/80 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-800 rounded-md flex items-center justify-between">
          <p className="text-sm text-blue-800 dark:text-blue-200 truncate pr-2">
            {selectedFile.name}
          </p>
          <button 
            onClick={removeFile}
            disabled={isLoading}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 disabled:opacity-50"
            aria-label="Remove file"
            >
             <XCircleIcon className="w-6 h-6" />
          </button>
        </div>
      ) : (
        <div
            onClick={() => !isLoading && fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-md cursor-pointer transition-colors ${
              isLoading ? 'cursor-not-allowed bg-slate-200 dark:bg-slate-800' : 'hover:border-blue-500 hover:bg-slate-100 dark:hover:bg-slate-700/50'
            } ${
              isDragging ? 'border-blue-500 bg-blue-100 dark:bg-blue-900/40' : 'border-slate-400 dark:border-slate-600'
            }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
            disabled={isLoading}
          />
          <UploadIcon className="w-8 h-8 text-slate-400 dark:text-slate-500 mb-2" />
          <p className="text-slate-600 dark:text-slate-300 text-center text-sm">
            <span className="font-semibold text-blue-500 dark:text-blue-400">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">PNG, JPG, or WEBP</p>
        </div>
      )}

      <div className="flex items-center justify-end space-x-4 mt-4">
        <button
          onClick={onClear}
          disabled={isLoading || (!tlfShell && !selectedFile)}
          className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-transparent rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Clear
        </button>
        <button
          onClick={onGenerate}
          disabled={isLoading || (!tlfShell && !selectedFile)}
          className="inline-flex items-center justify-center px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-md shadow-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5 mr-2" />
              Generate SAS Code
            </>
          )}
        </button>
      </div>
    </div>
  );
};