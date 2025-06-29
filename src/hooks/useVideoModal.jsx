import { useState, useCallback, useRef } from 'react';
import fileService from '../services/fileService';

const useVideoModal = () => {
  const [videoModal, setVideoModal] = useState({ isOpen: false, videoUrl: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);

  const abrirVideo = useCallback(async (file) => {
    const id = file._id;

    // Cancel previous request if exists
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    controllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      const result = await fileService.getVideoStream(id);

      if (result.success) {
        setVideoModal({ isOpen: true, videoUrl: result.videoUrl });
      } else {
        setError(result.message || 'Error al obtener el video.');
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
      URL.revokeObjectURL(videoModal.videoUrl);
    }
    setVideoModal({ isOpen: false, videoUrl: '' });
    controllerRef.current = null;
  }, [videoModal]);

  return { videoModal, abrirVideo, cerrarVideo, loading, error };
};

export default useVideoModal;