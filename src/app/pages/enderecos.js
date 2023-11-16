import { DirectionsRenderer, GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import React, { useState } from 'react';
import axios from 'axios';
import FindLocation from '../components/findLocation';

const MapContainer = () => {
    const [search, setSearch] = useState({ origin: '', destination: '' });
    const [directions, setDirections] = useState(null);
    const [originCoords, setOriginCoords] = useState(null);
    const [destinationCoords, setDestinationCoords] = useState(null);
    const [center, setCenter] = useState(null);
    const [error, setError] = useState(null);

    const mapStyles = {
        height: "400px",
        width: "500px",
    };

    const defaultCenter = {
        lat: -23.5505,
        lng: -46.6333,
    };
    const key = "AIzaSyBejFbwfYUZm0OmKt1Rq7l4jP6rui2XYY4";

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearch({
            ...search,
            [name]: value,
        });
    };

    const handleDirectionsResponse = (response) => {
        if (response && response.status === 'OK') {
            setDirections(response);
            setCenter(originCoords);
        } else {
            setError('Erro ao obter direções');
        }
    };

    const generateDirections = async () => {
        try {
            const originResponse = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${search.origin}&key=${key}`);
            const destinationResponse = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${search.destination}&key=${key}`);

            if (originResponse.data.status === 'OK' && originResponse.data.results.length > 0 &&
                destinationResponse.data.status === 'OK' && destinationResponse.data.results.length > 0) {
                const originLatLng = originResponse.data.results[0].geometry.location;
                const destinationLatLng = destinationResponse.data.results[0].geometry.location;

                setOriginCoords(originLatLng);
                setDestinationCoords(destinationLatLng);

                const directionsService = new window.google.maps.DirectionsService();

                directionsService.route(
                    {
                        origin: originLatLng,
                        destination: destinationLatLng,
                        travelMode: 'DRIVING',
                    },
                    handleDirectionsResponse
                );
            } else {
                setError('Endereço de origem ou destino inválido.');
            }
        } catch (error) {
            setError('Erro ao obter coordenadas:' + error.message);
        }
    };

    return (
        <div className="enderecos">
            <h2>Endereço</h2>
            Endereço da Sua Empresa:
            <input
                type="text"
                name="origin"
                placeholder="Endereço da sua Empresa"
                value={search.origin}
                onChange={handleInputChange}
            />
            <br />
            Qual tipo de produto você deseja descartar?:
            <input
                type="text"
                name="destination"
                placeholder="Classificação do produto"
                value={search.destination}
                onChange={handleInputChange}
            />
            <button onClick={generateDirections}>Buscar</button>
            {error && <p>{error}</p>}
            <div className="map">
                <LoadScript googleMapsApiKey={key}>
                    <GoogleMap mapContainerStyle={mapStyles} zoom={13} center={center || defaultCenter}>
                        {originCoords && <Marker position={originCoords} />}
                        {destinationCoords && <Marker position={destinationCoords} />}
                        {directions && (
                            <DirectionsRenderer
                                options={{
                                    directions: directions,
                                }}
                            />
                        )}
                    </GoogleMap>
                </LoadScript>
                {/* <FindLocation /> */}
            </div>
        </div>
    );
};

export default MapContainer;
