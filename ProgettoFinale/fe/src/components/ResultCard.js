import React from 'react'
import { useNavigate } from "react-router-dom";

export default function ResultCard({ result, city }) {

    const navigate = useNavigate();

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
                    <span className='stars'>{result.rating && Array(Math.floor(result.rating))
                        .fill()
                        .map((_, i) => (
                            <p>⭐</p>
                        ))}</span>
                </div>
                <span className='address'>{result.vicinity}</span>
            </div>
        </div>
    )
}
