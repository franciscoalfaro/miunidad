import React from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../context/AuthProvider'
import { Recovery } from '../components/user/Recovery'
import { Login } from '../components/user/Login'
import { PrivateLayout } from '../components/layout/private/PrivateLayout'
import { PublicLayout } from '../components/layout/public/PublicLayout'
import { Register } from '../components/user/Register'
import { Profile } from '../components/user/Profile'
import { Unidad } from '../components/administracion/Unidad'
import { Otros } from '../components/administracion/Otros'
import { Logout } from '../components/user/Logout'
import { Archivos } from '../components/administracion/Archivos'
import { MyFiles } from '../components/administracion/MyFiles'
import { Permisos } from '../components/administracion/Permisos'
import { Reset } from '../components/user/Reset'

export const Routing = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/*Publico */}
          <Route path='/' element={<PublicLayout></PublicLayout>}>
            <Route index element={<Login></Login>}></Route>
            <Route path='login' element={<Login></Login>}></Route>
            <Route path='recovery' element={<Recovery></Recovery>}></Route>
            <Route path='register' element={<Register></Register>}></Route>
            <Route path='reset-password/:token' element={<Reset></Reset>}></Route>
          </Route>

          
          {/*Privado */}
          <Route path='/auth' element={<PrivateLayout></PrivateLayout>}>
            <Route index element={<Unidad></Unidad>}></Route>
            <Route path='perfil' element={<Profile></Profile>}></Route>
            <Route path='mi-unidad' element={<Unidad></Unidad>}></Route>
            <Route path='archivos/:folderId' element={<Archivos></Archivos>}></Route>
            <Route path='mis-archivos/:folderId' element={<MyFiles>+</MyFiles>}></Route>
            <Route path='otras-unidades' element={<Otros></Otros>}></Route>
            <Route path='permisos' element={<Permisos></Permisos>}></Route>
            <Route path='logout' element={<Logout></Logout>}></Route>
          </Route>



          <Route path='*' element={<><h1><p>Error 404 <Link to="/">Volver Al inicio</Link></p></h1></>}></Route>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
