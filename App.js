import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>서울</Text>
      </View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        <View style={styles.day}>
          <Text style={styles.temp}>29º</Text>
          <Text style={styles.description}>일요일</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>29º</Text>
          <Text style={styles.description}>일요일</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>29º</Text>
          <Text style={styles.description}>일요일</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>29º</Text>
          <Text style={styles.description}>일요일</Text>
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'pink',
  },
  city: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  cityName: {
    fontSize: 48,
    fontWeight: '600',
  },
  weather: {
    backgroundColor: 'lavender',
  },
  day: {
    alignItems: 'center',
    width: SCREEN_WIDTH,
  },
  temp: {
    fontSize: 120,
  },
  description: {
    marginTop: 10,
    fontSize: 36,
  },
});
