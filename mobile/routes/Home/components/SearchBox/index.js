import React from 'react';
import {Text} from 'react-native';
import {View, InputGroup, Input} from 'native-base';

import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './SearchBoxStyles.js';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

Icon.loadFont();

export const SearchBox = ({getSelectedAddress}) => {
  function handleInput(destinationLocation) {
    getSelectedAddress(destinationLocation);
  }

  return (
    <View style={styles.searchBox}>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Destination</Text>
        <InputGroup>
          <Icon name="search" size={15} color="#AA5E3A" />
          <GooglePlacesAutocomplete
            styles={{
              textInputContainer: {
                backgroundColor: 'rgba(0,0,0,0)',
                borderTopWidth: 0,
                borderBottomWidth: 0,
              },
              textInput: {
                marginLeft: 0,
                marginRight: 0,
                height: 38,
                color: '#5d5d5d',
                fontSize: 16,
              },
              predefinedPlacesDescription: {
                color: '#1faadb',
              },
            }}
            placeholder="Choose destination"
            minLength={2} // minimum length of text to search
            autoFocus={true}
            returnKeyType={'search'} // Can be left out for default return key
            listViewDisplayed={false} // true/false/undefined
            fetchDetails={true}
            onPress={(data, details = null) => {
              // 'details' is provided when fetchDetails = true
              const destinationLocation = {
                description: data.description,
                longitude: details.geometry.location.lng,
                latitude: details.geometry.location.lat,
              };
              handleInput(destinationLocation);
            }}
            query={{
              key: 'AIzaSyCTXzQlYASGiz_Hymx1mvJygSS3Ywhj_vQ',
              language: 'en',
            }}
            nearbyPlacesAPI="GooglePlacesSearch"
            debounce={300}
          />
        </InputGroup>
      </View>
    </View>
  );
};

export default SearchBox;
