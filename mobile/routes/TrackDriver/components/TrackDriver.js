import React from "react";
import { View } from "react-native";

import { Container } from "native-base";
import HeaderComponent from "../../../components/HeaderComponent";
import MapTrack from "./MapTrack";
import DriverFound from "./DriverFound";
import DriverFooterProfile from "./DriverFooterProfile";
import DriverOnTheWayFooter from "./DriverOnTheWayFooter";
class TrackDriver extends React.Component {
  componentDidMount() {
    this.props.getCurrentLocation();
    this.props.getDriverInfo();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.driverLocation === {}) {
      this.props.getDistanceFromDriver();
    } else return null;
  }

  render() {
    return (
      <Container>
        <View style={{ flex: 1 }}>
          <HeaderComponent />
          {this.props.fare && <MapTrack fare={this.props.fare} />}
          {this.props.distanceFromDriver.rows && (
            <DriverOnTheWayFooter
              driverInfo={this.props.driverInfo}
              distanceFromDriver={this.props.distanceFromDriver}
            />
          )}
          <DriverFooterProfile driverInfo={this.props.driverInfo} />
          {this.props.showDriverFound && (
            <DriverFound
              driverInfo={this.props.driverInfo}
              getDriverLocation={this.props.getDriverLocation}
            />
          )}
        </View>
      </Container>
    );
  }
}

export default TrackDriver;
