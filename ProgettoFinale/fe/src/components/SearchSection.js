import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"

export default function SearchSection({ user, message }) {

    const navigate = useNavigate();
    const [city, setCity] = useState("")

    useEffect(() => {
        if (user.type) {
            navigate('/Profilo')
        }
        if (user.name) {
            setCity(user.city)
        }
    }, [user])

    return (
        <div className='search-container'>
            <div className="bg_home"></div>
            <div className='search-box'>
                <h2> Il bello è prenderci gusto </h2>
                <h3> Ordina ora dai ristoranti nella tua zona </h3>
                <div className="search__container">
                    <input className="search__input" type="text" placeholder="Città" value={city} onChange={(e) => setCity(e.target.value)} />
                    <button className='search-btn' onClick={() => navigate(`/${city}`)}>
                        <span className="btn-img">🔍︎</span>
                        <span className="btn-txt">Cerca</span>
                    </button>
                </div>
                {message && <p className='error'>{message}</p>}
            </div>
        </div>
    )
}