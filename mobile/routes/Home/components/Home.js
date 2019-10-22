import React from "react";
import { View } from "react-native";
import { Container } from "native-base";
import { Actions } from "react-native-router-flux";
import MapContainer from "./MapContainer";
import HeaderComponent from "../../../components/HeaderComponent";
import FooterComponent from "../../../components/FooterComponent";
const taxiLogo = require("../../../assets/img/taxi_logo_white.png");
const carMarker = require("../../../assets/img/carMarker.png");
import Fare from "./Fare";
import Fab from "./Fab";
import FindDriver from "./FindDriver";

class Home extends React.Component {
  componentDidMount() {
    this.props.getCurrentLocation();

    var rx = this;
    setTimeout(function() {
      rx.props.getNearByDrivers();
    }, 1000);
  }
  //   componentDidUpdate(prevProps, prevState) {
  //     if (this.props.booking.status === 'confirmed') {
  //       Actions.trackDriver({type: 'reset'});
  //     }
  //     this.props.getCurrentLocation();
  //   }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.booking.status === "confirmed") {
      Actions.trackDriver({ type: "reset" });
    } else return null; // Triggers no change in the state
    //ttt this.props.getCurrentLocation();
  }

  render() {
    //DC
    // const defaultRegion = {
    //   latitude: 38.89345,
    //   longitude: -77.01471,
    //   latitudeDelta: 0.0922,
    //   longitudeDelta: 0.0421
    // };
    //Apple
    const defaultRegion = {
      latitude: 37.334703,
      longitude: -122.030225,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
    };

    let region = defaultRegion;
    if (this.props.region) {
      region = this.props.region;
    }
    const { status } = this.props.booking;

    return (
      <Container>
        {(status !== "pending" && (
          <View style={{ flex: 1 }}>
            <HeaderComponent logo={taxiLogo} />
            <MapContainer
              region={region}
              fare={this.props.fare}
              getSelectedAddress={this.props.getSelectedAddress}
              carMarker={carMarker}
              nearByDrivers={this.props.nearByDrivers}
            />
            <Fab onPressAction={() => this.props.bookCar()} />
            {this.props.fare && <Fare fare={this.props.fare} />}
            <FooterComponent />
          </View>
        )) || <FindDriver fare={this.props.fare} />}
      </Container>
    );
  }
}

export default Home;
