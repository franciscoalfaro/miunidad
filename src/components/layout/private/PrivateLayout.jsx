import React, { useEffect } from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import { Footer } from './Footer';
import { Header } from './Header';
import { Spiner } from '../../../hooks/Spiner';


export const PrivateLayout = () => {
  const { auth, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !auth) {
      localStorage.removeItem('user');
    }
  }, [auth, loading]);

  // Si aún está cargando la autenticación, mostrar un indicador de carga.
  if (loading) {
    return <div><Spiner /></div>;
  }

  // Si la ruta contiene "/auth" y el usuario no está autenticado, redirigir al login.
  if (!auth && location.pathname.includes('/auth')) {
    return <Navigate to="/login" />;
  }

  // Si el usuario no está autenticado, redirigir al login.
  if (!auth) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Header />
      <div className="container">
        {auth._id ? <Outlet></Outlet> : <Navigate to="/"></Navigate>}
      </div>
      <Footer />
    </>
  );
};
