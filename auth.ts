import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import {DEBUG} from './config';

interface DecodedToken {
  exp: number;
}

const BASE_URL = DEBUG
  ? 'http://localhost:3000'
  : 'https://yanhealth.onrender.com';

export const login = async (
  username: string,
  password: string,
  setIsLoggedIn: (value: boolean) => void,
) => {
  try {
    console.log('Attempting to log in with username:', username);
    const response = await axios.post(`${BASE_URL}/api/users/login`, {
      username,
      password,
    });
    const {token} = response.data;
    await AsyncStorage.setItem('token', token);
    setIsLoggedIn(true);
    console.log('Login successful');
  } catch (error) {
    const errorMessage =
      axios.isAxiosError(error) && error.response?.data
        ? error.response.data
        : 'An error occurred';
    console.error('Login failed:', errorMessage);
    Alert.alert('Login Failed', errorMessage);
  }
};

export const register = async (
  username: string,
  email: string,
  password: string,
) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/users/register`, {
      username,
      email,
      password,
    });
    Alert.alert('Registration Successful', 'You can now log in');
  } catch (error) {
    const errorMessage =
      axios.isAxiosError(error) && error.response?.data
        ? error.response.data
        : 'An error occurred';
    Alert.alert('Registration Failed', errorMessage);
  }
};

export const checkLoginStatus = async (
  setIsLoggedIn: (value: boolean) => void,
) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    const decoded: DecodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      await AsyncStorage.removeItem('token');
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  }
  setIsLoggedIn(!!token);
};

export const logout = async () => {
  await AsyncStorage.removeItem('token');
};
