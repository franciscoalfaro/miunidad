import { useState, useEffect } from "react";
import fileService from "../services/fileService";

const useImage = (imageId) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchImage = async () => {
            if (!imageId) return;

            try {
                setLoading(true);
                const result = await fileService.getImage(imageId);
                
                if (result.success) {
                    setImageUrl(result.imageUrl);
                } else {
                    setError(result.message);
                }
            } catch (error) {
                setError('Error al cargar la imagen');
            } finally {
                setLoading(false);
            }
        };

        fetchImage();

        // Cleanup function to revoke object URL
        return () => {
            if (imageUrl) URL.revokeObjectURL(imageUrl);
        };
    }, [imageId]);

    return { imageUrl, loading, error };
};

export default useImage;