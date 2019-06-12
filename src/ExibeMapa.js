import React, {Component} from 'react';
import {Map, InfoWindow, GoogleApiWrapper} from 'google-maps-react'; //https://www.npmjs.com/package/google-maps-react
import {Marker} from 'google-maps-react/dist/components/Marker';

const GOOGLE_API = "AIzaSyDU68xXJtiOxBu5noq4egQpKUHkemmfrtw";

class ExibeMapa extends Component {
  state = {
    map: null,
    markerProps: [],
    activeMarker: null,
    activeMarkerProps: null,
    showingInfoWindow: false,
    firstDrop: true,
    introAnim: this.props.google.maps.Animation.DROP,
    venueCount: 0
  };

  componentDidMount = () => { }

  saveRealMarker = marker => {
    this
      .props
      .saveRealMarker(marker);
  }

  componentWillReceiveProps = (props) => {
    const venueCountChanged = this.state.venueCount !== props.venues.length
      ? true
      : false;
    const showingInfoWindow = props.activeMarker && !venueCountChanged
      ? true
      : false;

    this.setState({ firstDrop: false, activeMarker: props.activeMarker, showingInfoWindow, venueCount: props.venues.length },
      () => {
        if (this.state.activeMarker) this.state.activeMarker.marker.setAnimation(this.props.google.maps.Animation.BOUNCE);
      });
  }

  mapReady = (props, map) => {
    this.setState({ map });
  }

  closeInfoWindow = () => {
    this.setState({ showingInfoWindow: false });
  }

  onMarkerClick = marker => {
    this
      .props
      .clickMarker(marker.id);
  }

  render = () => {
    const style = {
      width: '100%',
      height: '100%'
    }
    const center = {
      lat: this.props.lat,
      lng: this.props.lon
    }

    return (
      <Map
        role="application"
        aria-label="map"
        onReady={this.mapReady}
        google={this.props.google}
        zoom={this.props.zoom}
        style={style}
        initialCenter={center}
        onClick={this.closeInfoWindow}>

        {this.props.venues && this
          .props
          .venues
          .map((venue, index) => {
            return (<Marker
              id={venue.id}
              key={venue.id}
              index={index}
              title={venue.name}
              name={venue.name}
              address={venue.location.formattedAddress}
              onClick={this.onMarkerClick}
              position={{
                lat: venue.location.lat,
                lng: venue.location.lng
              }}
              animation={this.state.introAnim}
              ref={this.saveRealMarker} />)
          })}

        <InfoWindow
          marker={this.state.activeMarker && this.state.activeMarker.marker}
          visible={this.state.showingInfoWindow}
          onClose={this.closeInfoWindow}>
          <div>
            <h3>{this.state.activeMarker && this.state.activeMarker.props.name}</h3>
            <div>{this.state.activeMarker && this.state.activeMarker.props.address[0]}</div>
            <div>{this.state.activeMarker && this.state.activeMarker.props.address[1]}</div>
          </div>
        </InfoWindow>
      </Map>
    )
  }
}

export default GoogleApiWrapper({ apiKey: GOOGLE_API })(ExibeMapa)
