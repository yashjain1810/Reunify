
export interface ImageData {
  base64: string;
  mimeType: string;
  previewUrl: string;
}

export interface ReunifyState {
  childImage: ImageData | null;
  adultImage: ImageData | null;
  resultImage: string | null;
  status: 'idle' | 'processing' | 'error' | 'success';
  error: string | null;
}
