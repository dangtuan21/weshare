import React from "react";
import { View } from "native-base";
import MapView from "react-native-maps";

import styles from "./MapTrackStyles.js";
import MapViewDirections from "react-native-maps-directions";

export const MapTrack = ({ fare }) => {
  const region = {
    latitude: fare.departure.latitude,
    longitude: fare.departure.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={MapView.PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
      >
        {fare.departure && (
          <MapView.Marker coordinate={fare.departure} pinColor="green" />
        )}
        {fare.destination && (
          <MapView.Marker coordinate={fare.destination} pinColor="blue" />
        )}

        <MapViewDirections
          origin={fare.departure}
          destination={fare.destination}
          apikey="AIzaSyDUYbTR-3PDWPhgxjENs4yf35g2eHc641s"
          strokeWidth={3}
          strokeColor="rgb(0,139,241)"
        />
      </MapView>
    </View>
  );
};

export default MapTrack;
