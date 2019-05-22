import React, { Component } from 'react';
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react'; //https://www.npmjs.com/package/google-maps-react

export class MapContainer extends Component {
  //enviando dados via state (dinâmico)
  state = {
    showingInfoWindow: false,  //Hides or the shows the infoWindow
    activeMarker: {},          //Shows the active marker upon click
    selectedPlace: {}          //Shows the infoWindow to the selected place upon a marker
  };

  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    }
  );

  onClose = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };

  render() {
    return (
      <Map 
        //enviando dados via props
        google={this.props.google}
        zoom={16}
        style={{width: '100%', height: '100%', position: 'relative'}}
        className={'map'}
        initialCenter={{ 
         lat: -15.795092,
         lng: -47.885115
        }}
      >
        <Marker
          onClick={this.onMarkerClick}
          name={'Hotel Nacional'}
          position={{lat: -15.795309, lng: -47.887035}}
        />
        <Marker 
          onClick={this.onMarkerClick}
          name={'Brasília Imperial Hotel'}
          position={{lat: -15.794638, lng: -47.889975}}         
        />
        <Marker 
          onClick={this.onMarkerClick}
          name={'Naoum Hotel'}
          position={{lat: -15.794958, lng: -47.889889}}       
        />
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          onClose={this.onClose}
        >  
          <div>
            <h4>{this.state.selectedPlace.name}</h4>
          </div>
          </InfoWindow>                 
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: ('AIzaSyDU68xXJtiOxBu5noq4egQpKUHkemmfrtw')
})(MapContainer)
