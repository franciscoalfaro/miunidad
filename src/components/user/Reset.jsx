import React, { useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { useForm } from '../../hooks/useForm'
import authService from '../../services/authService'

export const Reset = () => {
    const { form, changed } = useForm({})
    const navigate = useNavigate()
    const { token } = useParams()
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [loading, setLoading] = useState(false);

    const rest = async (e) => {
        e.preventDefault();
        setLoading(true);
       
        try {
            const result = await authService.resetPassword(token, form.newPassword);

            if (result.success) {
                setMensaje(result.message)
                setTimeout(() => {
                    navigate('/login');
                }, 1500);
            } else {
                setError(result.message)
                setTimeout(() => {
                    navigate('/login');
                }, 1500);
            }
        } catch (error) {
            console.error("Error:", error);
            setError('Ocurrió un error inesperado');
            setTimeout(() => {
                navigate('/login');
            }, 1500);
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
                                <form onSubmit={rest}>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Contraseña</label>
                                        <input 
                                            type="password" 
                                            name='newPassword' 
                                            className="form-control" 
                                            id="password" 
                                            placeholder="Ingrese su contraseña" 
                                            required 
                                            onChange={changed}
                                            disabled={loading}
                                        />
                                    </div>
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary w-100"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Procesando...
                                            </>
                                        ) : (
                                            'Restablecer Contraseña'
                                        )}
                                    </button>
                                    <div className="text-center mt-3">
                                        {mensaje && <p className="text-success">{mensaje}</p>}
                                        {error && <p className="text-danger">{error}</p>}

                                        <NavLink to="/recovery" className="d-block">¿Olvidaste tu contraseña?</NavLink>
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