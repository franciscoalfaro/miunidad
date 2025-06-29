import apiService from './apiService';

class AuthService {
  async login(credentials) {
    try {
      const data = await apiService.post('user/login', credentials);
      
      if (data.status === 'success') {
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true, user: data.user, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: 'Error de conexión' };
    }
  }

  async logout() {
    try {
      const data = await apiService.post('user/logout');
      
      if (data.status === 'success') {
        localStorage.removeItem('user');
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: 'Error al cerrar sesión' };
    }
  }

  async updateProfile(userData) {
    try {
      const data = await apiService.put('user/update', userData);
      return {
        success: data.status === 'success',
        user: data.user,
        message: data.message,
        status: data.status
      };
    } catch (error) {
      return { success: false, message: 'Error al actualizar perfil' };
    }
  }

  async uploadAvatar(formData) {
    try {
      const data = await apiService.post('user/upload', formData);
      return {
        success: data.status === 'success',
        user: data.user,
        message: data.message
      };
    } catch (error) {
      return { success: false, message: 'Error al subir imagen' };
    }
  }

  async forgotPassword(email) {
    try {
      const data = await apiService.post('user/forgot-password', { email });
      return {
        success: data.status === 'success',
        message: data.message
      };
    } catch (error) {
      return { success: false, message: 'Error en la solicitud' };
    }
  }

  async resetPassword(token, newPassword) {
    try {
      const data = await apiService.post(`user/reset-password/${token}`, { newPassword });
      return {
        success: data.status === 'success',
        message: data.message
      };
    } catch (error) {
      return { success: false, message: 'Error al restablecer contraseña' };
    }
  }
}

export default new AuthService();