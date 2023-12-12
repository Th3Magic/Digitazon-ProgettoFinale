import React from 'react'
import logo from '../img/logo.png'
import { useNavigate } from "react-router-dom";

export default function Header({ user, logout, setError, setMessage }) {

    const navigate = useNavigate();

    function justEat() {
        if (!user.type) {
            navigate("/")
            setError("")
            setMessage("")
        }
    }

    return (
        <div className="header">
            <div className='logo'>
                <img src={logo} alt="Just Eat" onClick={justEat} />
            </div>
            <div className='nav'>
                <button className='header-btn' onClick={() => {
                    navigate("/ChiSiamo")
                    setError("")
                    setMessage("")
                }
                }>Chi Siamo</button>
                {user.type ? <div className='empty'>

                </div> : <button className='header-btn' onClick={() => {
                    navigate("/LavoraConNoi")
                    setError("")
                    setMessage("")
                }
                }>Lavora con noi</button>}
                {user.name ?
                    <div>
                        <button className='header-btn' onClick={() => navigate("/Profilo")}>{user.name}</button>
                        <span className='logout' onClick={logout}> ⛔ <p className='hovertext'>Logout</p></span>
                    </div>
                    : <button className='header-btn' onClick={() => {
                        navigate("/Login")
                        setError("")
                        setMessage("")
                    }
                    }>Accedi</button>}
                <button className='header-btn' onClick={() => {
                    navigate("/Faq")
                    setError("")
                    setMessage("")
                }
                }>FAQ</button>
            </div>
        </div>
    )
}
