import apiService from './apiService';

class DirectoryService {
  async createDirectory(name, parent) {
    try {
      const data = await apiService.post('directory/create', { name, parent });
      return {
        success: data.status === 'success',
        message: data.message
      };
    } catch (error) {
      return { success: false, message: 'Error al crear directorio' };
    }
  }

  async deleteDirectory(dirId) {
    try {
      const data = await apiService.delete(`directory/delete/${dirId}`);
      return {
        success: data.status === 'success',
        message: data.message
      };
    } catch (error) {
      return { success: false, message: 'Error al eliminar directorio' };
    }
  }

  async getUserDirectories(page = 1) {
    try {
      const data = await apiService.get(`directory/list/${page}`);
      return {
        success: data.status === 'success',
        data: data.resultado,
        message: data.message
      };
    } catch (error) {
      return { success: false, message: 'Error al obtener directorios del usuario' };
    }
  }

  async getAllDirectories(page = 1) {
    try {
      const data = await apiService.get(`directory/listAll/${page}`);
      return {
        success: data.status === 'success',
        directories: data.directorios,
        totalPages: data.page,
        message: data.message
      };
    } catch (error) {
      return { success: false, message: 'Error al obtener todos los directorios' };
    }
  }
}

export default new DirectoryService();