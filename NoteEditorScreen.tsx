import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Alert} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import AppleHealthKit from 'react-native-health';
import {DEBUG} from './config';

const BASE_URL = DEBUG
  ? 'http://localhost:3000'
  : 'https://yanhealth.onrender.com';

const NoteEditorScreen = ({route, navigation}: any): React.JSX.Element => {
  const {selectedDate} = route.params;
  const [note, setNote] = useState('');
  const [redMeat, setRedMeat] = useState(0);
  const [healthData, setHealthData] = useState<{
    heartRate?: number | string;
    steps?: number | string;
  }>({});
  const isPastDate = moment(selectedDate).isBefore(moment(), 'day');
  const isFutureDate = moment(selectedDate).isAfter(moment(), 'day');

  useEffect(() => {
    const fetchNote = async () => {
      const token = await AsyncStorage.getItem('token');
      try {
        const response = await axios.get(
          `${BASE_URL}/api/notes/${selectedDate}`,
          {
            headers: {Authorization: `Bearer ${token}`},
          },
        );
        setNote(response.data.note || '');
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setNote('');
        } else {
          console.error('Error fetching note:', error);
        }
      }
    };

    const fetchHealthData = async () => {
      const options = {
        startDate: moment(selectedDate).startOf('day').toISOString(),
        endDate: moment(selectedDate).endOf('day').toISOString(),
      };

      AppleHealthKit.getHeartRateSamples(options, (err, results) => {
        if (err) {
          console.error('Error fetching heart rate:', err);
          return;
        }
        const heartRate = results.length ? results[0].value : 'N/A';
        setHealthData(prevData => ({...prevData, heartRate}));
      });

      AppleHealthKit.getStepCount(options, (err, results) => {
        if (err) {
          console.error('Error fetching step:', err);
          return;
        }
        const steps = results ? results.value : 'N/A';
        setHealthData(prevData => ({...prevData, steps}));
      });
    };

    fetchNote();
    fetchHealthData();
  }, [selectedDate]);

  const handleSave = async (): Promise<void> => {
    if (isPastDate) {
      Alert.alert('Error', 'You cannot edit notes in the past.');
      return;
    }

    if (isFutureDate) {
      Alert.alert('Error', 'You cannot edit notes in the future.');
      return;
    }

    const token = await AsyncStorage.getItem('token');
    try {
      await axios.post(
        `${BASE_URL}/api/notes`,
        {date: selectedDate, note, healthData},
        {headers: {Authorization: `Bearer ${token}`}},
      );
      Alert.alert('Note saved', 'Your note has been saved successfully.');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error saving note:', error.response?.data);
      } else {
        console.error('Error saving note:', error);
      }
      Alert.alert('Error', 'There was an error saving your note.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notes for {selectedDate}</Text>
      {isPastDate || isFutureDate ? (
        <Text style={styles.textView}>{note}</Text>
      ) : (
        <>
          <TextInput
            style={styles.textInput}
            multiline
            value={note}
            onChangeText={setNote}
            placeholder="Enter your note here..."
          />
          <view style={styles.redMeatContainer}>
            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              value={redMeat.toString()}
              placeholder="Enter red meat eaten (g)..."
              onChangeText={text => {
                if (text === '') {
                  setRedMeat(0);
                  return;
                }
                setRedMeat(parseInt(text));
              }}
            />
          </view>
        </>
      )}
      {healthData && (
        <View style={styles.healthDataContainer}>
          <Text>Average Heart Rate: {healthData.heartRate}</Text>
          <Text>Steps Taken: {healthData.steps}</Text>
        </View>
      )}
      {!(isPastDate || isFutureDate) && (
        <Button title="Save" onPress={handleSave} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  textInput: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 8,
    marginBottom: 16,
    textAlignVertical: 'top',
    textAlign: 'left',
  },
  textView: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 8,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  redMeatContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  healthDataContainer: {
    marginTop: 16,
  },
});

export default NoteEditorScreen;
