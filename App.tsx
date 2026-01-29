
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import { ReunifyState, ImageData } from './types';
import { reunifyPhotos } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<ReunifyState>({
    childImage: null,
    adultImage: null,
    resultImage: null,
    status: 'idle',
    error: null,
  });

  const handleChildImageSelect = useCallback((data: ImageData) => {
    setState(prev => ({ ...prev, childImage: data, error: null }));
  }, []);

  const handleAdultImageSelect = useCallback((data: ImageData) => {
    setState(prev => ({ ...prev, adultImage: data, error: null }));
  }, []);

  const handleReunify = async () => {
    if (!state.childImage || !state.adultImage) return;

    setState(prev => ({ ...prev, status: 'processing', error: null, resultImage: null }));

    try {
      const result = await reunifyPhotos(
        { base64: state.childImage.base64, mimeType: state.childImage.mimeType },
        { base64: state.adultImage.base64, mimeType: state.adultImage.mimeType }
      );
      setState(prev => ({ ...prev, status: 'success', resultImage: result }));
    } catch (err: any) {
      setState(prev => ({ ...prev, status: 'error', error: err.message || 'An unexpected error occurred.' }));
    }
  };

  const handleReset = () => {
    setState({
      childImage: null,
      adultImage: null,
      resultImage: null,
      status: 'idle',
      error: null,
    });
  };

  const isReady = state.childImage && state.adultImage;

  return (
    <div className="min-h-screen pb-20 px-4 flex flex-col items-center">
      <Header />

      <main className="w-full max-w-4xl space-y-12">
        {/* Step 1: Uploads */}
        {state.status === 'idle' || state.status === 'error' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-700">
            <ImageUploader 
              label="The Child" 
              description="A photo of you as a youngster"
              currentImage={state.childImage}
              onImageSelect={handleChildImageSelect}
            />
            <ImageUploader 
              label="The Adult" 
              description="A recent photo of you today"
              currentImage={state.adultImage}
              onImageSelect={handleAdultImageSelect}
            />
          </div>
        ) : null}

        {/* Status Messaging */}
        {state.status === 'processing' && (
          <div className="flex flex-col items-center justify-center space-y-6 py-20 text-center animate-pulse">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
            <div className="space-y-2">
              <h2 className="serif text-2xl font-semibold text-slate-700">Mending time...</h2>
              <p className="text-slate-400 max-w-xs mx-auto">Reunify is carefully blending your past and present into one memory.</p>
            </div>
          </div>
        )}

        {state.status === 'error' && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center text-sm border border-red-100 mb-8">
            {state.error}
          </div>
        )}

        {/* Action Button */}
        {(state.status === 'idle' || state.status === 'error') && (
          <div className="flex flex-col items-center pt-8">
            <button
              onClick={handleReunify}
              disabled={!isReady || state.status === 'processing'}
              className={`
                px-10 py-4 rounded-full font-semibold text-lg transition-all shadow-xl
                ${isReady 
                  ? 'bg-slate-800 text-white hover:bg-slate-700 active:scale-95' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
              `}
            >
              Reunify Memories
            </button>
            {!isReady && (
              <p className="mt-4 text-xs text-slate-400 italic">Please upload both photos to begin.</p>
            )}
          </div>
        )}

        {/* Result Area */}
        {state.status === 'success' && state.resultImage && (
          <div className="flex flex-col items-center space-y-8 animate-in zoom-in fade-in duration-1000">
            <div className="relative group overflow-hidden rounded-3xl shadow-2xl bg-white p-2">
              <img 
                src={state.resultImage} 
                alt="Reunification Result" 
                className="rounded-2xl w-full max-w-xl aspect-square object-cover"
              />
            </div>
            
            <div className="flex space-x-4">
              <button 
                onClick={handleReset}
                className="px-8 py-3 bg-white text-slate-600 border border-slate-200 rounded-full font-medium hover:bg-slate-50 transition-colors"
              >
                Create New
              </button>
              <a 
                href={state.resultImage} 
                download="reunify-memory.png"
                className="px-8 py-3 bg-slate-800 text-white rounded-full font-medium hover:bg-slate-700 transition-colors shadow-lg"
              >
                Download Photo
              </a>
            </div>

            <p className="text-slate-400 text-xs text-center max-w-md italic">
              "To be reunited with your past is to understand your journey."
            </p>
          </div>
        )}
      </main>

      <footer className="mt-auto py-10 text-slate-300 text-[10px] uppercase tracking-widest font-medium">
        &copy; {new Date().getFullYear()} Reunify
      </footer>
    </div>
  );
};

export default App;
