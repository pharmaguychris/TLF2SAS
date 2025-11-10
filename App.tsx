import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { OutputSection } from './components/OutputSection';
import { generateSasCode } from './services/geminiService';
import { Background } from './components/Background';

const App: React.FC = () => {
  const [tlfShell, setTlfShell] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sasCode, setSasCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!tlfShell.trim() && !selectedFile) {
      setError('Please enter a TLF mock shell or upload an image.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setSasCode('');

    try {
      const stream = generateSasCode({ tlfShell, file: selectedFile });
      for await (const chunk of stream) {
        setSasCode((prevCode) => prevCode + chunk);
      }
    } catch (err) {
      setError('An error occurred while generating the SAS code. Please check your API key and try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [tlfShell, selectedFile]);

  const handleClear = useCallback(() => {
    setTlfShell('');
    setSelectedFile(null);
    setSasCode('');
    setError(null);
  }, []);

  return (
    <div className="min-h-screen font-sans relative">
      <Background />
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
            <InputSection 
              tlfShell={tlfShell}
              setTlfShell={setTlfShell}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              onGenerate={handleGenerate}
              onClear={handleClear}
              isLoading={isLoading}
            />
            <OutputSection
              sasCode={sasCode}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </main>
        <footer className="text-center py-6 text-sm text-slate-500 dark:text-slate-400">
          <p>Powered by Google Gemini. Built for the Google Cloud Run Hackathon.</p>
          <p>TLF2SAS &copy; 2024. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;