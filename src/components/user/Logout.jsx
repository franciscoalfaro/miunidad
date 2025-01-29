import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { Global } from '../../helpers/Global';

export const Logout = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const exit = async () => {
      try {
        const request = await fetch(Global.url + "user/logout", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Para enviar cookies en la solicitud
        });

        const data = await request.json();

        if (data.status === 'success') {
          console.log('Sesión cerrada con éxito');
          // Limpiar el estado de autenticación
          setAuth({});

          localStorage.removeItem('user');
          navigate('/'); // Redirigir a la página principal
        } else {
          console.error('Error al cerrar sesión:', data.message);
        }
      } catch (error) {
        console.error('Error en la solicitud de cierre de sesión:', error);
      }
    };

    // Llamar a la función para cerrar sesión
    exit();
  }, [setAuth, navigate]);

  return <div>Cerrando sesión...</div>;
};
