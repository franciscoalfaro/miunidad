import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { Global } from '../../helpers/Global';
import { SerializeForm } from '../../helpers/SerializeForm';
import { FaCamera } from "react-icons/fa6";


export const Profile = () => {
  const { auth, setAuth } = useAuth();
  const [saved, setSaved] = useState("not_saved");

  const updateUser = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    // Recoger datos del formulario
    let newDataUser = SerializeForm(e.target);
    // Eliminar datos innecesarios
    delete newDataUser.file0;

    // Actualizar usuario en la BD
    const request = await fetch(Global.url + "user/update", {
      method: "PUT",
      body: JSON.stringify(newDataUser),
      headers: {
        "Content-Type": "application/json",

      },credentials: 'include',
    });
    const data = await request.json();

    if (data.status === "success") {
      delete data.user.password;
      setAuth({ ...auth, ...data.user });
      setSaved("saved");
      Swal.fire({ position: "bottom-end", title: "usuario actualizado correctamente", showConfirmButton: false, timer: 1000 });

    } else if (data.status === "warning") {
      setSaved("warning");
    } else if (data.status === "error") {
      setSaved("error");
    }

    // Subida de imagen al servidor
    const fileInput = document.querySelector("#file0");

    if (data.status === "success" && fileInput.files[0]) {
      // Recoger imagen a subir
      const formData = new FormData();
      formData.append('file0', fileInput.files[0]);

      // Verificar la extensión del archivo
      const fileName = fileInput.files[0].name;
      const fileExtension = fileName.split('.').pop().toLowerCase();

      if (fileExtension === 'gif') {
        // Si la extensión es .gif, subir el archivo sin comprimir
        const uploadRequest = await fetch(Global.url + "user/upload", {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "application/json",
          },credentials: 'include',
        });

        const uploadData = await uploadRequest.json();

        if (uploadData.status === "success" && uploadData.user) {
          delete uploadData.password;
          setAuth({ ...auth, ...uploadData.user });
          setTimeout(() => { window.location.reload() }, 0);
          setSaved("saved");
        } else {
          setSaved("error");
        }
      } else {
        // Si no es .gif, comprimir el archivo antes de subirlo
        const compressedFile = await compressImage(fileInput.files[0]);

        // Crear un nuevo FormData con el archivo comprimido
        const compressedFormData = new FormData();
        compressedFormData.append('file0', compressedFile);

        // Subir el archivo comprimido
        const uploadRequest = await fetch(Global.url + "user/upload", {
          method: "POST",
          body: compressedFormData,
          headers: {
            "Content-Type": "application/json",
          },credentials: 'include',
        });

        const uploadData = await uploadRequest.json();

        if (uploadData.status === "success" && uploadData.user) {
          delete uploadData.password;
          setAuth({ ...auth, ...uploadData.user });
          setTimeout(() => { window.location.reload() }, 0);
          setSaved("saved");
        } else {
          setSaved("error");
        }
      }
    }
  };

  // Función para comprimir la imagen
  async function compressImage(file, maxWidth, maxHeight, quality) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          // Crear un lienzo (canvas) para dibujar la imagen comprimida
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            // Redimensionar la imagen si supera el ancho máximo
            height *= maxWidth / width;
            width = maxWidth;
          }
          if (height > maxHeight) {
            // Redimensionar la imagen si supera la altura máxima
            width *= maxHeight / height;
            height = maxHeight;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          // Dibujar la imagen en el lienzo con el tamaño redimensionado
          ctx.drawImage(img, 0, 0, width, height);
          // Convertir el lienzo a un archivo comprimido (blob)
          canvas.toBlob((blob) => {
            // Crear un nuevo archivo con el blob comprimido
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
                    <img  src={`${Global.url}user/avatar/default.png`} className="rounded-circle" alt="Foto de perfil"  id="profilePicPreview"  width="150" height="150"
                    />
                  ) : (
                    <img src={`${Global.url}user/avatar/${auth.image}`} className="rounded-circle" alt="Foto de perfil" id="profilePicPreview" width="150" height="150" />
                  )}
                  <input type="file" id="file0" name="file0" className="d-none" accept="image/*"/>
                  <div className="position-absolute bottom-0 start-50 translate-middle-x w-100 bg-white bg-opacity-75 text-center rounded-bottom">
                    <FaCamera />
                  </div>
                </label>
              </div>

              <div className="mb-3">
                <label htmlFor="name" className="form-label">Nombre:</label>
                <input type="text" id="name" name="name" defaultValue={auth.name} className="form-control" placeholder="Nombre" required />
              </div>

              <div className="mb-3">
                <label htmlFor="surname" className="form-label">Apellido:</label>
                <input type="text" id="surname" name="surname" defaultValue={auth.surname} className="form-control" placeholder="Apellido" required/>
              </div>

              <div className="mb-3">
                <label htmlFor="organizacion" className="form-label">Organización:</label>
                <input type="text" id="organizacion" name="organizacion" value={auth.organizacion} className="form-control" disabled />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password:</label>
                <input type="password" id="password" name="password" className="form-control" placeholder="Password" />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email:</label>
                <input type="email" id="email" name="email" defaultValue={auth.email} className="form-control" placeholder="Email" required />
              </div>

              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-primary">
                  Actualizar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};



