import React, { useRef, useState } from 'react';
import imageCompression from 'browser-image-compression';
import { Upload, X } from 'lucide-react';

interface Props {
  currentImageUrl?: string;
  onImageSelected: (file: File, preview: string) => void;
  onRemove?: () => void;
  label?: string;
  aspectRatio?: 'square' | 'free';
}

export const ImageUploader: React.FC<Props> = ({
  currentImageUrl,
  onImageSelected,
  onRemove,
  label = 'Foto',
  aspectRatio = 'square',
}) => {
  const inputRef            = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setLoading(true);
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.4,
        maxWidthOrHeight: 900,
        useWebWorker: true,
        fileType: 'image/webp',
        initialQuality: 0.82,
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        onImageSelected(compressed as File, base64);
      };
      reader.readAsDataURL(compressed);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const display = preview || currentImageUrl;
  const aspect  = aspectRatio === 'square' ? 'aspect-square' : 'aspect-video';

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>

      {display ? (
        <div className="relative">
          <img
            src={display}
            alt="Preview"
            className={`w-full ${aspect} object-cover rounded-xl border border-gray-200 bg-gray-50`}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-black transition-colors"
          >
            Trocar foto
          </button>
          <button
            type="button"
            onClick={() => {
              setPreview(null);
              onRemove?.();
              if (inputRef.current) inputRef.current.value = '';
            }}
            className="absolute top-2 right-2 w-7 h-7 bg-black/70 text-white rounded-lg flex items-center justify-center hover:bg-black transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          className={`${aspect} max-h-52 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-black transition-colors bg-gray-50`}
        >
          {loading ? (
            <div className="flex flex-col items-center gap-2 text-gray-400">
              <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs">Otimizando imagem…</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-400 px-4 text-center">
              <Upload size={24} />
              <span className="text-sm font-medium">Clique ou arraste a imagem</span>
              <span className="text-xs">JPG, PNG, WEBP — comprimida automaticamente</span>
            </div>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => {
          const f = e.target.files?.[0];
          if (f) processFile(f);
        }}
      />
    </div>
  );
};
