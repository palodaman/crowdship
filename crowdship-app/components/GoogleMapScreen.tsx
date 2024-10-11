import React, { useRef, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet, View, Text } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapViewDirections from "react-native-maps-directions";
import DeliveriesList from "./DeliveriesList";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1, // This will allow the map to take up half of the screen
    width: "100%",
  },
  autocompleteContainer: {
    position: "absolute",
    top: 10,
    left: 17,
    right: 10,
    width: "90%",
    zIndex: 1, // Ensure the autocomplete is on top
    flexDirection: "column",
    flex: 0.5,
  },
  listingsContainer: {
    flex: 1, // Take up remaining space below the map
    width: "100%",
  },
});

const apiKey = "AIzaSyBJ9ncuQDRBwkj1EnvsGxVDuhJRrA0s_Fk"; // Replace with your actual API key

const GoogleMapScreen = () => {
  const mapRef = useRef<MapView>(null);
  const [origin, setOrigin] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [destination, setDestination] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  async function changeLocation(coordinates: {
    latitude: number | undefined;
    longitude: number | undefined;
  }) {
    if (mapRef.current && coordinates.latitude && coordinates.longitude) {
      mapRef.current.animateToRegion(
        {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        },
        2000
      );
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.autocompleteContainer}>
        <View style={{ flex: 0.5 }}>
          <GooglePlacesAutocomplete
            placeholder="Origin"
            fetchDetails={true}
            onPress={(data, details = null) => {
              if (
                details?.geometry?.location.lat &&
                details?.geometry?.location.lng
              ) {
                let originCoordinates = {
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                };
                setOrigin(originCoordinates);
                changeLocation(originCoordinates);
              }
            }}
            query={{
              key: apiKey,
              language: "en",
            }}
            onFail={(error) => console.error(error)}
          />
        </View>
        <View style={{ flex: 0.5 }}>
          <GooglePlacesAutocomplete
            placeholder="Destination"
            fetchDetails={true}
            onPress={(data, details = null) => {
              if (
                details?.geometry?.location.lat &&
                details?.geometry?.location.lng
              ) {
                let destinationCoordinates = {
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                };
                setDestination(destinationCoordinates);
                changeLocation(destinationCoordinates);
              }
            }}
            query={{
              key: apiKey,
              language: "en",
            }}
            onFail={(error) => console.error(error)}
          />
        </View>
      </View>
      <MapView ref={mapRef} style={[styles.map, !destination && { flex: 1 }]}>
        {origin && <Marker coordinate={origin} />}

        {destination && <Marker coordinate={destination} />}

        {origin && destination && (
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={apiKey}
            strokeWidth={3}
            strokeColor="blue"
          />
        )}
      </MapView>
      {destination && (
        <View style={styles.listingsContainer}>
          <DeliveriesList
            latitude={destination?.latitude ?? 0}
            longitude={destination?.longitude ?? 0}
          />
        </View>
      )}
    </View>
  );
};

export default GoogleMapScreen;
