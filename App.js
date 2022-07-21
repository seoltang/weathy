import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import { GOOGLE_MAPS_API_KEY, OPENWEATHER_API_KEY } from '@env';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function App() {
  const [forecast, setForecast] = useState([]);
  const [location, setLocation] = useState('지금 여기는');
  const [isGranted, setIsGranted] = useState(true);

  useEffect(() => {
    getWeather();
  }, []);

  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setIsGranted(false);
    }

    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });

    Location.setGoogleApiKey(GOOGLE_MAPS_API_KEY);

    const currentLocation = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false },
    );

    setLocation(
      currentLocation[0].district || currentLocation[0].city || currentLocation[0].region,
    );

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&lang=kr&exclude={alerts}&appid=${OPENWEATHER_API_KEY}`,
    );
    const json = await response.json();

    setForecast(json.daily);
  };
  console.log('forecast', forecast);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{location}</Text>
      </View>
      <View style={styles.weather}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          // contentContainerStyle={styles.weather}
        >
          {forecast.length === 0 ? (
            <View style={styles.daily}>
              <ActivityIndicator size="large" color="white" style={styles.loading} />
            </View>
          ) : (
            forecast.map(({ dt, temp, weather }, index) => {
              const date = new Date(dt * 1000);
              const weekday = new Intl.DateTimeFormat('default' || 'ko-KR', {
                weekday: 'long',
              }).format(date);

              return (
                <View style={styles.daily} key={index}>
                  <Text style={styles.weekday}>{weekday}</Text>
                  <Text style={styles.temp}>{`${Math.round(temp.day)}º`}</Text>
                  <View style={styles.iconContainer}>
                    <Image
                      style={styles.icon}
                      source={{ uri: `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png` }}
                    />
                    <Text style={styles.description}>{weather[0].description}</Text>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      </View>
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
    flex: 2,
    backgroundColor: 'lavender',
  },
  daily: {
    alignItems: 'center',
    width: SCREEN_WIDTH,
  },
  weekday: {
    marginTop: 36,
    fontSize: 36,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  temp: {
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 16,
    fontSize: 100,
  },
  description: {
    marginRight: 24,
    fontSize: 28,
  },
  icon: {
    width: 60,
    height: 60,
  },
  loading: {
    marginTop: 50,
  },
});
