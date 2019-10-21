import {StyleSheet} from 'react-native';

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapStyle: {
    height: 400,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
};

export default styles;
