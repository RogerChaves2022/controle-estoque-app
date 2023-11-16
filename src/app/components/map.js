import { useEffect, useState } from "react";
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useMap, useMapsLibrary } from "@vis.gl/react-google-maps"
//  import {DirectionsRenderer} from '@vis.gl/react-google-maps-hooks';
// import { DirectionsRenderer } from "@react-google-maps/api";
import axios from 'axios';
import '../styles/global.css'

const libraries = ['places', 'routes'];
const key = 'AIzaSyBejFbwfYUZm0OmKt1Rq7l4jP6rui2XYY4';
const mapId = '3c169621b794a378';

export default function Intro() {
    const [center, setCenter] = useState({ lat: -29.995922, lng: -51.1271904 });
    const [search, setSearch] = useState({ endereco: '', classificacao: '' });
    const [places, setPlaces] = useState([]);
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [open, setOpen] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [zoom, setZoom] = useState(15);
    const [classificacao, setClassificacao] = useState([]);


    useEffect(() => {
        const fetchClassificacao = async () => {
            try {
                const response = await axios.get('http://localhost/controle-estoque-app/v1/api/produto/classificacao');
                setClassificacao(response.data);
            } catch (error) {
                console.error('Erro ao buscar classificao:', error);
            }
        }
        fetchClassificacao()
    }, []);


        const handleInputChange = (e) => {
            const { name, value } = e.target;
            setSearch({
                ...search,
                [name]: value,
            });
        };

        const handleSearch = async (e) => {
            e.preventDefault();
            try {
                setRefresh(false);
                if (window.google && window.google.maps) {
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
                        const service = new window.google.maps.places.PlacesService(document.createElement('Map'));

                        service.textSearch(request, (results, status) => {
                            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                                setZoom(12);
                                // let filtro = results.filter((e)=> e.opening_hours === true);
                                console.log(results);
                                let convert = results.map((result) => ({
                                    name: result.name,
                                    place_id: result.place_id,
                                    formatted_address: result.formatted_address,
                                    phone_number: result.formatted_phone_number,
                                    photo: result.photos ? result.photos.map(e => e.getUrl()) : null,
                                    position: {
                                        lat: result.geometry.location.lat(),
                                        lng: result.geometry.location.lng(),
                                    },
                                    opening_hours: result.opening_hours ? result.opening_hours.isOpen() : null,
                                    business_status: result.business_status,
                                    website: result.website,
                                    url: result.url,
                                }));
                                setPlaces(convert);
                                console.log(convert)
                                // console.log(results[0].photos.map(e=> e.getUrl())[0])//.raw_reference.fife_url)
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



        const handleCalculateRoute = async (place) => {
            console.log("calcular rota");
            setRefresh(false)
            try {
                //setDirections(null);

                const originResponse = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${search.endereco}&key=${key}`);


                if (originResponse.data.status === 'OK' && originResponse.data.results.length > 0) {
                    const formatted_address = originResponse.data.results[0].formatted_address;



                    const destination = place.formatted_address;
                    setOrigin(formatted_address);
                    setDestination(destination);
                    setRefresh(true);
                    setZoom(20)
                    // console.log(refresh);
                }
            } catch (error) {
                console.log('Erro ao calcular rota. -> ' + error);
            }

        };

        const isFormValid = () => {
            // Verifique se todos os campos obrigatórios estão preenchidos
            return search.endereco && search.classificacao;
        };


        return (
            <APIProvider apiKey={key} libraries={libraries}>
                <div className="container-mapa">
                    <form className="places-search" onSubmit={handleSearch}>
                        <h4>Encontre as empresas que estão mais próximo de você!</h4>
                        <p>Qual endereço da sua empresa?</p>
                        <input
                            type="text"
                            name="endereco"
                            placeholder="Qual endereço de sua empresa?"
                            value={search.endereco}
                            onChange={handleInputChange}
                        />
                        <br />
                        <p>Qual classificacao de produto você precisa descartar?</p>
                        <select
                            name="classificacao"
                            value={search.classificacao}
                            onChange={handleInputChange}
                        >
                            {classificacao && classificacao.map((classe)=>
                            <option value={classe}>{classe}</option>
                            )}
                        </select><br/>
                        <button type="submit"  >Buscar</button> 
                        {/* disabled={!isFormValid()} */}
                    </form>

                    <div className="area-mapa">
                        <Map zoom={zoom} center={center} mapId={mapId} >
                            <AdvancedMarker position={center}>
                                <Pin background={"yellow"} borderColor={"black"} glyphColor={"brown"} />
                            </AdvancedMarker>
                            {places.map((place) => (
                                <AdvancedMarker
                                    key={place.place_id}
                                    position={place.position}
                                    onClick={() => setOpen(place)}
                                />
                            ))}
                            {open && <InfoWindow position={open.position} onCloseClick={() => setOpen(false)}>
                                <p>{open.name}</p>
                                <p>{open.formatted_address}</p>
                                <button key={open.place_id} onClick={() => handleCalculateRoute(open)}>
                                    <p>Calcular rota</p>
                                </button>
                            </InfoWindow>}
                            <Directions origin={origin} destination={destination} refresh={refresh} setRefresh={setRefresh} setOpen={setOpen} />
                        </Map>
                    </div>
                    <div className="lista-places">
                        {places && (places.map((place) => (
                            <div className="places" key={place.place_id}>
                                <p>{place.name}</p>
                                <p>{place.formatted_address}</p>

                                {place.photo &&
                                    <img src={place.photo} width={100} height={100} />}<br />
                                <button onClick={() => handleCalculateRoute(place)}>Calcular Rota</button>
                                {place.opening_hours && <p>Está aberto agora!</p>}
                            </div>)))}
                    </div>
                </div>
            </APIProvider>
        );
    }

function Directions({ origin, destination, refresh, setOpen }) {
            const map = useMap();
            const routesLibrary = useMapsLibrary('routes');
            const [directionsService, setDirectionsService] =
                useState(null);
            const [directionsRenderer, setDirectionsRenderer] =
                useState(null);
            const [routes, setRoutes] = useState([]);
            const [routeIndex, setRouteIndex] = useState(0);
            const selected = routes[routeIndex];
            const leg = selected?.legs[0];

            // Initialize directions service and renderer
            useEffect(() => {
                if (!routesLibrary || !map) return;
                if (!refresh) return;
                setDirectionsService(new routesLibrary.DirectionsService());
                setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
            }, [routesLibrary, map, refresh]);

            // Use directions service
            useEffect(() => {
                if (!directionsService || !directionsRenderer) return;
                console.log(refresh)
                if (!refresh) return;

                console.log(origin)
                console.log(destination)
                console.log('calculo de rota')
                directionsService
                    .route({
                        origin: origin,
                        destination: destination,
                        travelMode: google.maps.TravelMode.DRIVING,
                        provideRouteAlternatives: true
                    })
                    .then(response => {
                        directionsRenderer.setDirections(response);
                        setRoutes(response.routes);
                        // setRefresh(false);
                        setOpen(null);
                    });

                return () => directionsRenderer.setMap(null);
            }, [directionsService, directionsRenderer, refresh]);

            // Update direction route
            useEffect(() => {
                if (!directionsRenderer) return;
                if (!refresh) return;
                directionsRenderer.setRouteIndex(routeIndex);
            }, [routeIndex, directionsRenderer, refresh]);

            if (!leg) return null;

            return (
                <div className="directions">
                    <h2>{selected.summary}</h2>
                    <p>
                        {leg.start_address.split(',')[0]} to {leg.end_address.split(',')[0]}
                    </p>
                    <p>Distance: {leg.distance?.text}</p>
                    <p>Duration: {leg.duration?.text}</p>

                    <h2>Other Routes</h2>
                    <ul>
                        {routes.map((route, index) => (
                            <li key={route.summary}>
                                <button onClick={() => setRouteIndex(index)}>
                                    {route.summary}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            );
        }
