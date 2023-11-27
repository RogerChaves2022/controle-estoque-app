import { DirectionsRenderer, GoogleMap, LoadScript, Marker, useLoadScript } from '@react-google-maps/api';
import axios from 'axios';
import { useEffect, useState } from 'react';

const libraries = ['places', 'routes'];
const key = 'AIzaSyBejFbwfYUZm0OmKt1Rq7l4jP6rui2XYY4';

const FindLocation = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: key,
    libraries,
  });

  const [center, setCenter] = useState({ lat: -29.995922, lng: -51.1271904 });
  const [search, setSearch] = useState({ endereco: '', classificacao: '' });
  const [directions, setDirections] = useState(null);
  const [places, setPlaces] = useState([]);
  const [map, setMap] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);

  const mapStyles = {
    height: '400px',
    width: '500px',
  };


  useEffect(() => {
    if (isLoaded) {
      setMap(
        <GoogleMap mapContainerStyle={mapStyles} zoom={12} center={center}>
          {directions === null && places.map((place) => (
            <Marker           
              key={place.place_id}
              position={{
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
              }}
            />
          ))}
          {directions && (
            <DirectionsRenderer
              options={{
                directions: directions,
              }}
            />
          )}
        </GoogleMap>
      );
    }
  }, [isLoaded, center, places, directions]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearch({
      ...search,
      [name]: value,
    });
  };

  const handleSearch = async () => {
    setDirections(null)
    try {
      if (window.google && window.google.maps && map) {
        console.log("Pesquisa")
        // Use a API do Google Places para buscar lugares com base no termo de pesquisa

        const originResponse = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${search.endereco}&key=${key}`);


        if (originResponse.data.status === 'OK' && originResponse.data.results.length > 0) {
          const originLatLng = originResponse.data.results[0].geometry.location;
          setCenter(originLatLng);
          const request = {
            location: originLatLng,
            radius: 10000, // Raio em metros
            query: "Descarte de ".concat(search.classificao),
          };

          //const service = new window.google.maps.places.PlacesService(map);
          const service = new window.google.maps.places.PlacesService(document.createElement('GoogleMap'));

          service.textSearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              setPlaces(results);
              console.log(places)
            } else {
              console.log('Erro ao buscar lugares:', status);
            }
          });
        } else {
          console.log("Mapa ainda não foi renderizado")
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDirectionsResponse = (response) => {    
    console.log(directions);
    if (response && response.status === 'OK') {
      if (response.routes[0].legs[0].start_location) {
        setCenter({
          lat: response.routes[0].legs[0].start_location.lat(),
          lng: response.routes[0].legs[0].start_location.lng(),
        });
      }
      setDirections(response);
    } else {
      console.log('Erro ao obter direções');
    }
  };

  const handleCalculateRoute = async (place) => {
    if (map) {
      
      try {
        setDirections(null);
      
        const originResponse = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${search.endereco}&key=${key}`);


        if (originResponse.data.status === 'OK' && originResponse.data.results.length > 0) {
          const originLatLng = originResponse.data.results[0].geometry.location;



          const destination = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }

          setDestinationCoords(destination);

          const directionsService = new window.google.maps.DirectionsService();

          directionsService.route(
            {
              origin: originLatLng,
              destination: destination,
              travelMode: 'DRIVING',
            },
            (response)=>{
              handleDirectionsResponse(response);
              console.log(directions);
              // setDirections(null);
            }
            );
            // setDirections(null);
        }
      } catch (error) {
        console.log('Erro ao calcular rota. -> ' + error);
      }
    }
  };

  return (
    <LoadScript googleMapsApiKey={key} libraries={libraries}>
      <div className="places-search">
        <h2>Encontre as empresas que estão mais prximo de você com base em qual item você precisa descartar!</h2>
        <Input
          type="text"
          name="endereco"
          placeholder="Qual endereço de sua empresa?"
          value={search.endereco}
          handleChange={handleInputChange}
          label={'Qual endereço da sua empresa e seu descarte?'}
        />
        <Input
          type="text"
          name='classificacao'
          placeholder="Descarte de Plástico"
          value={search.classificacao}
          handleChange={handleInputChange}
          label={'Qual classificacao precisa descartar?'}
        />
        <button onClick={handleSearch}>Buscar</button>
        <div className="map">
          {isLoaded ? map : "Carregando..."}
        </div>
        <div className="lista-places">
          {places && places.map((lugar) => (
            <button key={lugar.place_id} onClick={() => handleCalculateRoute(lugar)}>
              <p>{lugar.name}</p>
            </button>
          ))}
        </div>
      </div>
    </LoadScript>
  );
};

export default FindLocation;
