import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';
import useVideoModal from '../../hooks/useVideoModal';
import { Spiner } from '../../hooks/Spiner';
import usePrecargarVideos from '../../hooks/usePrecargarVideos';
import Image from './Image';
import { Modals } from './Modals';
import { generatePaginationNumbers } from '../../helpers/generatePagination';


export const Archivos = () => {
  const { auth } = useAuth({});
  const params = useParams();
  const navigate = useNavigate();
  const [directoryContent, setDirectoryContent] = useState({ files: [], directorios: [], subDirectories: [] });
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  //reproduccion de video
  const { videoModal, abrirVideo, cerrarVideo, loading: videoLoading } = useVideoModal();
  usePrecargarVideos(directoryContent.files);

  const handleAbrirVideo = (file) => {
    console.log('abriendo',file)
    abrirVideo(file);
  };

  const handleCerrarVideo = () => {
    cerrarVideo();
  };

  useEffect(() => {
    fetchDirectoryContent(page)
  }, [page])

  const nextPage = () => {
    let next = page + 1;
    setPage(next);

  }
  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  }

  const visiblePageNumbers = generatePaginationNumbers(totalPages, page);


  useEffect(() => {
    // Al navegar a un nuevo directorio, guarda el ID del directorio actual en el historial
    setHistory(prevHistory => [...prevHistory, params.folderId]);
    fetchDirectoryContent();
  }, [params.folderId]);

  const fetchDirectoryContent = async (nextPage = 1) => {
    let folderId = params.folderId;

    try {
      const request = await fetch(Global.url + 'file/files/' + folderId + '/' + nextPage, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          
        },credentials: 'include',
      });
      const data = await request.json();

      if (data.status === 'success') {
        setDirectoryContent(data.resultado); // Guardamos tanto archivos como directorios
        setTotalPages(data.resultado.totalPages)
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error fetching directory content:', error);
    }
  };

  const descargarArchivo = async (fileId) => {
    try {
      const request = await fetch(Global.url + 'file/download/' + fileId, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },credentials: 'include',
      });

      if (request.ok) {
        const blob = await request.blob();
        const url = window.URL.createObjectURL(blob);

        // Extraer el nombre del archivo desde Content-Disposition (si está presente)
        const disposition = request.headers.get('Content-Disposition');

        let nombreArchivo = '';
        if (disposition && disposition.indexOf('filename=') !== -1) {
          nombreArchivo = disposition
            .split('filename=')[1]
            .replace(/['"]/g, ''); // Remover posibles comillas en el nombre
        }

        // Crear enlace y descargar
        const a = document.createElement('a');
        a.href = url;
        a.download = nombreArchivo || `descarga-${fileId}`; // Nombre por defecto si no se obtiene
        document.body.appendChild(a);
        a.click();
        a.remove();

        // Limpiar URL creada
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Error al descargar el archivo');
      }
    } catch (error) {
      console.error('Error descargando el archivo:', error);
    }
  };


  const goBack = () => {

    // Remover el último directorio del historial para obtener el directorio anterior
    setHistory(prevHistory => {
      // Copiar el historial actual
      const updatedHistory = [...prevHistory];
      const lastDirectory = updatedHistory.pop(); // Obtener y eliminar el último directorio

      // Determinar la ruta de navegación basada en el historial actualizado
      if (updatedHistory.length === 0) {
        // Si el historial está vacío, navegar a la ruta principal
        navigate('/auth/otras-unidades');
      } else if (lastDirectory) {
        // Si hay directorios en el historial, navegar al directorio anterior
        const previousDirectory = updatedHistory[updatedHistory.length - 1];
        navigate(`/auth/archivos/${previousDirectory}`);
      }

      // Actualizar el estado del historial
      return updatedHistory;
    });
  };

  const eliminarArchivo = async (fileId) => {
    try {
      const request = await fetch(Global.url + 'file/delete/' + fileId, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },credentials: 'include',
      });

      const data = await request.json();
      if (data.status === 'success') {
        Swal.fire({ position: "bottom-end", title: data.message, showConfirmButton: false, timer: 1500 });
        fetchDirectoryContent()

      } else {
        Swal.fire({ position: "bottom-end", title: data.message, showConfirmButton: false, timer: 1500 });
        fetchDirectoryContent()
      }
    } catch (error) {
      console.error(error);
    }
  }



  return (
    <>
      <Modals parent={directoryContent.parent} />
      <br />
      {(!directoryContent.files || directoryContent.files.length === 0) &&
        (!directoryContent.directorios || directoryContent.directorios.length === 0) &&
        (!directoryContent.subDirectories || directoryContent.subDirectories.length === 0) ? (
        <div>
          <p>No existen archivos ni directorios.</p>
          <button className="btn btn-secondary mt-4" onClick={goBack}>
            Volver Atrás
          </button>
        </div>
      ) : (
        <div>
          <div className="row">
            {/* Directorios */}
            {directoryContent.directorios && directoryContent.directorios.map((dir) => (
              <div className="col-md-3 mb-4" key={dir._id}>
                <div className="card">
                  <div className="card-body">
                    <i className="bi bi-folder folder-icon"></i>
                    <p className="mt-2">{dir.name}</p>
                    <Link to={`/auth/archivos/${dir._id}`} className="stretched-link"></Link>
                  </div>
                </div>
              </div>
            ))}

            {directoryContent.subDirectories && directoryContent.subDirectories.map((dir) => (
              <div className="col-md-3 mb-4" key={dir._id}>
                <div className="card">
                  <div className="card-body">
                    <i className="bi bi-folder folder-icon"></i>
                    <p className="mt-2">{dir.name}</p>
                    <Link to={`/auth/archivos/${dir._id}`} className="stretched-link"></Link>
                  </div>
                </div>
              </div>
            ))}

            {/* Archivos */}
            {directoryContent.files.map((file) => (
              <div className="col-md-3 mb-4" key={file._id}>
                <div className="card">
                  <div className="card-body">
                    {/* Determinar el icono basado en el mimetype */}
                    {file.mimetype.startsWith('video/') ? (
                      // Pasa el filepath del archivo
                      <i className="bi bi-file-earmark-play file-icon" title="Reproducir video" onClick={() => handleAbrirVideo(file)} style={{ cursor: "pointer" }}></i>
                    ) : file.mimetype === 'application/pdf' ? (
                      <i className="bi bi-file-earmark-pdf file-icon"></i>
                    ) : file.mimetype.startsWith('image/') ? (
                      <Image fileId={file._id} />
                    ) : file.mimetype.startsWith('text/') ? (
                      <i className="bi bi-file-earmark-text file-icon"></i>
                    ) : (
                      <i className="bi bi-file-earmark file-icon"></i>
                    )}

                    <p className="mt-2" onClick={() => handleAbrirVideo(file)} style={{ cursor: "pointer" }}>{file.filename} </p>

                    <i className="bi bi-download download-icon" title="Descargar" onClick={() => descargarArchivo(file._id)} ></i>
                    <i className="bi bi-trash delete-icon" title="Eliminar" onClick={() => eliminarArchivo(file._id)}></i>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modal para el reproductor de video */}
          {videoLoading && <Spiner />}
          {!videoLoading && videoModal.isOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <button className="btn-close" onClick={handleCerrarVideo}></button>
                <video src={videoModal.videoUrl} controls autoPlay style={{ width: '100%', maxHeight: '400px' }} />
              </div>
            </div>
          )}

          {history.length > 1 && (
            <button className="btn btn-secondary mt-4" onClick={goBack}>
              Volver Atrás
            </button>
          )}

        </div>
      )}
      <nav aria-label="Page navigation">
        <ul className="pagination">
          <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
            <a className="page-link" href="#" onClick={prevPage}>
              <i className="bi bi-chevron-left"></i>
            </a>
          </li>
          {visiblePageNumbers.map((pageNumber) => (
            <li key={pageNumber} className={`page-item ${page === pageNumber ? 'active' : ''}`}>
              <a className="page-link" href="#" onClick={() => setPage(pageNumber)}>
                {pageNumber}
              </a>
            </li>
          ))}
          <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
            <a className="page-link" href="#" onClick={nextPage}>
              <i className="bi bi-chevron-right"></i>
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
}