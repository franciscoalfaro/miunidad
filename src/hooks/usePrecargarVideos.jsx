import { useEffect } from 'react';
import fileService from '../services/fileService';

const usePrecargarVideos = (files) => {
  useEffect(() => {
    const precargarVideos = async (files) => {
      // Filter only video files
      const videos = files.filter(file => file.mimetype.startsWith('video/'));

      // Iterate over videos and preload them
      for (const video of videos) {
        const id = video._id;
        const cacheKey = `video_${id}`;

        try {
          // Check if video is already cached
          const cachedVideo = localStorage.getItem(cacheKey);
          if (!cachedVideo) {
            // If not cached, load it
            const result = await fileService.getVideoStream(id);
            
            if (result.success) {
              // Save to cache (note: localStorage has size limits)
              try {
                localStorage.setItem(cacheKey, result.videoUrl);
              } catch (e) {
                // If localStorage is full, skip caching
                console.warn('Could not cache video due to storage limits');
              }
            }
          }
        } catch (error) {
          console.error('Error preloading video:', error.message);
        }
      }
    };

    if (files && files.length > 0) {
      precargarVideos(files);
    }
  }, [files]);
};

export default usePrecargarVideos;