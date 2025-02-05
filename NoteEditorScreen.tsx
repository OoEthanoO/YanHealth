import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Alert} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const NoteEditorScreen = ({route, navigation}: any): React.JSX.Element => {
  const {selectedDate} = route.params;
  const [note, setNote] = useState('');
  const isPastDate = moment(selectedDate).isBefore(moment(), 'day');

  useEffect(() => {
    const fetchNote = async () => {
      const token = await AsyncStorage.getItem('token');
      try {
        const response = await axios.get(
          `http://localhost:3000/api/notes/${selectedDate}`,
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

    fetchNote();
  }, [selectedDate]);

  const handleSave = async () => {
    if (isPastDate) {
      Alert.alert('Error', 'You cannot edit notes in the past.');
      return;
    }

    const token = await AsyncStorage.getItem('token');
    try {
      await axios.post(
        'http://localhost:3000/api/notes',
        {date: selectedDate, note},
        {headers: {Authorization: `Bearer ${token}`}},
      );
      Alert.alert('Note saved', 'Your note has been saved successfully.');
    } catch (error) {
      console.error('Error saving note:', error);
      Alert.alert('Erorr', 'There was an error saving your note.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notes for {selectedDate}</Text>
      {isPastDate ? (
        <Text style={styles.textView}>{note}</Text>
      ) : (
        <TextInput
          style={styles.textInput}
          multiline
          value={note}
          onChangeText={setNote}
          placeholder="Enter your note here..."
        />
      )}
      {!isPastDate && <Button title="Save" onPress={handleSave} />}
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
  },
  textView: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 8,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
});

export default NoteEditorScreen;
