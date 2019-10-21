import update from 'react-addons-update';
import constants from './actionConstants';
import Geolocation from 'react-native-geolocation-service';
import {Dimensions} from 'react-native';
import request from '../../../util/request';
import calculateFreight from '../../../util/fareCalculator.js';
import _ from 'lodash';

//--------------------
//Constants
//--------------------
const {
  GET_CURRENT_LOCATION,
  SET_NAME,
  GET_FARE,
  BOOK_CAR,
  GET_NEARBY_DRIVERS,
} = constants;

const {width, height} = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = ASPECT_RATIO * LATITUDE_DELTA;

//--------------------
//Actions
//--------------------
export function setName(param) {
  return (dispatch, store) => {
    dispatch({
      type: SET_NAME,
      payload: param.longitude + ':999',
    });
  };
}
function handleSetName(state, action) {
  return update(state, {
    name: {
      $set: action.payload,
    },
  });
}

export function getCurrentLocation() {
  return dispatch => {
    Geolocation.getCurrentPosition(
      position => {
        const currentLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        if (!_.isEmpty(currentLocation)) {
          dispatch({
            type: GET_CURRENT_LOCATION,
            payload: currentLocation,
          });
        }
      },
      error => {
        // See error code charts below.
        console.log('Error getCurrentPosition: ', error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };
}
//GET ADRESSES FROM GOOGLE PLACE

//get selected address
export function getSelectedAddress(destinationLocation) {
  return (dispatch, store) => {
    Geolocation.getCurrentPosition(
      position => {
        const currentLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        if (!_.isEmpty(currentLocation) && !_.isEmpty(destinationLocation)) {
          const queryOptions = {
            origins: currentLocation.latitude + ',' + currentLocation.longitude,
            destinations:
              destinationLocation.latitude +
              ',' +
              destinationLocation.longitude,
            mode: 'driving',
            key: 'AIzaSyDUYbTR-3PDWPhgxjENs4yf35g2eHc641s',
          };
          request
            .get('https://maps.googleapis.com/maps/api/distancematrix/json')
            .query(queryOptions)
            .finish((error, res) => {
              if (error) console.log('Error getting distancematrix: ', error);
              //in minutes
              const duration = res.body.rows[0].elements[0].duration.value;
              //in miles
              const distance = res.body.rows[0].elements[0].distance.value;
              const dummyNumbers = {
                baseFare: 0.4,
                timeRate: 0.14,
                distanceRate: 0.97,
                surge: 1,
              };

              const freight = calculateFreight(
                dummyNumbers.baseFare,
                dummyNumbers.timeRate,
                duration,
                dummyNumbers.distanceRate,
                distance,
                dummyNumbers.surge,
              );
              const fare = {
                departure: currentLocation,
                destination: destinationLocation,
                freight: freight,
                duration: duration,
                distance: distance * 0.001,
              };
              const url = 'http://localhost:3000/api/driverLocation';
              callServerAPI(url, fare.departure, body => {
                dispatch({
                  type: GET_NEARBY_DRIVERS,
                  payload: body,
                });
              });

              setTimeout(function() {
                dispatch({
                  type: GET_FARE,
                  payload: fare,
                });
              }, 2000);
            });
        }
      },
      error => {
        // See error code charts below.
        console.log(
          'Error getCurrentPosition in getSelectedAddress: ',
          error.code,
          error.message,
        );
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };
}
//BOOK CAR

export function bookCar() {
  return (dispatch, store) => {
    const nearByDrivers = store().home.nearByDrivers;
    const nearByDriver =
      nearByDrivers[Math.floor(Math.random() * nearByDrivers.length)];
    const payload = {
      data: {
        userName: 'Thomas',
        fare: store().home.fare,
        status: 'pending',
      },
      nearByDriver: {
        socketId: nearByDriver.socketId,
        driverId: nearByDriver.driverId,
        latitude: nearByDriver.coordinate.coordinates[1],
        longitude: nearByDriver.coordinate.coordinates[0],
      },
    };

    console.log('ttt111 payload', payload);
    request
      .post('http://localhost:3000/api/bookings')
      .send(payload)
      .finish((error, res) => {
        dispatch({
          type: BOOK_CAR,
          payload: res.body,
        });
      });
  };
}

function callServerAPI(url, param, callback) {
  request
    .get(url)
    .query(param)
    .finish((error, res) => {
      if (res) {
        callback(res.body);
      }
    });
}

//get nearby drivers
export function getNearByDrivers() {
  return (dispatch, store) => {
    if (store().home && store().home.region) {
      const location = store().home.region;
      const url = 'http://localhost:3000/api/driverLocation';
      callServerAPI(url, location, body => {
        dispatch({
          type: GET_NEARBY_DRIVERS,
          payload: body,
        });
      });
    } else {
      console.log('No region detection');
    }
  };
}
//--------------------
//Action Handlers
//--------------------
function handleGetCurrentLocation(state, action) {
  const region = {
    latitude: {
      $set: action.payload.latitude,
    },
    longitude: {
      $set: action.payload.longitude,
    },
    latitudeDelta: {
      $set: LATITUDE_DELTA,
    },
    longitudeDelta: {
      $set: LONGITUDE_DELTA,
    },
  };
  return update(state, {
    region: region,
  });
}

function handleGetInputData(state, action) {
  const {key, value} = action.payload;
  return update(state, {
    inputData: {
      [key]: {
        $set: value,
      },
    },
  });
}

function handleToggleSearchResult(state, action) {
  if (action.payload === 'pickUp') {
    return update(state, {
      resultTypes: {
        pickUp: {
          $set: true,
        },
        dropOff: {
          $set: false,
        },
      },
      predictions: {
        $set: {},
      },
    });
  }
  if (action.payload === 'dropOff') {
    return update(state, {
      resultTypes: {
        pickUp: {
          $set: false,
        },
        dropOff: {
          $set: true,
        },
      },
      predictions: {
        $set: {},
      },
    });
  }
}

function handleGetAddressPredictions(state, action) {
  return update(state, {
    predictions: {
      $set: action.payload,
    },
  });
}

function handleGetSelectedAddress(state, action) {
  let selectedTitle = state.resultTypes.pickUp
    ? 'selectedPickUp'
    : 'selectedDropOff';
  return update(state, {
    selectedAddress: {
      [selectedTitle]: {
        $set: action.payload,
      },
    },
  });
}

function handleGetDitanceMatrix(state, action) {
  return update(state, {
    distanceMatrix: {
      $set: action.payload,
    },
  });
}

function handleGetFare(state, action) {
  return update(state, {
    fare: {
      $set: action.payload,
    },
  });
}

//handle get nearby drivers
function handleGetNearbyDrivers(state, action) {
  return update(state, {
    nearByDrivers: {
      $set: action.payload,
    },
  });
}
function handleBookingConfirmed(state, action) {
  console.log('handleBookingConfirmed is called: ', action.payload);
  return update(state, {
    booking: {
      $set: action.payload,
    },
  });
}
function handleBookCar(state, action) {
  return update(state, {
    booking: {
      $set: action.payload,
    },
  });
}
const ACTION_HANDLERS = {
  GET_CURRENT_LOCATION: handleGetCurrentLocation,
  GET_INPUT: handleGetInputData,
  GET_SELECTED_ADDRESS: handleGetSelectedAddress,
  GET_DISTANCE_MATRIX: handleGetDitanceMatrix,
  GET_FARE: handleGetFare,
  BOOK_CAR: handleBookCar,
  SET_NAME: handleSetName,
  GET_NEARBY_DRIVERS: handleGetNearbyDrivers,
  BOOKING_CONFIRMED: handleBookingConfirmed,
};

const initialState = {
  name: {},
  region: {},
  fare: {},
  nearByDrivers: [],
  inputData: {},
  resultTypes: {},
  selectedAddress: {},
};

export function HomeReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
