import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Global } from '../../helpers/Global'
import { useForm } from '../../hooks/useForm'
import { Spiner } from '../../hooks/Spiner'

export const Recovery = () => {
  const { form, changed } = useForm({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const recuperar = async (e) => {
    e.preventDefault();
    setLoading(true); // Iniciamos el indicador de carga

    try {
      let recoverUser = form

      const request = await fetch(Global.url + "user/forgot-password", {
        method: "POST",
        body: JSON.stringify(recoverUser),
        headers: {
          "Content-Type": "application/json"
        }
      })
      const data = await request.json()
     
      if (data.status === "success") {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'En caso de existir cuenta se enviará correo con clave provisional',
          showConfirmButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            // Redirigir a la página de login
            navigate('/login');
          }
        });

      } else {
        // Mostramos un mensaje de error si la solicitud no fue exitosa
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: data.message,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      // Manejo de errores
    } finally {
      setLoading(false); // Desactivamos el indicador de carga después de la solicitud
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
                    <input type="email" className="form-control" name='email' id="email" placeholder="Ingrese su correo electrónico" onChange={changed} required></input>
                  </div>
                  <div className="col-12">
                    {loading ? (<Spiner></Spiner>
                    ) : (
                      <button type="submit" className="btn btn-primary w-100">Recuperar Clave</button>
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
