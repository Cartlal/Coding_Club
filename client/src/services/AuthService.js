import axiosInstance from './axiosInstance';

export const AuthService = {
  // User registration
  registerUser: (data) => {
    return axiosInstance.post('/auth/user/register', data);
  },

  // User login
  loginUser: (email, password) => {
    return axiosInstance.post('/auth/user/login', { email, password });
  },

  // Admin login
  loginAdmin: (username, password) => {
    return axiosInstance.post('/auth/admin/login', { username, password });
  },

  // Master login
  loginMaster: (username, password) => {
    return axiosInstance.post('/auth/master/login', { username, password });
  },
};

export default AuthService;
