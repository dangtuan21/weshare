import {connect} from 'react-redux';
import Home from '../components/Home';
import {
  getCurrentLocation,
  getSelectedAddress,
  setName,
  bookCar,
  getNearByDrivers,
} from '../module/home';

const mapStateToProps = state => ({
  name: state.home.name || {},
  fare: state.home.fare || {},
  booking: state.home.booking || {},
  region: state.home.region,
  nearByDrivers: state.home.nearByDrivers,
  inputData: state.home.inputData || {},
  resultTypes: state.home.resultTypes || {},
  selectedAddress: state.home.selectedAddress || {},
});

const mapActionCreators = {
  getCurrentLocation,
  getSelectedAddress,
  setName,
  bookCar,
  getNearByDrivers,
};
export default connect(
  mapStateToProps,
  mapActionCreators,
)(Home);
