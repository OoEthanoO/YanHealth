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

  useEffect(() => {});
};
