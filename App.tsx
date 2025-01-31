/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Calendar} from 'react-native-calendars';
import {Colors} from 'react-native/Libraries/NewAppScreen';

type NewsItemProps = {
  title: string;
  date: string;
  description: string;
};

const newsData: NewsItemProps[] = [
  {
    title: 'News Title 1',
    date: '2023-10-01',
    description: 'This is a short description of news item 1.',
  },
  {
    title: 'News Title 2',
    date: '2023-10-02',
    description: 'This is a short description of news item 2.',
  },
];

function NewsItem({
  title,
  date,
  description,
}: NewsItemProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.newsItemContainer}>
      <Text
        style={[
          styles.newsTitle,
          {color: isDarkMode ? Colors.white : Colors.black},
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.newsDate,
          {color: isDarkMode ? Colors.light : Colors.dark},
        ]}>
        {date}
      </Text>
      <Text
        style={[
          styles.newsDescription,
          {color: isDarkMode ? Colors.light : Colors.dark},
        ]}>
        {description}
      </Text>
    </View>
  );
}

function NewsScreen(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={[backgroundStyle, {flex: 1}]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          {newsData.map((newsItem, index) => (
            <NewsItem
              key={index}
              title={newsItem.title}
              date={newsItem.date}
              description={newsItem.description}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function CalendarScreen(): React.JSX.Element {
  return (
    <View style={styles.fullScreenContainer}>
      <Calendar />
    </View>
  );
}

const Tab = createBottomTabNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="News" component={NewsScreen} />
        <Tab.Screen name="Calendar" component={CalendarScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  newsItemContainer: {
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: Colors.lighter,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  newsDate: {
    fontSize: 14,
    fontWeight: '400',
    marginTop: 4,
  },
  newsDescription: {
    fontSize: 16,
    fontWeight: '400',
    marginTop: 8,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenContainer: {
    flex: 1,
  },
});

export default App;
