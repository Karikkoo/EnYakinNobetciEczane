import React from 'react';

interface QRCodeDisplayProps {
  url: string;
  label?: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ url, label }) => {
  // Using a reliable public API for generating QR codes to avoid heavy npm dependencies in this demo format
  // In a production environment with npm access, 'qrcode.react' would be preferred.
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}&color=be185d`;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-slate-200 shadow-sm mt-6">
      <div className="bg-white p-2 rounded-xl border border-slate-100 shadow-inner">
        <img 
          src={qrImageUrl} 
          alt="Navigation QR Code" 
          className="w-48 h-48 object-contain rounded-lg"
          loading="lazy"
        />
      </div>
      <p className="mt-4 text-sm font-medium text-slate-600 text-center">
        {label || "Yol tarifi almak için okutun"}
      </p>
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="mt-3 text-xs text-red-600 hover:text-red-700 hover:underline flex items-center gap-1"
      >
        <span>Haritalarda aç</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
          <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
          <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
        </svg>
      </a>
    </div>
  );
};