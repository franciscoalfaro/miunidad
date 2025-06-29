import apiService from './apiService';

class PermissionService {
  async authorizeFile(fileId, userId) {
    try {
      const data = await apiService.post('permision/autorizacion', { fileId, userId });
      return {
        success: data.status === 'success',
        message: data.message
      };
    } catch (error) {
      return { success: false, message: 'Error al autorizar archivo' };
    }
  }

  async getDiskSpace() {
    try {
      const data = await apiService.get('space/disk-space/');
      return {
        success: data.status === 'success',
        diskUsage: data,
        message: data.message
      };
    } catch (error) {
      return { success: false, message: 'Error al obtener espacio en disco' };
    }
  }
}

export default new PermissionService();