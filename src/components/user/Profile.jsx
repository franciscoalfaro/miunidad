import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { SerializeForm } from '../../helpers/SerializeForm';
import { FaCamera } from "react-icons/fa6";
import authService from '../../services/authService';
import { Global } from '../../helpers/Global';

export const Profile = () => {
  const { auth, setAuth } = useAuth();
  const [saved, setSaved] = useState("not_saved");
  const [loading, setLoading] = useState(false);

  const updateUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get form data
      let newDataUser = SerializeForm(e.target);
      delete newDataUser.file0;

      // Update user profile
      const result = await authService.updateProfile(newDataUser);

      if (result.success) {
        delete result.user.password;
        setAuth({ ...auth, ...result.user });
        setSaved("saved");
        Swal.fire({ 
          position: "bottom-end", 
          title: "Usuario actualizado correctamente", 
          showConfirmButton: false, 
          timer: 1000,
          icon: 'success'
        });

        // Handle avatar upload if file is selected
        const fileInput = document.querySelector("#file0");
        if (fileInput.files[0]) {
          await handleAvatarUpload(fileInput.files[0]);
        }
      } else {
        setSaved(result.status || "error");
        Swal.fire({ 
          position: "bottom-end", 
          title: result.message, 
          showConfirmButton: false, 
          timer: 1500,
          icon: 'error'
        });
      }
    } catch (error) {
      setSaved("error");
      Swal.fire({ 
        position: "bottom-end", 
        title: "Error al actualizar usuario", 
        showConfirmButton: false, 
        timer: 1500,
        icon: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (file) => {
    try {
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();
      
      let fileToUpload = file;
      
      // Compress image if it's not a GIF
      if (fileExtension !== 'gif') {
        fileToUpload = await compressImage(file);
      }
      
      const formData = new FormData();
      formData.append('file0', fileToUpload);
      
      const result = await authService.uploadAvatar(formData);
      
      if (result.success && result.user) {
        delete result.user.password;
        setAuth({ ...auth, ...result.user });
        setTimeout(() => { window.location.reload() }, 0);
        setSaved("saved");
      } else {
        setSaved("error");
      }
    } catch (error) {
      setSaved("error");
      console.error('Error uploading avatar:', error);
    }
  };

  // Function to compress image
  async function compressImage(file, maxWidth = 800, maxHeight = 600, quality = 0.8) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            const compressedFile = new File([blob], file.name, { type: file.type });
            resolve(compressedFile);
          }, file.type, quality);
        };
      };
      reader.onerror = (error) => reject(error);
    });
  }

  return (
    <div className="container mt-5">
      <div className="col-md-6 offset-md-3">
        <div className="card shadow-sm">
          <div className="card-body">
            <h2 className="text-center mb-4">Actualizar Datos de Usuario</h2>
            <form onSubmit={updateUser}>
              <div className="mb-4 text-center">
                <label htmlFor="file0" className="d-inline-block position-relative">
                  {auth.image === 'default.png' ? (
                    <img  
                      src={`${Global.url}user/avatar/default.png`} 
                      className="rounded-circle" 
                      alt="Foto de perfil"  
                      id="profilePicPreview"  
                      width="150" 
                      height="150"
                    />
                  ) : (
                    <img 
                      src={`${Global.url}user/avatar/${auth.image}`} 
                      className="rounded-circle" 
                      alt="Foto de perfil" 
                      id="profilePicPreview" 
                      width="150" 
                      height="150" 
                    />
                  )}
                  <input 
                    type="file" 
                    id="file0" 
                    name="file0" 
                    className="d-none" 
                    accept="image/*"
                    disabled={loading}
                  />
                  <div className="position-absolute bottom-0 start-50 translate-middle-x w-100 bg-white bg-opacity-75 text-center rounded-bottom">
                    <FaCamera />
                  </div>
                </label>
              </div>

              <div className="mb-3">
                <label htmlFor="name" className="form-label">Nombre:</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  defaultValue={auth.name} 
                  className="form-control" 
                  placeholder="Nombre" 
                  required 
                  disabled={loading}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="surname" className="form-label">Apellido:</label>
                <input 
                  type="text" 
                  id="surname" 
                  name="surname" 
                  defaultValue={auth.surname} 
                  className="form-control" 
                  placeholder="Apellido" 
                  required
                  disabled={loading}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="organizacion" className="form-label">Organización:</label>
                <input 
                  type="text" 
                  id="organizacion" 
                  name="organizacion" 
                  value={auth.organizacion} 
                  className="form-control" 
                  disabled 
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password:</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  className="form-control" 
                  placeholder="Password" 
                  disabled={loading}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email:</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  defaultValue={auth.email} 
                  className="form-control" 
                  placeholder="Email" 
                  required 
                  disabled={loading}
                />
              </div>

              <div className="d-grid gap-2">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Actualizando...
                    </>
                  ) : (
                    'Actualizar'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};