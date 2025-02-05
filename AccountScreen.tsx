import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {logout} from './auth';

const AccountScreen = ({navigation, setIsLoggedIn}: any): React.JSX.Element => {
  const handleLogout = async () => {
    await logout();
    setIsLoggedIn(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account</Text>
      <Button title="Logout" onPress={handleLogout} />
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
});

export default AccountScreen;
