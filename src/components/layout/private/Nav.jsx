import React from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'

export const Nav = () => {
    const { auth } = useAuth()

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <a className="navbar-brand" href="/auth">Gestor de Archivos</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/auth">
                                <i className="bi bi-disc"></i> Mi unidad
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/auth/otras-unidades">
                                <i className="bi bi-folder-fill"></i> Otras unidades
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/auth/perfil">
                                <i className="bi bi-person-circle"></i> Perfil
                            </Link>
                        </li>

                        {auth.role === 'Admin' ? (
                            <li className="nav-item">
                                <Link className="nav-link" to="/auth/permisos">
                                    <i className="bi bi-gear-fill"></i> Permisos
                                </Link>
                            </li>
                        ) : ''}
                        <li className="nav-item">
                            <Link className="nav-link" to="/auth/logout">
                                <i className="bi bi-box-arrow-right"></i> Salir
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

    )
}
