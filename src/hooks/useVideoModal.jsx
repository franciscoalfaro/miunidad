import { useState, useCallback, useRef } from 'react';
import { Global } from '../helpers/Global';

const useVideoModal = () => {
  const [videoModal, setVideoModal] = useState({ isOpen: false, videoUrl: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);

  const getCookie = (name) => {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        const [key, value] = cookie.split('=');
        if (key === name) {
            return decodeURIComponent(value);
        }
    }
    return null;
};


  const abrirVideo = useCallback(async (file) => {

    const id = file._id;
     const token = getCookie('token');

    if (!token) {
      setError('Token no encontrado. Inicie sesión nuevamente.');
      return;
    }

    const baseUrl = Global.url + 'file/play/';
    const videoUrl = `${baseUrl}${id}`;

    // Cancelar solicitud anterior si existe
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    controllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(videoUrl, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
        },credentials: 'include',
        signal: controllerRef.current.signal,
      });

      if (response.ok) {
        const blob = await response.blob();
        const videoBlobUrl = URL.createObjectURL(blob);
        
        setVideoModal({ isOpen: true, videoUrl: videoBlobUrl });
      } else {
        const responseBody = await response.json();
        setError(responseBody.message || 'Error al obtener el video.');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        setError('Error en la solicitud.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const cerrarVideo = useCallback(() => {
    if (videoModal.videoUrl) {
      URL.revokeObjectURL(videoModal.videoUrl); // Limpiar URL creada
    }
    setVideoModal({ isOpen: false, videoUrl: '' });
    controllerRef.current = null;
  }, [videoModal]);

  return { videoModal, abrirVideo, cerrarVideo, loading, error };
};

export default useVideoModal;
