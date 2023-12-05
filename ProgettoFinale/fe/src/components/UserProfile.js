import { useEffect, useState } from 'react'

export default function UserProfile({ user, logout }) {
    const [selectedButton, setSelectedButton] = useState(null);
    const [modifiedName, setModifiedName] = useState(user.name)
    const [modifiedPhone, setModifiedPhone] = useState("")
    const [preferences, setPreferences] = useState({});
    const [review, setReview] = useState("")
    const [msg, setMsg] = useState("")

    useEffect(() => {
        if (user && user.contacts)
            setPreferences({
                email: user.contacts.email,
                sms: user.contacts.sms
            })
    }, [user])

    const handleButtonClick = (buttonId) => {
        if (selectedButton === buttonId) {
            setSelectedButton(null)
        } else {
            setSelectedButton(buttonId);
        }
    }

    const handleCheckboxChange = (preference) => {
        setPreferences((prevPreferences) => ({
            ...prevPreferences,
            [preference]: !prevPreferences[preference],
        }));
    };


    async function modifyUser() {

        let res = await fetch(`http://localhost:3001/users/${user.email}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: modifiedName,
                phone: modifiedPhone,
                contacts: preferences
            })
        })
        console.log(res.status)
        res = await res.json()
        if (res.error) {
            console.log(res.msg)
        }
    }

    async function deleteUser() {

        let res = await fetch(`http://localhost:3001/users/${user.email}`, {
            method: 'DELETE'
        })
        console.log(res.status)
        res = await res.json()
        if (res.error) {
            console.log(res.msg)
        }
        logout()
    }

    async function addReview(orderId) {

        let res = await fetch(`http://localhost:3001/orders/${orderId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ [orderId]: review, name: user.name })
        })
        console.log(res.status)
        res = await res.json()
        if (res.error) {
            console.log(res.msg)
        } else {
            setMsg(res.msg)
        }
    }

    return (
        <div>
            <div className='profile-nav'>
                <ul>
                    <li>
                        <button onClick={() => handleButtonClick(1)} className='profile-btn'>Account</button>
                    </li>
                    {selectedButton === 1 &&
                        <div>
                            <h4>Nome</h4>
                            <input className="profile-input" type="text" placeholder={user.name} onChange={(e) => setModifiedName(e.target.value)} />
                            <h4>Email</h4>
                            <input className="profile-input" type="text" value={user.email} readOnly />
                            <h4>Cellulare</h4>
                            <input className="profile-input" type="text" placeholder={user.phone ? user.phone : ""} onChange={(e) => setModifiedPhone(e.target.value)} />
                            <br />
                            <button className='modify-btn' onClick={modifyUser}>
                                Salva le modifiche
                            </button>
                        </div>
                    }
                    <li>
                        <button onClick={() => handleButtonClick(2)} className='profile-btn'>I Tuoi Ordini</button>
                    </li>
                    {selectedButton === 2 &&
                        <div>
                            {user.orders.length > 0 ?
                                <div>{user.orders.map(order =>
                                    <div className='profile-order'>
                                        <h4>Data dell'ordine</h4>
                                        <p>{order.date}</p>
                                        <h4>Negozio</h4>
                                        <p>{`${order.shop} - ${order.shopAddress}, ${order.city}`}</p>
                                        <h4>Dettaglio dell'ordine</h4>
                                        {order.items.map(item =>
                                            <div>
                                                <p>{`${item.quantity} - ${item.name} `}</p>
                                            </div>)}
                                        <br />
                                        <div><strong>Totale Pagato:</strong> {order.totalPrice} €</div>
                                        <br />
                                        <br />
                                        {user.reviews.find(review => review[order._id] !== undefined) ?
                                            <div className='existing-review'>
                                                <h4>Recensione</h4>
                                                <p>{user.reviews.find(review => review[order._id] !== undefined)[order._id]}</p>
                                            </div> :
                                            <div className='review'>
                                                <p>Lascia una recensione</p>
                                                <textarea name="review" cols="50" rows="10" onChange={(e) => setReview(e.target.value)}></textarea>
                                                <button className='review-btn' onClick={() => addReview(order._id)}>Invia recensione</button>
                                                {msg && <p>{msg}</p>}
                                            </div>}
                                    </div>
                                )}</div> :
                                <p> Non hai ancora effettuato un ordine.</p>}
                        </div>
                    }
                    <li>
                        <button onClick={() => handleButtonClick(3)} className='profile-btn'>Indirizzi di consegna</button>
                    </li>
                    {selectedButton === 3 &&
                        <div>
                            {user.addresses ? user.addresses.map(address => <input className="profile-input" type="text" value={address} readOnly />) : <p><strong>Non hai alcun indirizzo di consegna inserito</strong></p>}
                        </div>
                    }
                    <li>
                        <button onClick={() => handleButtonClick(4)} className='profile-btn'>Modalità di contatto</button>
                    </li>
                    {selectedButton === 4 &&
                        <div className='contatti'>
                            <p>Desidero ricevere aggiornamenti tramite</p>
                            <span>
                                <input
                                    type="checkbox"
                                    checked={preferences.sms}
                                    onChange={() => handleCheckboxChange('sms')}
                                />
                                SMS
                            </span>
                            <span>
                                <input
                                    type="checkbox"
                                    checked={preferences.email}
                                    onChange={() => handleCheckboxChange('email')}
                                />
                                Email
                            </span>
                            <button className='modify-btn' onClick={modifyUser}>
                                Salva le modifiche
                            </button>
                        </div>
                    }
                    <li>
                        <button onClick={() => handleButtonClick(5)} className='profile-btn'>Elimina Account</button>
                    </li>
                    {selectedButton === 5 &&
                        <button className="noselect" onClick={deleteUser}><span className="text">Elimina</span><span className="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path></svg></span></button>
                    }
                </ul>
            </div>
        </div>
    )
}
