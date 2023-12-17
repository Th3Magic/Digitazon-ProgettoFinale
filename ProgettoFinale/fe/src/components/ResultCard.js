import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import deliveryImg from '../img/delivery-time.png'

export default function ResultCard({ result, city, userLocation }) {

    const navigate = useNavigate();
    const [timeTravel, setTimeTravel] = useState([])

    useEffect(() => {
        if (userLocation.length > 0) {
            let R = 6371.0710 // Radius of the Earth in miles
            let rlat1 = userLocation[0] * (Math.PI / 180) // Convert degrees to radians
            let rlat2 = result.geometry.location.lat() * (Math.PI / 180) // Convert degrees to radians
            let difflat = rlat2 - rlat1; // Radian difference (latitudes)
            let difflon = (result.geometry.location.lng() - userLocation[1]) * (Math.PI / 180) // Radian difference (longitudes)

            let d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat / 2) * Math.sin(difflat / 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2)))
            let minVel = 40
            let maxVel = 50
            const minTime = (d.toFixed(2) / maxVel) * 60
            const maxTime = (d.toFixed(2) / minVel) * 60
            setTimeTravel([Math.floor(minTime), Math.floor(maxTime)])
        }
    }, [result, userLocation])

    return (
        <div>
            <div className="result-item" onClick={() => navigate(`/${city}/${result.name}`)}>
                {result.photos && result.photos[0] && (
                    <img
                        src={result.photos[0].getUrl()}
                        alt={result.name}
                    />
                )}
                <div className='result-title'>
                    <span className='title'>{result.name}</span>
                </div>
                <div className='result-info'>
                    <span className='address'>{result.vicinity}</span>
                    {timeTravel.length > 0 && <div>
                        {timeTravel[0] !== timeTravel[1] ?
                            <p className='delivery-time'><img src={deliveryImg} alt="" className='delivery-time-img' />{timeTravel[0]} - {timeTravel[1]} min</p> :
                            <p className='delivery-time'><img src={deliveryImg} alt="" className='delivery-time-img' />{timeTravel[0]} min</p>}
                    </div>}
                </div>
            </div>
        </div>
    )
}
