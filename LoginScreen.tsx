import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Alert} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({navigation}: any): React.JSX.Element => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3000/api/users/login',
        {
          username,
          password,
        },
      );
      const {token} = response.data;
      await AsyncStorage.setItem('token', token);
      Alert.alert('Login Successful', `Token: ${token}`);
      navigation.navigate('MainApp');
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data
          ? error.response.data
          : 'An error occurred';
      Alert.alert('Login Failed', errorMessage);
    }
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3000/api/users/register',
        {
          username,
          email,
          password,
        },
      );
      Alert.alert('Registration Successful', 'You can now log in');
      setIsRegistering(false);
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data
          ? error.response.data
          : 'An error occurred';
      Alert.alert('Registration Failed', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isRegistering ? 'Register' : 'Login'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {isRegistering && (
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Button
        title={isRegistering ? 'Register' : 'Login'}
        onPress={isRegistering ? handleRegister : handleLogin}
      />
      <Button
        title={isRegistering ? 'Switch to Login' : 'Switch to Register'}
        onPress={() => setIsRegistering(!isRegistering)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default LoginScreen;
