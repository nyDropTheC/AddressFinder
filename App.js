import React from 'react';

import { StatusBar } from 'expo-status-bar';
import { Alert, Button, StyleSheet, TextInput, View } from 'react-native';

import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { API_KEY } from '@env';

export default function App() {
	const [ address, setAddress ] = React.useState ( '' );
	const [ lastSearched, setLast ] = React.useState ( '' );
	const [ coordinates, setCoordinates ] = React.useState ( { lat: 0, lng: 0 } );

	const [ userLocation, setLocation ] = React.useState ( { latitude: 0, longitude: 0 } );

	React.useEffect ( ( ) => {
		( async ( ) => {
			const { status } = await Location.requestForegroundPermissionsAsync ( );

			if ( status !== 'granted' ) {
				console.log ( status );
				Alert.alert ( 'where location permissions' );
				return
			}
			const { coords } = await Location.getCurrentPositionAsync ( { accuracy: Location.Accuracy.Highest } );

			setLocation ( { latitude: coords.latitude, longitude: coords.longitude } );
		} ) ( );
	}, [ ] );
	
	const onClick = ( ) => {
		fetch ( `https://www.mapquestapi.com/geocoding/v1/address?key=${API_KEY}&location=${address}` )
			.then ( resp => resp.json ( ) )
			.then ( resp => {
				setCoordinates ( resp.results [ 0 ].locations [ 0 ].displayLatLng );
				setLast ( address );
			} );
	};

	const inputElement = ( ( ) => {
		return <View>
			<TextInput style={ { width: 300, borderColor: 'black', borderWidth: 2 } } onChangeText={ ( text ) => setAddress ( text ) } value={ address }/>
			<Button style={ { width: 300 } } onPress={ onClick } title='Find'/>
		</View>
	} ) ( );

	const mapElement = ( ( ) => {
		if ( userLocation.latitude === 0 && userLocation.longitude === 0 && coordinates.lat === 0 && coordinates.lng === 0 ) {
			return <View/>
		}

		const regionCoords = {
			latitude: coordinates.lat === 0 ? userLocation.latitude : coordinates.lat,
			longitude: coordinates.lng === 0 ? userLocation.longitude : coordinates.lng
		};

		return <MapView
				style={
					{ flex: 1, width: '100%', height: '100%' }
				}

				initialRegion={ 
					{
						latitude: userLocation.latitude,
						longitude: userLocation.longitude,
						latitudeDelta: 0.0322,
						longitudeDelta: 0.0221
					}
				}

				region={
					{ 
						...regionCoords,
						latitudeDelta: 0.0322,
						longitudeDelta: 0.0221
					}
				}
			>
			<Marker
				coordinate={ regionCoords }
				title={ lastSearched }
			/>
		</MapView>
	} ) ( );

	return (
		<View style={styles.container}>
			{ mapElement }
			{ inputElement }
			<StatusBar style="auto" />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
