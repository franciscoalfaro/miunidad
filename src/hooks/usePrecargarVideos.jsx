import { useEffect } from 'react';
import { Global } from '../helpers/Global';

const usePrecargarVideos = (files) => {




  useEffect(() => {
    const precargarVideos = async (files) => {

      // Filtrar solo los archivos de tipo video
      const videos = files.filter(file => file.mimetype.startsWith('video/'));

      // Iterar sobre los videos y precargarlos
      for (const video of videos) {
        const id = video._id;
        const videoUrl = `${Global.url}file/play/${id}`;

        try {
          // Verificar si el video ya está en caché
          const cachedVideo = localStorage.getItem(videoUrl);
          if (!cachedVideo) {
            // Si no está en caché, cargarlo
            const response = await fetch(videoUrl, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
            });

            if (!response.ok) {
              console.error('Error al obtener el video:', videoUrl);
              continue;
            }

            const blob = await response.blob();
            const videoBlobUrl = URL.createObjectURL(blob);

            // Guardar en caché
            localStorage.setItem(videoUrl, videoBlobUrl);
          }
        } catch (error) {
          console.error('Error al cargar video:', error.message);
        }
      }
    };

    if (files && files.length > 0) {
      precargarVideos(files);
    }
  }, [files]);
};

export default usePrecargarVideos;
