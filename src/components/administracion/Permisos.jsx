import React, { useState, useEffect } from 'react';
import { Global } from '../../helpers/Global';
import { useForm } from '../../hooks/useForm';

export const Permisos = () => {
  const {form} = useForm({});
  const [files, setFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [diskUsage, setDiskUsage] = useState({ total: 100, used: 0, available: 0 });

  useEffect(() => {
    obtenerEspacio()
    obtenerArchivos()
    setDiskUsage(diskUsage);
  }, [])


  const obtenerEspacio = async () => {

    try {
      const request = await fetch(Global.url + 'space/disk-space/', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",

        },credentials: 'include',

      })

      const data = await request.json()
      if (data.status === 'success') {
        setDiskUsage(data)
      } else {
        console.log(data.message)
      }
    } catch (error) {
      console.log('code', error)
    }

  }

  const obtenerArchivos = async () => {

    try {
      const request = await fetch(Global.url + 'file/allfiles', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",

        },credentials: 'include',

      })

      const data = await request.json()
      if (data.status === 'success') {
        setFiles(data.resultado)
        
      } else {
        console.log(data.message)
      }
    } catch (error) {
      console.log('code', error)
    }

  }


  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const authorizeFile = async(fileId, userId ) => {


    try {
      const request = await fetch(Global.url + 'permision/autorizacion', {
        method: "POST",
        body: JSON.stringify({fileId,userId}),
        headers: {
          "Content-Type": "application/json",

        },credentials: 'include',

      })
      const data = await request.json()
      if(data.status ==='success'){
        Swal.fire({ position: "bottom-end", title: data.message, showConfirmButton: false, timer: 1500 });
      }else{
        Swal.fire({ position: "bottom-end", title: data.message, showConfirmButton: false, timer: 1500 });
      }


    } catch (error) {

    }
  };

  const filteredFiles = files
    .filter((file) =>
      file.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.uploadedBy.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((file) => filter === 'all' || file.status === filter);

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">Permisos de Archivos</h1>

      {/* Cuadro de información de espacio en disco */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="card-title text-center">Espacio en Disco</h5>
          <div className="row text-center">
            <div className="col">
              <div className="disk-info">{diskUsage.total} GB</div>
              <p className="text-muted">Total</p>
            </div>
            <div className="col">
              <div className="disk-info">{diskUsage.used} GB</div>
              <p className="text-muted">Usado</p>
            </div>
            <div className="col">
              <div className="disk-info">{diskUsage.available} GB</div>
              <p className="text-muted">Disponible</p>
            </div>
          </div>
          <div className="progress disk-progress">
            <div
              className={`progress-bar ${(diskUsage.used / diskUsage.total) * 100 > 80 ? 'bg-danger' : 'bg-success'}`} role="progressbar" style={{ width: `${(diskUsage.used / diskUsage.total) * 100}%` }} aria-valuenow={diskUsage.used} aria-valuemin="0" aria-valuemax={diskUsage.total}>
              {Math.round((diskUsage.used / diskUsage.total) * 100)}%
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6 mb-3">
          <input type="text" placeholder="Buscar por nombre o creador..." value={searchTerm} onChange={handleSearch} className="form-control" />
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Creador</th>
              <th>Nombre del Archivo</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {filteredFiles.length > 0 ? (
              filteredFiles.map((file) => (
                <tr key={file._id}>
                  <td>{file.uploadedBy.name} {file.uploadedBy.surname}</td>
                  <td>{file.filename}</td>
                  <td>
                    <button className="btn btn-success btn-sm" onClick={() => authorizeFile(file._id, file.uploadedBy._id)}>
                      Autorizar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No se encontraron archivos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
