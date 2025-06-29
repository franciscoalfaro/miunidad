import React from 'react';
import { useForm } from '../../hooks/useForm';
import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { NavLink } from 'react-router-dom';
import authService from '../../services/authService';

export const Login = () => {
    const { form, changed } = useForm({});
    const { setAuth } = useAuth();
    const [loading, setLoading] = useState(false);

    const loginUser = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await authService.login(form);
            
            if (result.success) {
                setAuth(result.user);
                Swal.fire({ 
                    position: "bottom-end", 
                    title: result.message, 
                    showConfirmButton: false, 
                    timer: 1500,
                    icon: 'success'
                });
                window.location.replace('/auth');
            } else {
                Swal.fire({ 
                    position: "bottom-end", 
                    title: result.message, 
                    showConfirmButton: false, 
                    timer: 1500,
                    icon: 'error'
                });
            }
        } catch (error) {
            Swal.fire({ 
                position: "bottom-end", 
                title: "Error de conexión", 
                showConfirmButton: false, 
                timer: 1500,
                icon: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-vh-100 d-flex align-items-center">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xl-5 col-lg-6 col-md-8">
                        <div className="card shadow-lg border-0">
                            <div className="card-body p-5">
                                <div className="text-center mb-4">
                                    <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-gradient rounded-circle mb-3" style={{width: '80px', height: '80px'}}>
                                        <i className="bi bi-cloud-arrow-up text-white" style={{fontSize: '2rem'}}></i>
                                    </div>
                                    <h2 className="fw-bold text-primary mb-2">Bienvenido</h2>
                                    <p className="text-muted">Accede a tu gestor de archivos</p>
                                </div>
                                
                                <form onSubmit={loginUser}>
                                    <div className="mb-4">
                                        <label htmlFor="email" className="form-label fw-semibold">
                                            <i className="bi bi-envelope me-2"></i>
                                            Dirección de correo
                                        </label>
                                        <input 
                                            type="email" 
                                            name="email" 
                                            className="form-control form-control-lg" 
                                            placeholder="ejemplo@correo.com" 
                                            aria-label="Email" 
                                            onChange={changed} 
                                            required
                                            disabled={loading}
                                        />
                                        <div className="form-text">
                                            <i className="bi bi-info-circle me-1"></i>
                                            Nunca compartiremos tu correo electrónico
                                        </div>
                                    </div>
                                    
                                    <div className="mb-4">
                                        <label htmlFor="password" className="form-label fw-semibold">
                                            <i className="bi bi-lock me-2"></i>
                                            Contraseña
                                        </label>
                                        <input 
                                            type="password" 
                                            name="password" 
                                            className="form-control form-control-lg" 
                                            placeholder="••••••••" 
                                            aria-label="Password" 
                                            onChange={changed} 
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                    
                                    <div className="d-grid mb-4">
                                        <button 
                                            type="submit" 
                                            className="btn btn-primary btn-lg"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Iniciando sesión...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-box-arrow-in-right me-2"></i>
                                                    Iniciar sesión
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    
                                    <div className="text-center">
                                        <div className="mb-3">
                                            <NavLink to="/registro" className="text-decoration-none fw-semibold">
                                                <i className="bi bi-person-plus me-1"></i>
                                                ¿No tienes cuenta? Regístrate
                                            </NavLink>
                                        </div>
                                        <NavLink to="/recuperar" className="text-muted text-decoration-none">
                                            <i className="bi bi-question-circle me-1"></i>
                                            ¿Olvidaste tu contraseña?
                                        </NavLink>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};