import { jwtDecode } from 'jwt-decode';

class AuthService {
  getProfile() {
    const token = this.getToken();
    if (!token) return null;
    const decoded = jwtDecode(token); // Use jwtDecode directly
    return decoded;
  }

  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token) {
    try {
      const decoded = jwtDecode(token); // Use jwtDecode directly
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      return false;
    }
  }

  getToken() {
    return localStorage.getItem('id_token');
  }

  login(idToken) {
    localStorage.setItem('id_token', idToken);
  }

  logout() {
    console.log('Logging out...');
    localStorage.removeItem('id_token');
    console.log('Token removed:', !localStorage.getItem('id_token')); // Check if token is removed
    window.location.assign('/login');
  }
}

export default new AuthService();
