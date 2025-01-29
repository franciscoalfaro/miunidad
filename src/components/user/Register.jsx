import React from 'react'
import { NavLink } from 'react-router-dom'

export const Register = () => {
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="card shadow-sm mt-5">
                        <div className="card-body">
                            <div className="text-center mb-4">
                                <img src="src/assets/img/logo-v.png" alt="Logo Empresa" className="img-fluid" width="100"></img>
                            </div>
                            <h2 className="text-center mb-4">Registro</h2>
                            <form>
                                <div className="mb-3">
                                    <label for="name" className="form-label">Nombre</label>
                                    <input type="text" className="form-control" id="name" placeholder="Ingrese su nombre" required></input>
                                </div>
                                <div className="mb-3">
                                    <label for="email" className="form-label">Correo Electrónico</label>
                                    <input type="email" className="form-control" id="email" placeholder="Ingrese su correo electrónico" required></input>
                                </div>
                                <div className="mb-3">
                                    <label for="password" className="form-label">Contraseña</label>
                                    <input type="password" className="form-control" id="password" placeholder="Ingrese su contraseña" required></input>
                                </div>
                                <div className="mb-3">
                                    <label for="confirmPassword" className="form-label">Confirmar Contraseña</label>
                                    <input type="password" className="form-control" id="confirmPassword" placeholder="Confirme su contraseña" required></input>
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Registrarse</button>
                                <div className="text-center mt-3">
                                    <NavLink to="/" className="d-block">Ya tengo una cuenta. Iniciar Sesión</NavLink>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
