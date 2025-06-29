import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import authService from '../../services/authService';

export const Logout = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const exit = async () => {
      try {
        const result = await authService.logout();
        
        if (result.success) {
          setAuth({});
          navigate('/');
        } else {
          console.error('Error al cerrar sesión:', result.message);
          // Even if logout fails on server, clear local state
          setAuth({});
          navigate('/');
        }
      } catch (error) {
        console.error('Error en la solicitud de cierre de sesión:', error);
        // Clear local state anyway
        setAuth({});
        navigate('/');
      }
    };

    exit();
  }, [setAuth, navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Cerrando sesión...</span>
        </div>
        <p className="text-muted">Cerrando sesión...</p>
      </div>
    </div>
  );
};