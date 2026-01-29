
import React from 'react';
import { ImageData } from '../types';

interface ImageUploaderProps {
  label: string;
  description: string;
  onImageSelect: (data: ImageData) => void;
  currentImage: ImageData | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ label, description, onImageSelect, currentImage }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        onImageSelect({
          base64: base64String,
          mimeType: file.type,
          previewUrl: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
      <span className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-1">{label}</span>
      <p className="text-xs text-slate-400 mb-4">{description}</p>
      
      <div className="relative group w-full aspect-square max-w-[200px] mb-4 overflow-hidden rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer">
        {currentImage ? (
          <>
            <img src={currentImage.previewUrl} alt={label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xs font-medium">Change Photo</span>
            </div>
          </>
        ) : (
          <div className="text-slate-300 flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-xs">Click to upload</span>
          </div>
        )}
        <input 
          type="file" 
          accept="image/*" 
          className="absolute inset-0 opacity-0 cursor-pointer" 
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default ImageUploader;
