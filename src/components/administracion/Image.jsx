import React from 'react';
import useImage from '../../hooks/useImage';

const Image = ({ fileId }) => {
  const { imageUrl, loading, error } = useImage(fileId);

  if (loading) {
    return <p>Cargando imagen...</p>; // Muestra un texto mientras se carga
  }

  if (error) {
    return <p>Error al cargar la imagen: {error}</p>; // Muestra el error si ocurre
  }

  return <img src={imageUrl} loading="lazy" alt="Imagen del archivo" className="img-fluid" />;
};

export default Image;
