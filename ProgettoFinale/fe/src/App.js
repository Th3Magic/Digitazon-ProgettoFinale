import './App.css';
import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from "react-router-dom"
import HomePage from './components/HomePage'
import Faq from './components/Faq'
import ChiSiamo from './components/ChiSiamo'
import LavoraConNoi from './components/LavoraConNoi'
import LoginForm from './components/LoginForm'
import Results from './components/Results'
import Header from './components/Header'
import Footer from './components/Footer'
import Profilo from './components/Profilo'
import TerminiCondizioni from './components/TerminiCondizioni'
import Privacy from './components/Privacy'
import StorePage from './components/StorePage'

function App() {

  const navigate = useNavigate()

  const [user, setUser] = useState({ name: "", email: "" })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [message, setMessage] = useState("")
  const [shopCart, setShopCart] = useState(JSON.parse(localStorage.getItem('cart')) ? JSON.parse(localStorage.getItem('cart')) : {})
  const [apiKey, setApiKey] = useState("")
  const [userLocation, setUserLocation] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('jwtToken')
    const userLogged = localStorage.getItem('user')
    async function getToken() {
      let response = await fetch(`http://localhost:3001/users/${userLogged}`, {
        method: 'GET',
        headers: {
          Authorization: token,
        }
      })
      let res = await response.json()
      setUser(res)
    }
    if (token) {
      getToken()
    }
    async function get() {
      let response = await fetch(`http://localhost:3001/API-key`)
      let res = await response.json()
      setApiKey(res)
    }
    get()
  }, [])

  useEffect(() => {
    if (!user.type && user.address) {
      let parts = user.address.split(', ')
      let street = parts[0]
      let number = parts[1]
      let formattedAddress = number + '+' + street.replace(' ', '+')
      async function getLatLng() {
        let response = await fetch(`https://geocode.maps.co/search?q=${formattedAddress}+${user.city}`)
        let res = await response.json()
        let latlng = res[0]
        setUserLocation([latlng.lat, latlng.lon])
      }
      getLatLng()
    }
  }, [user])

  async function login(details) {
    const response = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: details.email, password: details.password }),
    })
    if (response.status === 200) {
      const user = await response.json()
      const token = user.token
      localStorage.setItem('jwtToken', token)
      localStorage.setItem('user', user.email)
      setUser(user)
      user.type ? navigate("/Profilo") : navigate("/")
    } else {
      let res = await response.json()
      setError(res.msg)
    }
  }

  async function signup(details) {
    if (details.type) {
      const response = await fetch('http://localhost:3001/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: details.name, email: details.email, password: details.password, city: details.city, address: details.address, type: details.type }),
      })
      let res = await response.json()
      if (res.error) {
        setError(res.msg)
      } else {
        setSuccess("Shop registrato! Prova ad accedere e setta il tuo menù")
        setError("")
      }
    } else {
      const response = await fetch('http://localhost:3001/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: details.name, surname: details.surname, email: details.email, password: details.password, city: details.city, address: details.address }),
      })
      let res = await response.json()
      if (res.error) {
        setError(res.msg)
      } else {
        setSuccess("Utente registrato! Prova ad accedere")
        setError("")
      }
    }
  }

  async function logout() {
    const response = await fetch('http://localhost:3001/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: user.email }),
    })
    if (response.error) {
      setError("Can't logout")
    } else {
      localStorage.removeItem('jwtToken')
      localStorage.removeItem('user')
      localStorage.removeItem('cart')
      setUser({ name: "", email: "" })
      setShopCart({})
      setUserLocation([])
      console.log("User logout correctly")
      navigate("/")
    }
    setError("")
    setSuccess("")
  }

  return (
    <div className='container'>
      <Header user={user} logout={logout} setError={setError} setMessage={setMessage} setSuccess={setSuccess} />
      <Routes>
        <Route path="/" element={<HomePage user={user} message={message} />} />
        <Route path="/ChiSiamo" element={<ChiSiamo />} />
        <Route path="/LavoraConNoi" element={<LavoraConNoi signup={signup} error={error} />} />
        <Route path="/Faq" element={<Faq />} />
        <Route path="/Profilo" element={<Profilo user={user} setUser={setUser} logout={logout} />} />
        <Route path="/Login" element={<LoginForm user={user} login={login} signup={signup} error={error} setError={setError} success={success} setSuccess={setSuccess} />} />
        <Route path="/:city/:restaurant" element={< StorePage user={user} setMessage={setMessage} shopCart={shopCart} setShopCart={setShopCart} apiKey={apiKey} />} />
        <Route path="/:city" element={<Results message={message} setMessage={setMessage} apiKey={apiKey} userLocation={userLocation} />} />
        <Route path="/Termini&Condizioni" element={<TerminiCondizioni />} />
        <Route path="/Privacy" element={<Privacy />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App
