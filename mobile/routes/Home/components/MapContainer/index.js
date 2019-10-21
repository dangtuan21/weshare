import React from 'react';
import {View} from 'native-base';
import MapView from 'react-native-maps';
import SearchBox from '../SearchBox';

import styles from './MapContainerStyles.js';

export const MapContainer = ({
  region,
  fare,
  getSelectedAddress,
  carMarker,
  nearByDrivers,
}) => {
  // const fare = {
  //     departure: currentLocation,
  //     destination: destinationLocation,
  //     freight: freight,
  //     duration: duration,
  //     distance: distance * 0.001,
  // };

  return (
    <View style={styles.container}>
      <MapView
        provider={MapView.PROVIDER_GOOGLE}
        mapType={'standard'}
        style={styles.map}
        zoomEnabled={true}
        region={region}>
        {region && (
          <MapView.Marker
            coordinate={{
              latitude: region.latitude,
              longitude: region.longitude,
            }}
            pinColor="green"
          />
        )}
        {fare.destination && (
          <MapView.Marker
            coordinate={{
              latitude: fare.destination.latitude,
              longitude: fare.destination.longitude,
            }}
            pinColor="blue"
          />
        )}

        {nearByDrivers &&
          nearByDrivers.map((marker, index) => (
            <MapView.Marker
              key={index}
              coordinate={{
                latitude: marker.coordinate.coordinates[1],
                longitude: marker.coordinate.coordinates[0],
              }}
              image={carMarker}
            />
          ))}
      </MapView>
      <SearchBox getSelectedAddress={getSelectedAddress} />
    </View>
  );
};

export default MapContainer;
