import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ResultCard from './ResultCard';

export default function Results({ message }) {
    let { city } = useParams();
    city = city.charAt(0).toUpperCase() + city.slice(1);
    const [loading, setLoading] = useState(false);
    const [allRestaurants, setAllRestaurants] = useState([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);

    useEffect(() => {
        const loadGoogleMapsScript = () => {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBNxVL9_AE1dACkeKR-TZOQUkDLJ4ZRrEE&libraries=places&callback=initMap`;
            script.defer = true;
            script.async = true;
            const onLoadCallback = () => {
                initMap("ristorante", city, setAllRestaurants, setLoading);
            };
            script.onload = onLoadCallback;
            document.head.appendChild(script);
        };
        loadGoogleMapsScript();
    }, [city]);

    useEffect(() => {
        const applyFilter = (filterKeyword) => {
            if (!filterKeyword) {
                setFilteredRestaurants(allRestaurants);
            } else {
                const filtered = allRestaurants.filter((restaurant) => {
                    return restaurant.name.toLowerCase().match(filterKeyword.toLowerCase());
                });
                setFilteredRestaurants(filtered);
            }
        };
        applyFilter();
    }, [allRestaurants]);

    const handleFilterClick = (keyword) => {
        setLoading(true);
        setAllRestaurants([]);
        initMap(keyword, city, setAllRestaurants, setLoading);
    };

    return (
        <div className='middle'>
            <div className='sidebar'>
                <h3>Cibo</h3>
                <ul>
                    <p onClick={() => handleFilterClick("ristorante")}><span>🍲</span><li>Ristoranti</li></p>
                    <p onClick={() => handleFilterClick("pizzeria")}><span>🍕</span><li>Pizzerie</li></p>
                    <p onClick={() => handleFilterClick("(McDonald's")}><span>🍔</span><li>Fast Food</li></p>
                    <p onClick={() => handleFilterClick("sushi")}><span>🍣</span><li>Giapponese</li></p>
                </ul>
            </div>
            <div className='results'>
                <h1>Ristoranti a {city}</h1>
                {loading && <p className='loading'>Ricerca in corso...</p>}
                {message && <p className='error'>{message}</p>}
                <ul>
                    {filteredRestaurants.map((restaurant, index) => (
                        <li key={`${restaurant.place_id}-${index}`}>
                            <ResultCard result={restaurant} city={city} />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

async function ottieniCoordinate(city) {
    let response = await fetch(`https://api.api-ninjas.com/v1/geocoding?city=${city}&country=Italy`, {
        headers: { 'X-Api-Key': '7jkbvogD+tCGRtDELalkoA==SYGJEsL20SGNvIKZ' },
        contentType: 'application/json'
    })
    let res = await response.json()
    return [res[0].latitude, res[0].longitude]
}

async function initMap(keyword, city, setAllRestaurants, setLoading) {
    setLoading(true)

    try {
        const latLng = await ottieniCoordinate(city)
        const location = new window.google.maps.LatLng(latLng[0], latLng[1])
        const placesService = new window.google.maps.places.PlacesService(document.createElement('div'))

        const restaurantRequest = {
            location: location,
            radius: 5000,
            keyword: keyword,
            fields: ["name", "vicinity", "photos", "rating"]
        };

        const fetchResults = (request) => {
            placesService.nearbySearch(request, (results, status, pagination) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                    setAllRestaurants((prevResults) => [...prevResults, ...results])

                    if (pagination.hasNextPage) {
                        pagination.nextPage()
                    } else {
                        setLoading(false)
                    }
                } else {
                    console.error('Error fetching restaurants:', status)
                    setLoading(false)
                }
            });
        };

        setAllRestaurants([])
        fetchResults(restaurantRequest)
    } catch (error) {
        console.error('Error initializing map:', error)
        setLoading(false)
    }
}
