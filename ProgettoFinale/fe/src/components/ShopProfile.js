import { useState } from 'react'
import Modal from 'react-modal';

Modal.setAppElement('#root');

export default function ShopProfile({ user, setUser, logout }) {
    const [selectedButton, setSelectedButton] = useState(null);
    const [menu, setMenu] = useState([])
    const [modfiedName, setModifiedName] = useState("")
    const [modfiedDesc, setModifiedDesc] = useState("")
    const [modfiedPrice, setModifiedPrice] = useState("")
    const [isAddToMenuDialogOpen, setAddToMenuDialogOpen] = useState(false);
    const [addingCategory, setAddingCategory] = useState("");

    function showMenu() {
        let res = []
        for (let items in user.menu) {
            res.push(user.menu[items])
        }
        setMenu(res)
    }

    const handleButtonClick = (buttonId) => {
        if (selectedButton === buttonId) {
            setSelectedButton(null)
        } else {
            setSelectedButton(buttonId);
        }
    }

    async function deleteShop() {

        let res = await fetch(`http://localhost:3001/shops/${user.city}/${user.email}`, {
            method: 'DELETE'
        })
        console.log(res.status)
        res = await res.json()
        if (res.error) {
            console.log(res.msg)
        }
        logout()
    }

    async function modifyItem(index, key) {
        let newMenu = user.menu
        newMenu[key][index] = {
            name: modfiedName ? modfiedName : newMenu[key][index].name, description: modfiedDesc ? modfiedDesc : newMenu[key][index].description,
            price: modfiedPrice ? modfiedPrice : newMenu[key][index].price
        }
        let res = await fetch(`http://localhost:3001/shops/${user.city}/${user.email}/menu`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ menu: newMenu })
        })
        console.log(res.status)
        res = await res.json()
        if (res.error) {
            console.log(res.msg)
        }
        setUser({ menu: newMenu, ...user })
        setModifiedName("")
        setModifiedDesc("")
        setModifiedPrice("")
    }

    async function deleteItem(index, key) {
        let newMenu = user.menu
        newMenu[key].splice(index, 1)
        let res = await fetch(`http://localhost:3001/shops/${user.city}/${user.email}/menu`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ menu: newMenu })
        })
        console.log(res.status)
        res = await res.json()
        if (res.error) {
            console.log(res.msg)
        }
        setUser({ menu: newMenu, ...user })
    }

    function handleAddToMenuClick(key) {
        setAddingCategory(key)
        setAddToMenuDialogOpen(true);
    };

    const closeAddToMenuDialog = () => {
        setAddToMenuDialogOpen(false);
    };

    async function addItemToMenu() {
        let newMenu = user.menu
        let itemToAdd = {
            name: modfiedName, description: modfiedDesc, price: modfiedPrice
        }
        newMenu[addingCategory].push(itemToAdd)
        let res = await fetch(`http://localhost:3001/shops/${user.city}/${user.email}/menu`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ menu: newMenu })
        })
        console.log(res.status)
        res = await res.json()
        if (res.error) {
            console.log(res.msg)
        }
        setAddToMenuDialogOpen(false);
        setModifiedName("")
        setModifiedDesc("")
        setModifiedPrice("")
    }

    return (
        <div>
            <div className='profile-nav'>
                <ul>
                    <li>
                        <button onClick={() => { handleButtonClick(1) }} className='profile-btn'>Account</button>
                    </li>
                    {selectedButton === 1 &&
                        <div>
                            <h4>Nome del ristorante</h4>
                            <input className="profile-input" type="text" placeholder={user.name} readOnly />
                            <h4>Email</h4>
                            <input className="profile-input" type="text" value={user.email} readOnly />
                            <h4>Indirizzo</h4>
                            <input className="profile-input" type="text" value={`${user.address},${user.city}`} readOnly />
                            <br />
                            <p className='error'>Per modificare questi dati contatta il supporto</p>
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
                                        <h4>Utente</h4>
                                        <p>{order.user}</p>
                                        <h4>Dettaglio dell'ordine</h4>
                                        {order.items.map(item =>
                                            <div>
                                                <p>{`${item.quantity} - ${item.name} `}</p>
                                            </div>)}
                                        <br />
                                        <div><strong>Totale Pagato:</strong> {order.totalPrice} €</div>
                                        <br />
                                        {user.reviews.find(review => review[order._id] !== undefined) &&
                                            <div className='existing-review'>
                                                <h4>Recensione</h4>
                                                <p>{user.reviews.find(review => review[order._id] !== undefined)[order._id]}</p>
                                            </div>}
                                    </div>
                                )}</div> :
                                <p> Non hai ancora ricevuto nessun ordine.</p>}
                        </div>
                    }
                    <li>
                        <button onClick={() => {
                            handleButtonClick(3)
                            showMenu()
                        }} className='profile-btn'>Menù</button>
                    </li>
                    {selectedButton === 3 && (
                        <div>
                            {menu.map((items, keyIndex) => (
                                <div>
                                    <h2>{Object.keys(user.menu)[keyIndex]}</h2>
                                    <button className='add-menu-btn' onClick={() => handleAddToMenuClick(Object.keys(user.menu)[keyIndex])}>Aggiungi al menù</button>
                                    {items.map((item, index) => (
                                        <div>
                                            <div className='menu-profile'>
                                                <p><strong>Nome</strong></p><input className="profile-input" type="text" placeholder={item.name} onChange={(e) => setModifiedName(e.target.value)} />
                                                <p><strong>Descrizione</strong></p><input className="profile-input" type="text" placeholder={item.description} onChange={(e) => setModifiedDesc(e.target.value)} />
                                                <p><strong>Prezzo</strong></p><input className="profile-input" type="number" placeholder={item.price} onChange={(e) => setModifiedPrice(e.target.value)} />
                                                <br />
                                                <br />
                                                <button onClick={() => modifyItem(index, Object.keys(user.menu)[keyIndex])} className='menu-profile-btn'>Modifica</button>
                                                <button onClick={() => deleteItem(index, Object.keys(user.menu)[index])} className='menu-profile-btn'>Elimina</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))
                            }
                            <Modal
                                isOpen={isAddToMenuDialogOpen}
                                onRequestClose={closeAddToMenuDialog}
                                contentLabel="Add to Menu Dialog"
                                className="add-to-menu-modal"
                            >
                                <p className='dialog-title'>Aggiungi al Menu</p>
                                <p><strong>Nome</strong></p><input className="profile-input" type="text" onChange={(e) => setModifiedName(e.target.value)} />
                                <p><strong>Descrizione</strong></p><input className="profile-input" type="text" onChange={(e) => setModifiedDesc(e.target.value)} />
                                <p><strong>Prezzo</strong></p><input className="profile-input" type="number" onChange={(e) => setModifiedPrice(e.target.value)} />
                                <br />
                                <br />
                                <br />
                                <button className="menu-profile-btn" onClick={addItemToMenu}>Aggiungi</button>
                                <button className="menu-profile-btn" onClick={closeAddToMenuDialog}>Close Dialog</button>
                            </Modal>
                        </div>
                    )}

                    <li>
                        <button onClick={() => handleButtonClick(4)} className='profile-btn'>Elimina Account</button>
                    </li>
                    {selectedButton === 4 &&
                        <button className="noselect" onClick={deleteShop}><span className="text">Elimina</span><span className="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path></svg></span></button>
                    }
                </ul>
            </div>
        </div>
    )
}
