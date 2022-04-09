import React from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  Text,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
} from 'react-native';

import { getLocationId, getWeather } from './utils/api';
import getImageWeather from './utils/getImageWeather';

import SearchInput from './components/SearchInput';

export default class App extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      error: false,

      location: '',
      temperature: 0,
      weather: '',
      created: '2000-01-01T00:00:00.000000Z'
    };

  }
  
  componentDidMount() {
    this.handleUpdateLocation("Dubai");
  }
  
  handleUpdateLocation = async city => {
    if (!city) return;

    this.setState({ loading: true }, async () => {
      try {

        const ID = await getLocationId(city);
        const { location, weather, temperature, created } = await getWeather(ID);

        this.setState({
          loading: false,
          error: false,
          location,
          weather,
          temperature,
          created,
        });


      } catch (e) {

        this.setState({
          loading: false,
          error: true,
        });

      }
    });
  };

  render() {

    const { loading, error, location, weather, temperature, created } = this.state;

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">

        <StatusBar barStyle="light-content" />

        <ImageBackground
          source={getImageWeather(weather)}
          style={styles.imageContainer}
          imageStyle={styles.image}
        >

          <View style={styles.detailsContainer}>

            <ActivityIndicator animating={loading} color="white" size="large" />

            {!loading && (
              <View>
                {error && (
                  <Text style={[styles.smallText, styles.textStyle]}>
                    😞 Could not load your city or weather. Please try again later...
                  </Text>
                )}
                {!error && (
                  <View>
                    <Text style={[styles.largeText, styles.textStyle]}>
                       {location}
                    </Text>
                    <Text style={[styles.smallText, styles.textStyle]}>
                       {weather}
                    </Text>
                    <Text style={[styles.largeText, styles.textStyle]}>
                      {`${Math.round(temperature)}°`}
                    </Text>
                  </View>
                )}

                <SearchInput
                  placeholder="Search any city"
                  onSubmit={this.handleUpdateLocation}
                />

              </View>
            )}
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#34495E',
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 20,
  },
  textStyle: {
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Regular' : 'Roboto',
    color: 'white',
  },
  largeText: {
    fontSize: 44,
  },
  smallText: {
    fontSize: 18,
  },
});
