import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function App() {
  const [forecast, setForecast] = useState([]);
  const [location, setLocation] = useState('지금 여기는');
  const [isGranted, setIsGranted] = useState(true);

  useEffect(() => {
    setForecast(getWeather().daily);
  }, []);

  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setIsGranted(false);
    }

    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });

    Location.setGoogleApiKey('AIzaSyAXH2E4Ozs-WgZFW4bA70qNLdr2gG1AfJI');

    const currentLocation = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false },
    );

    setLocation(
      currentLocation[0].district || currentLocation[0].city || currentLocation[0].region,
    );

    const OPENWEATHER_API_KEY = '6c8922b062de26ebd060bbe0a55e3e98';

    const json = (
      await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude={alerts}&appid=${OPENWEATHER_API_KEY}`,
      )
    ).json();

    console.log(json);
    console.log(json.daily);
    return json;
  };
  console.log(forecast);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{location}</Text>
      </View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {forecast?.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator size="large" color="white" style={styles.loading} />
          </View>
        ) : (
          forecast?.map(({ temp, weather }, index) => {
            <View style={styles.day} key={index}>
              <Text style={styles.temp}>24º</Text>
              <Text style={styles.description}>{weather[0]?.main}</Text>
            </View>;
          })
          // <>
          //   <View style={styles.day}>
          //     <Text style={styles.temp}>24º</Text>
          //     <Text style={styles.description}>일요일</Text>
          //   </View>
          //   <View style={styles.day}>
          //     <Text style={styles.temp}>29º</Text>
          //     <Text style={styles.description}>일요일</Text>
          //   </View>
          //   <View style={styles.day}>
          //     <Text style={styles.temp}>29º</Text>
          //     <Text style={styles.description}>일요일</Text>
          //   </View>
          //   <View style={styles.day}>
          //     <Text style={styles.temp}>29º</Text>
          //     <Text style={styles.description}>일요일</Text>
          //   </View>
          // </>
        )}
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
  loading: {
    marginTop: 50,
  },
});
