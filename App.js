import React from 'react';

import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

import MapView, { Marker } from 'react-native-maps';
import { API_KEY } from '@env';

export default function App() {
	const [ address, setAddress ] = React.useState ( '' );
	const [ lastSearched, setLast ] = React.useState ( '' );
	const [ coordinates, setCoordinates ] = React.useState ( { lat: 0, lng: 0 } );

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
		if ( coordinates.lat === 0 && coordinates.lng === 0 ) {
			return <View/>
		}

		return <MapView
				style={
					{ flex: 1, width: '100%', height: '100%' }
				}

				initialRegion={ 
					{
						latitude: 60.200692,
						longitude: 24.934302,
						latitudeDelta: 0.0322,
						longitudeDelta: 0.0221
					}
				}

				region={
					{ 
						latitude: coordinates.lat,
						longitude: coordinates.lng,
						latitudeDelta: 0.0322,
						longitudeDelta: 0.0221
					}
				}
			>
			<Marker
				coordinate={ { latitude: coordinates.lat, longitude: coordinates.lng } }
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
