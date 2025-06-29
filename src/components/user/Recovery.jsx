import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useForm } from '../../hooks/useForm'
import { Spiner } from '../../hooks/Spiner'
import authService from '../../services/authService'

export const Recovery = () => {
  const { form, changed } = useForm({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const recuperar = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await authService.forgotPassword(form.email);
      
      if (result.success) {
        Swal.fire({  
          position: 'center',  
          icon: 'success', 
          title: 'En caso de existir cuenta se enviará correo con clave provisional', 
          showConfirmButton: true, 
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/login');
          }
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: result.message,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error inesperado',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light d-flex align-items-center vh-100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-sm mt-5">
              <div className="card-body">
                <div className="text-center mb-4">
                  <img src="logo-v.png" alt="Logo Empresa" className="img-fluid" width="100"></img>
                </div>
                <h2 className="text-center mb-4">Recuperación de Clave</h2>
                <form onSubmit={recuperar}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Correo Electrónico</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      name='email' 
                      id="email" 
                      placeholder="Ingrese su correo electrónico" 
                      onChange={changed} 
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="col-12">
                    {loading ? (
                      <Spiner />
                    ) : (
                      <button type="submit" className="btn btn-primary w-100">
                        Recuperar Clave
                      </button>
                    )}
                  </div>

                  <div className="text-center mt-3">
                    <NavLink to="/" className="d-block">Volver a Iniciar Sesión</NavLink>
                    <NavLink to="/register" className="d-block">Registrarse</NavLink>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}