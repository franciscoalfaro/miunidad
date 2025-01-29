import React, { useState } from 'react';
import useModalClose from '../../hooks/useModalClose';
import { useForm } from '../../hooks/useForm';
import { SerializeForm } from '../../helpers/SerializeForm';
import { Global } from '../../helpers/Global';
import useUploadModal from '../../hooks/useUploadModal';
import Swal from 'sweetalert2';
import { Spiner } from '../../hooks/Spiner';
import useAuth from '../../hooks/useAuth';



export const Modals = ({ parent, getFolders }) => {
    const { auth } = useAuth({})
    const { form, changed } = useForm({});
    const closeModal = useModalClose();
    const closeUpload = useUploadModal();
    const [loading, setLoading] = useState(false); // State for loading spinner

    // Function to create a new folder
    const createFolder = async (e) => {
        e.preventDefault();
        const formData = SerializeForm(e.target);
        const folderData = {
            name: formData.name,
            parent: parent
        };

        try {
            const request = await fetch(Global.url + 'directory/create', {
                method: "POST",
                body: JSON.stringify(folderData),
                headers: {
                    "Content-Type": "application/json",
                }, credentials: 'include',
            });

            const data = await request.json();

            if (data.status === 'success') {
                Swal.fire({ position: "bottom-end", title: data.message, showConfirmButton: false, timer: 1500 });
                closeModal();
                getFolders();
            } else {
                Swal.fire({ position: "bottom-end", title: data.message, showConfirmButton: false, timer: 1500 });
            }
        } catch (error) {
            console.log('code', error);
        }
    };

    // Function to upload files
    const crearArchivo = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading spinner

        const formData = new FormData();
        const files = e.target.elements.fileUpload.files;

        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        try {
            const request = await fetch(Global.url + "file/uploads/" + parent, {
                method: "POST",
                body: formData,
                credentials: 'include',
            });

            const data = await request.json();

            if (data.status === 'success') {
                Swal.fire({ position: "bottom-end", title: data.message, showConfirmButton: false, timer: 1500 });
                closeUpload();
                getFolders();
            } else {
                Swal.fire({ position: "bottom-end", title: data.message, showConfirmButton: false, timer: 1500 });
                closeUpload();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false); // Stop loading spinner
            closeModal();
            getFolders();
            document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
        }
    };

    return (
        <>
            {loading ? (
                <Spiner /> // Muestra el spinner de carga mientras loading es true
            ) : (
                <>

                    <div className="page-header d-flex justify-content-between align-items-center">
                        <h3 className="my-4">Unidad de {auth.name} {auth.surname}</h3>
                        <div>
                            <button className="btn btn-create-folder me-2" data-bs-toggle="modal" data-bs-target="#createFolderModal">
                                <i className="bi bi-folder-plus"></i> Crear Carpeta
                            </button>
                            <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#uploadFileModal">
                                <i className="bi bi-upload"></i> Subir Archivos
                            </button>
                        </div>
                    </div>



                    <div className="modal fade" id="uploadFileModal" tabIndex="-1" aria-labelledby="uploadFileModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="uploadFileModalLabel">Subir Documentos</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={crearArchivo}>
                                        <div className="mb-3">
                                            <label htmlFor="fileUpload" className="form-label">Selecciona los archivos</label>
                                            <input type="file" className="form-control" id="fileUpload" multiple onChange={changed} />
                                        </div>
                                        <button type="submit" className="btn btn-primary">Subir Archivos</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>



                    <div className="modal fade" id="createFolderModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="exampleModalLabel">Crear Directorio</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={createFolder}>
                                        <div className="mb-3">
                                            <label htmlFor="folderName" className="form-label">Nombre de la Carpeta</label>
                                            <input type="text" name='name' className="form-control" id="folderName" placeholder="Nombre" onChange={changed}></input>
                                        </div>
                                        <button type="submit" className="btn btn-create-folder">Crear Carpeta</button>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};