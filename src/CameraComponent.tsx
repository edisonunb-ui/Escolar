
import React, { useState, useRef, useEffect } from 'react';
import { Camera } from 'react-camera-pro';

interface CameraComponentProps {
  onCapture: (dataUrl: string, blob: Blob) => void; // Corrigido: dataUrl primeiro
  onClose: () => void;
}

const CameraComponent: React.FC<CameraComponentProps> = ({ onCapture, onClose }) => {
  const cameraRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [numberOfCameras, setNumberOfCameras] = useState(0);
  const [image, setImage] = useState<{ blob: Blob; dataUrl: string; previewUrl: string; } | null>(null);
  const [facingMode, setFacingMode] = useState('environment');

  useEffect(() => {
    const timer = setTimeout(() => {
        if(cameraRef.current) {
            setNumberOfCameras(cameraRef.current.getNumberOfCameras());
        }
    }, 100);
    
    return () => {
        if (image?.previewUrl) {
            URL.revokeObjectURL(image.previewUrl);
        }
        clearTimeout(timer);
    };
  }, [image]);

  const processImage = (src: string) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const maxWidth = 800;
      const scaleSize = maxWidth / img.width;
      canvas.width = maxWidth;
      canvas.height = img.height * scaleSize;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        
        canvas.toBlob((blob) => {
            if (blob) {
                const previewUrl = URL.createObjectURL(blob);
                setImage({ blob, dataUrl: resizedDataUrl, previewUrl });
            }
        }, 'image/jpeg', 0.8);
      }
    };
  };

  const handleTakePhoto = () => {
    if (cameraRef.current) {
      const photo = cameraRef.current.takePhoto();
      processImage(photo);
    }
  };

  const handleConfirmPhoto = () => {
    if (image) {
      onCapture(image.dataUrl, image.blob); // Corrigido: dataUrl primeiro
      onClose();
    }
  };

  const handleRetakePhoto = () => {
    if (image?.previewUrl) {
        URL.revokeObjectURL(image.previewUrl);
    }
    setImage(null);
  };

  const handleSwitchCamera = () => {
    setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          processImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const overlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: '#000', zIndex: 1000, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' };
  const imagePreviewStyle: React.CSSProperties = { position: 'relative', width: '100%', height: '100%' };
  const fullScreenImage: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'contain' };
  const controlsStyle: React.CSSProperties = { position: 'absolute', bottom: '20px', width: '100%', display: 'flex', justifyContent: 'space-around', alignItems: 'center' };
  const buttonStyle: React.CSSProperties = { backgroundColor: 'rgba(255, 255, 255, 0.8)', border: 'none', borderRadius: '10px', padding: '15px 25px', fontSize: '18px', cursor: 'pointer', color: '#000', fontWeight: 'bold' };
  const captureButtonStyle: React.CSSProperties = { backgroundColor: 'white', border: '6px solid rgba(0, 0, 0, 0.5)', borderRadius: '50%', width: '70px', height: '70px', cursor: 'pointer' };
  const topControlsStyle: React.CSSProperties = { position: 'absolute', top: '20px', width: '100%', display: 'flex', justifyContent: 'space-between', padding: '0 20px' };

  return (
    <div style={overlayStyle}>
      {image ? (
        <div style={imagePreviewStyle}>
          <img src={image.previewUrl} alt="Preview" style={fullScreenImage} />
          <div style={controlsStyle}>
            <button onClick={handleRetakePhoto} style={buttonStyle}>Tirar Novamente</button>
            <button onClick={handleConfirmPhoto} style={{ ...buttonStyle, backgroundColor: '#28a745', color: 'white' }}>Confirmar</button>
          </div>
        </div>
      ) : (
        <>
          <Camera ref={cameraRef} facingMode={facingMode as 'user' | 'environment'} aspectRatio={'cover'} numberOfCamerasCallback={setNumberOfCameras} errorMessages={{ noCameraAccessible: 'Câmera não acessível.', permissionDenied: 'Permissão negada.', switchCamera: 'Não é possível trocar de câmera.', canvas: 'Canvas não é suportado.' }}/>
          <div style={topControlsStyle}>
              <button onClick={onClose} style={{ ...buttonStyle, padding: '10px', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white' }} aria-label="Fechar Câmera">❌</button>
              {numberOfCameras > 1 && (<button onClick={handleSwitchCamera} style={{ ...buttonStyle, padding: '10px', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white' }} aria-label="Trocar Câmera">🔄</button>)}
          </div>
          <div style={{ ...controlsStyle, justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
            <button onClick={handleTakePhoto} style={captureButtonStyle} aria-label="Tirar Foto"></button>
            <button onClick={handleUploadClick} style={{...buttonStyle, marginLeft: '20px'}}>Buscar do Arquivo</button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }}/>
          </div>
        </>
      )}
    </div>
  );
};

export default CameraComponent;
