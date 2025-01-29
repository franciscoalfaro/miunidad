import { useEffect } from 'react';

const useModalClose = () => {
    const closeModal = () => {
        const modal = document.querySelector("#createFolderModal");
        if (modal) {
            // Usa los métodos de Bootstrap para cerrar el modal correctamente
            const bootstrapModal = bootstrap.Modal.getInstance(modal);
            if (bootstrapModal) {
                bootstrapModal.hide();
            }
        }
    };

    useEffect(() => {
        closeModal(); // Cierra el modal cuando el componente se monta
    }, []);

    return closeModal;
};

export default useModalClose;
