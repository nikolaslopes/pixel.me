'use client';

import '@/i18n/config';
import { Header } from './_components/Header';
import { ErrorMessage } from './_components/ErrorMessage';
import { UploadSection } from './_components/UploadSection';
import { SettingsGroup } from './_components/SettingsGroup';
import { ImageGroup } from './_components/ImageGroup';
import { Footer } from './_components/Footer';
import { useHomeController } from './_hooks/useHomeController';
import { BackToTopButton } from '@/components/BackToTopButton';

const Home: React.FC = () => {
  const {
    loading,
    error,
    canvasRef,
    fileInputRef,
    originalImage,
    settings,
    activePreset,
    pixelArtImage,
    handleImageUpload,
    handleSettingsChange,
    handleResetSettings,
    handleDownloadImage,
    handleUploadClick,
    handleAddNewImage,
    applyPreset,
  } = useHomeController();

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
        <div className="mx-auto max-w-6xl">
          <Header />

          {error && <ErrorMessage message={error} />}

          <main>
            <UploadSection
              fileInputRef={fileInputRef}
              onUploadClick={handleUploadClick}
              onImageUpload={handleImageUpload}
            />

            {originalImage && (
              <SettingsGroup
                onResetSettings={handleResetSettings}
                onAddNewImage={handleAddNewImage}
                settings={settings}
                activePreset={activePreset}
                onSettingsChange={handleSettingsChange}
                onPresetChange={applyPreset}
              />
            )}

            <ImageGroup
              loading={loading}
              originalImage={originalImage}
              pixelArtImage={pixelArtImage}
              onDownload={handleDownloadImage}
            />

            <canvas ref={canvasRef} className="hidden" />
          </main>
        </div>

        <Footer />
      </div>

      <BackToTopButton />
    </>
  );
};

export default Home;
