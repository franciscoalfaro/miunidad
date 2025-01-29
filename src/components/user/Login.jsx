import React from 'react';
import { useForm } from '../../hooks/useForm';
import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { Global } from '../../helpers/Global';
import { NavLink } from 'react-router-dom';



export const Login = () => {
    const { form, changed } = useForm({});
    const { setAuth } = useAuth();



    // Función para manejar el login del usuario
    const loginUser = async (e) => {
        e.preventDefault();

        let userLogin = form;

        const request = await fetch(Global.url + "user/login", {
            method: "POST",
            body: JSON.stringify(userLogin),
            headers: {
                "Content-Type": "application/json"
            },credentials: 'include',
           
        });

        const data = await request.json();

        if (data.status === "success") {
            // Este debe de ser localStorage que almacene el usuario solamente id, nombre
            localStorage.setItem("user", JSON.stringify(data.user));

        
            setAuth(data.user);

            Swal.fire({ position: "bottom-end", title: data.message, showConfirmButton: false, timer: 1500 });
            //navigate('/auth/'); // Usar navigate en lugar de window.location.replace
            window.location.replace('/auth');


        } else {
        
            Swal.fire({ position: "bottom-end", title: data.message, showConfirmButton: false, timer: 1500 });
        }
    };

    return (
        <section className="min-vh-100 mb-8">
            <div className="page-header align-items-start min-vh-50 pt-5 pb-11 m-3 border-radius-lg">
                <span className="mask bg-gradient-dark opacity-6"></span>
            </div>
            <div className="container">
                <div className="row mt-lg-n10 mt-md-n11 mt-n10">
                    <div className="col-xl-5 col-lg-5 col-md-7 mx-auto">
                        <div className="card z-index-0">
                            <div className="card-header text-center pt-4">
                                <h5>Iniciar Sesion</h5>
                            </div>
                            <div className="card-body">
                                <form onSubmit={loginUser}>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="">Dirección de correo</label>
                                        <input type="email" name="email" className="form-control" placeholder="Email" aria-label="Email" aria-describedby="email-addon" onChange={changed} required></input>
                                        <div id="emailHelp" className="form-text">Nunca compartiremos tu correo electrónico con nadie más.</div>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="">Contraseña</label>
                                        <input type="password" name="password" className="form-control" placeholder="Password" aria-label="Password" aria-describedby="password-addon" onChange={changed} required></input>
                                    </div>
                                    <div className="mb-3 form-check">
                                        <p className="text-sm mt-3 mb-0">No tienes cuenta? <NavLink to="/registro" className="text-dark font-weight-bolder">Regístrate</NavLink></p>
                                        <br></br>
                                        <p className="text-sm mt-3 mb-0"><NavLink to="/recuperar" className="text-dark font-weight-bolder">¿Olvidaste tu contraseña?</NavLink></p>
                                    </div>
                                    <div className="text-center">
                                        <button type="submit" className="btn btn-primary">Iniciar sesion</button>
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
