import React, { useEffect } from 'react';
import useAuth from '../../../hooks/useAuth';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export const PublicLayout = () => {
  const { auth } = useAuth({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth) {
      localStorage.removeItem('user');
      navigate('/');
    }
  }, [auth, navigate]);

  return (
    <>
      <Header></Header>
      {!auth.id ? <Outlet></Outlet> : <Navigate to="/auth"></Navigate>}
      <Footer></Footer>
    </>
  );
};
