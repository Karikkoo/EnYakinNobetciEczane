import React, { useState, useCallback } from 'react';
import { Button } from './components/Button';
import { QRCodeDisplay } from './components/QRCodeDisplay';
import { ErrorBanner } from './components/ErrorBanner';
import { findNearestPharmacy } from './services/geminiService';
import { Coordinates, PharmacyResult, AppState } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [pharmacyData, setPharmacyData] = useState<PharmacyResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleLocateAndSearch = useCallback(() => {
    setAppState(AppState.LOCATING);
    setErrorMessage('');
    setPharmacyData(null);

    if (!navigator.geolocation) {
      setErrorMessage('Tarayıcınız konum servisini desteklemiyor.');
      setAppState(AppState.ERROR);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords: Coordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        
        setAppState(AppState.SEARCHING_AI);
        
        try {
          const result = await findNearestPharmacy(coords);
          setPharmacyData(result);
          setAppState(AppState.SUCCESS);
        } catch (error) {
          setErrorMessage('Yapay zeka eczane bilgisine ulaşamadı. Lütfen daha sonra tekrar deneyin.');
          setAppState(AppState.ERROR);
        }
      },
      (error) => {
        let msg = 'Konum alınamadı.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Konum izni reddedildi. Size en yakın eczaneyi bulmak için lütfen izin verin.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Konum bilgisi şu an kullanılamıyor.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Konum alma isteği zaman aşımına uğradı.';
        }
        setErrorMessage(msg);
        setAppState(AppState.ERROR);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            Nöbetçi<span className="text-red-600">Eczane</span>
          </h1>
        </div>
      </header>

      <main className="flex-grow max-w-3xl mx-auto w-full px-4 py-8 flex flex-col items-center">
        
        {/* Intro Section */}
        {appState === AppState.IDLE && (
          <div className="text-center py-12 max-w-md">
            <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-red-50/50">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-red-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Acil Eczane mi Lazım?</h2>
            <p className="text-slate-600 mb-8 text-lg leading-relaxed">
              Yapay zeka teknolojisi ile konumunuzu analiz edip, size en yakın açık nöbetçi eczaneyi anında buluyoruz.
            </p>
            <Button 
              onClick={handleLocateAndSearch} 
              className="w-full sm:w-auto shadow-lg shadow-red-200"
            >
              En Yakın Nöbetçiyi Bul
            </Button>
          </div>
        )}

        {/* Loading States */}
        {(appState === AppState.LOCATING || appState === AppState.SEARCHING_AI) && (
          <div className="w-full max-w-md py-12 flex flex-col items-center justify-center text-center animate-fade-in">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
            </div>
            <h3 className="mt-6 text-xl font-semibold text-slate-800">
              {appState === AppState.LOCATING ? "Konumunuz Alınıyor..." : "Nöbetçi Eczaneler Taranıyor..."}
            </h3>
            <p className="mt-2 text-slate-500">
              {appState === AppState.LOCATING 
                ? "Lütfen tarayıcı izinlerini kontrol edin." 
                : "Gemini AI harita verilerini analiz ediyor..."}
            </p>
          </div>
        )}

        {/* Result Section */}
        {appState === AppState.SUCCESS && pharmacyData && (
          <div className="w-full max-w-lg animate-fade-in-up">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-500 px-6 py-4 flex justify-between items-center">
                <span className="text-white font-medium text-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                  Şu an Açık
                </span>
                <button 
                  onClick={handleLocateAndSearch}
                  className="text-white/90 text-xs font-semibold hover:text-white hover:bg-white/10 px-3 py-1 rounded-full transition-colors"
                >
                  Yenile
                </button>
              </div>
              
              <div className="p-6 md:p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  {pharmacyData.placeName || "En Yakın Eczane"}
                </h3>
                
                <div className="prose prose-slate prose-sm max-w-none text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                  {/* Rendering plain text with simple formatting since Markdown parser is not available without extra libs */}
                  <div className="whitespace-pre-line leading-relaxed">
                    {pharmacyData.text}
                  </div>
                </div>

                <div className="flex flex-col items-center">
                   {pharmacyData.mapUri && (
                    <QRCodeDisplay 
                      url={pharmacyData.mapUri} 
                      label={`${pharmacyData.placeName || 'Eczane'} için yol tarifi`}
                    />
                   )}
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
               <Button variant="outline" onClick={() => setAppState(AppState.IDLE)}>
                 Yeni Arama Yap
               </Button>
            </div>
          </div>
        )}

        {/* Error State */}
        {appState === AppState.ERROR && (
          <div className="w-full max-w-md mt-8">
            <ErrorBanner message={errorMessage} onRetry={handleLocateAndSearch} />
          </div>
        )}

      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-3xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} Nöbetçi Eczane Bulucu. Gemini AI tarafından desteklenmektedir.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;