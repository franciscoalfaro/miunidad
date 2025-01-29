import React from 'react'
import { Link } from 'react-router-dom'

export const Nav = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">Gestor de Archivos</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/login">
                                <i className="bi bi-disc"></i> Iniciar Sesion
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/register">
                                <i className="bi bi-folder-fill"></i> Registro
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}
