import React, { useEffect, useState } from 'react'
import { Global } from '../../helpers/Global'
import useAuth from '../../hooks/useAuth'
import { Link } from 'react-router-dom'
import { Modals } from './Modals'
import Swal from 'sweetalert2'
import useVideoModal from '../../hooks/useVideoModal'
import { Spiner } from '../../hooks/Spiner'
import usePrecargarVideos from '../../hooks/usePrecargarVideos'
import Image from './Image'
import { generatePaginationNumbers } from '../../helpers/generatePagination'


export const Unidad = () => {
  const { auth } = useAuth({})
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [directoryContent, setDirectoryContent] = useState({
    files: [],
    directorios: []
  });

  useEffect(() => {
    getFolders(page)
  }, [page])


  const nextPage = () => {
    let next = page + 1;
    setPage(next);

  };
  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };



  const visiblePageNumbers = generatePaginationNumbers(totalPages, page);


  //obtener archivos y carpetas
  const getFolders = async (nextPage = 1) => {

    try {
      const request = await fetch(Global.url + 'directory/list/' + nextPage, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",

        }, credentials: 'include',

      })

      const data = await request.json()
      if (data.status === 'success') {
        setDirectoryContent(data.resultado)
        setTotalPages(data.resultado.totalPages)

      } else {
        console.log(data.message)
      }


    } catch (error) {
      console.log('code', error)
    }

  }

  //obtener enlace de descargar del archivo
  const descargarArchivo = async (fileId) => {
    try {
      const request = await fetch(Global.url + 'file/download/' + fileId, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }, credentials: 'include',
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




  //eliminar archivo

  const eliminarArchivo = async (fileId) => {
    try {
      const request = await fetch(Global.url + 'file/delete/' + fileId, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }, credentials: 'include',
      });

      const data = await request.json();
      if (data.status === 'success') {
        Swal.fire({ position: "bottom-end", title: data.message, showConfirmButton: false, timer: 1500 });
        getFolders()

      } else {
        Swal.fire({ position: "bottom-end", title: data.message, showConfirmButton: false, timer: 1500 });
        getFolders()
      }
    } catch (error) {
      console.error(error);
    }
  }

  //eliminar directorio

  const eliminarDirectorio = async (dirId) => {
    try {
      const request = await fetch(Global.url + 'directory/delete/' + dirId, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }, credentials: 'include',
      });

      const data = await request.json();
      if (data.status === 'success') {
        Swal.fire({ position: "bottom-end", title: data.message, showConfirmButton: false, timer: 1500 });
        getFolders()

      } else {
        Swal.fire({ position: "bottom-end", title: data.message, showConfirmButton: false, timer: 1500 });
        getFolders()
      }
    } catch (error) {
      console.error(error);
    }
  }

  const { videoModal, abrirVideo, cerrarVideo, loading: videoLoading } = useVideoModal();

  usePrecargarVideos(directoryContent.files);

  const handleAbrirVideo = (file) => {
    abrirVideo(file);
  };

  const handleCerrarVideo = () => {
    cerrarVideo();
  };

  const handleAbrirModal = (file) => {
    console.log('se abre modal cargando la imagen', file)
  };


  return (
    <>
      <Modals parent={directoryContent.parent} getFolders={getFolders} />

      {directoryContent.files.length === 0 && directoryContent.directorios.length === 0 ? (
        <p>No existen archivos ni directorios.</p>
      ) : (
        <div>
          <div className="row">
            {/* Directorios */}
            {directoryContent.directorios.map((dir) => (
              <div className="col-md-3 mb-4" key={dir._id}>
                <div className="card">
                  <div className="card-body">
                    <Link to={`/auth/mis-archivos/${dir._id}`} className="text-decoration-none text-dark">
                      <i className="bi bi-folder folder-icon"></i>
                    </Link>
                    <p className="mt-2">
                      <Link to={`/auth/mis-archivos/${dir._id}`} className="text-decoration-none text-dark">
                        {dir.name}
                      </Link>
                    </p>
                    <i className="bi bi-trash delete-icon" title="Eliminar" onClick={() => eliminarDirectorio(dir._id)}></i>
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
                      /*aca se mostrara la imagen traida desde el hook <i className="bi bi-file-earmark-image file-icon"></i>*/
                      <Image fileId={file._id} />

                    ) : file.mimetype.startsWith('text/') ? (
                      <i className="bi bi-file-earmark-text file-icon"></i>
                    ) : (
                      <i className="bi bi-file-earmark file-icon"></i>
                    )}

                    {/** se abre el modal de la imagen */}
                    {file.mimetype.startsWith('video/') ?
                      <p className="mt-2" onClick={() => handleAbrirVideo(file)} style={{ cursor: "pointer" }}>{file.filename}</p>
                      :

                      <p className="mt-2" onClick={() => handleAbrirModal(file)}>{file.filename}</p>
                    }

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