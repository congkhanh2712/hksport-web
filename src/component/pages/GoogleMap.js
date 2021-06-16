import { GoogleApiWrapper, Map,Marker } from 'google-maps-react';
import React, {Component} from 'react'

export class MapContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
        }
    }
    // state = {
    //     showingInfoWindow: false,
    //     activeMarker: {},
    //     selectedPlace: {},
    // };

    onMarkerClick = (props, marker, e) =>
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });

    onMapClicked = (props) => {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            })
        }
    };
    render() {
        return (
            <Map google={this.props.google}
                onClick={this.onMapClicked}
                initialCenter={{
                    lat: 10.8373883, 
                    lng: 106.7736663,
                }}
                zoom={16}
                style={{width: '40%', height: 700}}>
                <Marker onClick={this.onMarkerClick}
                    name={'Current location'} />
            </Map>
        )
    }
}

export default GoogleApiWrapper({
    apiKey: ("AIzaSyA_OE4HtXkS9PsdIfmKpZA9xVWrTvbCQRM")
})(MapContainer)