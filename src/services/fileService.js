import apiService from './apiService';

class FileService {
  async getDirectoryContent(folderId, page = 1) {
    try {
      const data = await apiService.get(`file/files/${folderId}/${page}`);
      return {
        success: data.status === 'success',
        data: data.resultado,
        message: data.message
      };
    } catch (error) {
      return { success: false, message: 'Error al obtener contenido del directorio' };
    }
  }

  async downloadFile(fileId) {
    try {
      const response = await apiService.get(`file/download/${fileId}`, { responseType: 'blob' });
      
      if (response.status === 'success') {
        const blob = response.blob;
        const url = window.URL.createObjectURL(blob);
        
        // Extract filename from Content-Disposition header
        const disposition = response.headers.get('Content-Disposition');
        let filename = '';
        
        if (disposition && disposition.indexOf('filename=') !== -1) {
          filename = disposition
            .split('filename=')[1]
            .replace(/['"]/g, '');
        }
        
        // Create download link
        const a = document.createElement('a');
        a.href = url;
        a.download = filename || `download-${fileId}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        
        // Clean up URL
        window.URL.revokeObjectURL(url);
        
        return { success: true, message: 'Archivo descargado correctamente' };
      }
    } catch (error) {
      return { success: false, message: 'Error al descargar archivo' };
    }
  }

  async deleteFile(fileId) {
    try {
      const data = await apiService.delete(`file/delete/${fileId}`);
      return {
        success: data.status === 'success',
        message: data.message
      };
    } catch (error) {
      return { success: false, message: 'Error al eliminar archivo' };
    }
  }

  async uploadFiles(parentId, formData) {
    try {
      const data = await apiService.post(`file/uploads/${parentId}`, formData);
      return {
        success: data.status === 'success',
        message: data.message
      };
    } catch (error) {
      return { success: false, message: 'Error al subir archivos' };
    }
  }

  async getVideoStream(fileId) {
    try {
      const response = await apiService.get(`file/play/${fileId}`, { responseType: 'blob' });
      
      if (response.status === 'success') {
        const blob = response.blob;
        const videoUrl = URL.createObjectURL(blob);
        return { success: true, videoUrl };
      }
    } catch (error) {
      return { success: false, message: 'Error al obtener video' };
    }
  }

  async getImage(fileId) {
    try {
      const response = await apiService.get(`file/media/${fileId}`, { responseType: 'blob' });
      
      if (response.status === 'success') {
        const blob = response.blob;
        const imageUrl = URL.createObjectURL(blob);
        return { success: true, imageUrl };
      }
    } catch (error) {
      return { success: false, message: 'Error al cargar imagen' };
    }
  }

  async getAllFiles() {
    try {
      const data = await apiService.get('file/allfiles');
      return {
        success: data.status === 'success',
        files: data.resultado,
        message: data.message
      };
    } catch (error) {
      return { success: false, message: 'Error al obtener archivos' };
    }
  }
}

export default new FileService();