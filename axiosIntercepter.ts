import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import {logout} from './auth';

interface DecodedToken {
  exp: number;
}

const setupAxiosInterceptor = (
  setIsLoggedIn: (value: boolean) => void,
  navigation: any,
) => {
  axios.interceptors.request.use(
    async config => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const decoded: DecodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          await logout();
          setIsLoggedIn(false);
          navigation.navigate('Login');
          return Promise.reject(new Error('Token expired'));
        } else {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );
};

export default setupAxiosInterceptor;
