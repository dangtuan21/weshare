import React from 'react';
import {Text} from 'react-native';
import {View, Button} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './FindDriverStyles.js';
Icon.loadFont();

// var Spinner = require('react-native-spinkit');
export const FindDriver = ({fare}) => {
  console.log('fare ', fare.destination.description);
  return (
    <View style={styles.findDriverContainer}>
      {/* <Spinner
        style={styles.spinner}
        isVisible
        size={150}
        type="Pulse"
        color="#ffffff"
      /> */}
      <View style={styles.content}>
        <Text style={styles.text}> Processing your request</Text>
        <Icon style={styles.locationIcon} name="map-marker" />

        <View style={styles.dropoff}>
          <Text>{fare.destination.description}</Text>
        </View>

        <View>
          <Text style={styles.termsText}>
            By booking you confirm that you accept our T & C
          </Text>
          <Button style={styles.cancelBtn}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </Button>
        </View>
      </View>
    </View>
  );
};

export default FindDriver;
