import { useState, useEffect } from "react";
import { Global } from "../helpers/Global";
import useCookie from "./useCookie";

const useImage = (imageId) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = useCookie('access_token');
   
    useEffect(() => {
        const fetchImage = async () => {
            if (!imageId) return;

            try {
                const response = await fetch(`${Global.url}file/media/${imageId}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error(`Error al cargar la imagen: ${response.statusText}`);
                }

                const blob = await response.blob();
                const imageUrl = URL.createObjectURL(blob);
                setImageUrl(imageUrl);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchImage();

        // Limpia la URL del objeto para liberar memoria.
        return () => {
            if (imageUrl) URL.revokeObjectURL(imageUrl);
        };
    }, [imageId]);

    return { imageUrl, loading, error };
};

export default useImage;
