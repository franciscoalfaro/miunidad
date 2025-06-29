import React, { useState, useEffect } from 'react';
import { Global } from '../../helpers/Global';
import { useForm } from '../../hooks/useForm';

export const Permisos = () => {
  const {form} = useForm({});
  const [files, setFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [diskUsage, setDiskUsage] = useState({ total: 100, used: 0, available: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    obtenerEspacio()
    obtenerArchivos()
  }, [])

  const obtenerEspacio = async () => {
    try {
      const request = await fetch(Global.url + 'space/disk-space/', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
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
        },
        credentials: 'include',
      })

      const data = await request.json()
      if (data.status === 'success') {
        setFiles(data.resultado)
      } else {
        console.log(data.message)
      }
    } catch (error) {
      console.log('code', error)
    } finally {
      setLoading(false)
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
        },
        credentials: 'include',
      })
      
      const data = await request.json()
      if(data.status ==='success'){
        Swal.fire({ 
          position: "bottom-end", 
          title: data.message, 
          showConfirmButton: false, 
          timer: 1500,
          icon: 'success'
        });
      }else{
        Swal.fire({ 
          position: "bottom-end", 
          title: data.message, 
          showConfirmButton: false, 
          timer: 1500,
          icon: 'error'
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const filteredFiles = files
    .filter((file) =>
      file.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.uploadedBy.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((file) => filter === 'all' || file.status === filter);

  const usagePercentage = Math.round((diskUsage.used / diskUsage.total) * 100);

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="page-header">
        <h3>
          <i className="bi bi-shield-check me-3"></i>
          Panel de Administración
        </h3>
      </div>

      {/* Disk Usage Card */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title d-flex align-items-center mb-4">
                <i className="bi bi-hdd me-2 text-primary"></i>
                Espacio en Disco
              </h5>
              <div className="row text-center mb-4">
                <div className="col-md-4">
                  <div className="disk-info">{diskUsage.total}</div>
                  <p className="text-muted fw-semibold">GB Total</p>
                </div>
                <div className="col-md-4">
                  <div className="disk-info">{diskUsage.used}</div>
                  <p className="text-muted fw-semibold">GB Usado</p>
                </div>
                <div className="col-md-4">
                  <div className="disk-info">{diskUsage.available}</div>
                  <p className="text-muted fw-semibold">GB Disponible</p>
                </div>
              </div>
              <div className="progress disk-progress">
                <div
                  className={`progress-bar ${usagePercentage > 80 ? 'bg-danger' : usagePercentage > 60 ? 'bg-warning' : 'bg-success'}`}
                  role="progressbar"
                  style={{ width: `${usagePercentage}%` }}
                  aria-valuenow={diskUsage.used}
                  aria-valuemin="0"
                  aria-valuemax={diskUsage.total}
                >
                  {usagePercentage}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="row mb-4">
        <div className="col-md-8">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input 
              type="text" 
              placeholder="Buscar por nombre de archivo o creador..." 
              value={searchTerm} 
              onChange={handleSearch} 
              className="form-control"
            />
          </div>
        </div>
        <div className="col-md-4">
          <select 
            className="form-select" 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Todos los archivos</option>
            <option value="pending">Pendientes</option>
            <option value="approved">Aprobados</option>
          </select>
        </div>
      </div>

      {/* Files Table */}
      <div className="card">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-3 text-muted">Cargando archivos...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th className="fw-bold">
                      <i className="bi bi-person me-2"></i>
                      Creador
                    </th>
                    <th className="fw-bold">
                      <i className="bi bi-file-earmark me-2"></i>
                      Nombre del Archivo
                    </th>
                    <th className="fw-bold">
                      <i className="bi bi-gear me-2"></i>
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFiles.length > 0 ? (
                    filteredFiles.map((file) => (
                      <tr key={file._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="bg-primary bg-gradient rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
                              <i className="bi bi-person text-white"></i>
                            </div>
                            <div>
                              <div className="fw-semibold">{file.uploadedBy.name} {file.uploadedBy.surname}</div>
                              <small className="text-muted">{file.uploadedBy.email}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <i className={`bi ${
                              file.mimetype.startsWith('image/') ? 'bi-file-earmark-image text-info' :
                              file.mimetype.startsWith('video/') ? 'bi-file-earmark-play text-danger' :
                              file.mimetype === 'application/pdf' ? 'bi-file-earmark-pdf text-danger' :
                              'bi-file-earmark text-secondary'
                            } me-2`}></i>
                            <span className="fw-medium">{file.filename}</span>
                          </div>
                        </td>
                        <td>
                          <button 
                            className="btn btn-success btn-sm d-flex align-items-center" 
                            onClick={() => authorizeFile(file._id, file.uploadedBy._id)}
                          >
                            <i className="bi bi-check-circle me-1"></i>
                            Autorizar
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-5">
                        <div className="text-muted">
                          <i className="bi bi-inbox display-1 d-block mb-3"></i>
                          <h5>No se encontraron archivos</h5>
                          <p>No hay archivos que coincidan con los criterios de búsqueda</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};