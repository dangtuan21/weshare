import React from "react";
import { View } from "native-base";
import MapView from "react-native-maps";
import SearchBox from "../SearchBox";

import styles from "./MapContainerStyles.js";

export const MapContainer = ({
  region,
  fare,
  getSelectedAddress,
  carMarker,
  nearByDrivers
}) => {
  return (
    <View style={styles.container}>
      <MapView
        provider={MapView.PROVIDER_GOOGLE}
        mapType={"standard"}
        style={styles.map}
        zoomEnabled={true}
        region={region}
      >
        {region && <MapView.Marker coordinate={region} pinColor="green" />}
        {fare.destination && (
          <MapView.Marker coordinate={fare.destination} pinColor="blue" />
        )}

        {nearByDrivers &&
          nearByDrivers.map((marker, index) => (
            <MapView.Marker
              key={index}
              coordinate={{
                latitude: marker.coordinate.coordinates[1],
                longitude: marker.coordinate.coordinates[0]
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
