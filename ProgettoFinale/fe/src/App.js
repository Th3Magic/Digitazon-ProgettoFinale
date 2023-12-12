import './App.css';
import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from "react-router-dom";
import HomePage from './components/HomePage';
import Faq from './components/Faq';
import ChiSiamo from './components/ChiSiamo';
import LavoraConNoi from './components/LavoraConNoi';
import LoginForm from './components/LoginForm';
import Results from './components/Results';
import Header from './components/Header';
import Footer from './components/Footer';
import Profilo from './components/Profilo';
import TerminiCondizioni from './components/TerminiCondizioni';
import Privacy from './components/Privacy';
import StorePage from './components/StorePage';

function App() {

  const navigate = useNavigate()

  const [user, setUser] = useState({ name: "", email: "" })
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [shopCart, setShopCart] = useState({})
  const [apiKey, setApiKey] = useState("")
  const [userLocation, setUserLocation] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      fetch('http://localhost:3001/user-info', {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      })
        .then((response) => response.json())
        .then((userData) => {
          setUser(userData);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    }
    async function get() {
      let response = await fetch(`http://localhost:3001/API-key`)
      let res = await response.json()
      setApiKey(res)
    }
    get()
  }, []);

  useEffect(() => {
    if (user.address) {
      let parts = user.address.split(', ');
      let street = parts[0];
      let number = parts[1]
      let formattedAddress = number + '+' + street.replace(' ', '+');
      async function getLatLng() {
        let response = await fetch(`https://geocode.maps.co/search?q=${formattedAddress}+Milano`)
        let res = await response.json()
        let latlng = res[0]
        setUserLocation([latlng.lat, latlng.lon])
      }
      getLatLng()
    }
  }, [user.address])

  async function Login(details) {
    const response = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: details.email, password: details.password }),
    })
    if (response.status === 200) {
      console.log("Logged in")
      const user = await response.json()
      const token = user.token
      localStorage.setItem('jwtToken', token)
      if (user.type) {
        setUser({
          name: user.name,
          email: user.email,
          city: user.city,
          address: user.address,
          type: user.type,
          menu: user.menu,
          orders: user.orders
        })
        navigate("/Profilo")
      } else {
        setUser({
          name: user.name,
          email: user.email,
          city: user.city,
          address: user.address,
          orders: user.orders
        })
        navigate("/")
      }
    } else {
      let res = await response.json()
      setError(res.msg)
    }
  }

  async function Signup(details) {
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
        setError("Shop registered successfully. Try to login and set your market")
      }
    } else {
      const response = await fetch('http://localhost:3001/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: details.name, email: details.email, password: details.password, city: details.city, address: details.address }),
      })
      let res = await response.json()
      if (res.error) {
        setError(res.msg)
      } else {
        setError("User created successfully")
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
      localStorage.removeItem('jwtToken');
      setUser({ name: "", email: "" })
      setShopCart({})
      setUserLocation([])
      console.log("User logout correctly")
      navigate("/")
    }
    setError("")
  }

  return (
    <div className='container'>
      <Header user={user} logout={logout} setError={setError} setMessage={setMessage} />
      <Routes>
        <Route path="/" element={<HomePage user={user} />} />
        <Route path="/ChiSiamo" element={<ChiSiamo />} />
        <Route path="/LavoraConNoi" element={<LavoraConNoi Signup={Signup} error={error} />} />
        <Route path="/Faq" element={<Faq />} />
        <Route path="/Profilo" element={<Profilo user={user} setUser={setUser} logout={logout} />} />
        <Route path="/Login" element={<LoginForm Login={Login} Signup={Signup} error={error} setError={setError} />} />
        <Route path="/:city/:restaurant" element={< StorePage user={user} setMessage={setMessage} shopCart={shopCart} setShopCart={setShopCart} apiKey={apiKey} />} />
        <Route path="/:city" element={<Results message={message} apiKey={apiKey} userLocation={userLocation} />} />
        <Route path="/Termini&Condizioni" element={<TerminiCondizioni />} />
        <Route path="/Privacy" element={<Privacy />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
