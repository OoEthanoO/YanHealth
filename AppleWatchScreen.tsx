import React, {useEffect, useState} from 'react';
import {View, Text, Button, StyleSheet, Alert} from 'react-native';
import AppleHealthKit, {HealthKitPermissions} from 'react-native-health';

const permissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.HeartRate,
      AppleHealthKit.Constants.Permissions.StepCount,
    ],
  },
} as HealthKitPermissions;

const AppleWatchScreen = ({navigation}: any): React.JSX.Element => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    AppleHealthKit.initHealthKit(permissions, (error: string) => {
      if (error) {
        Alert.alert('Error', 'HealthKit initialization failed');
        return;
      }
      setIsConnected(true);
      Alert.alert('Connected', 'Apple Watch connected successfully.');
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Apple Watch Connection</Text>
      {isConnected ? (
        <Text style={styles.connectedText}>Apple Watch is connected</Text>
      ) : (
        <Button title="Connect Apple Watch" onPress={() => {}} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  connectedText: {
    fontSize: 18,
    color: 'green',
  },
});

export default AppleWatchScreen;
