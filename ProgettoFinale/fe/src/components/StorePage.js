import { useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom";

export default function StorePage({ user, setMessage, shopCart, setShopCart, apiKey }) {

    const { city, restaurant } = useParams()
    const [store, setStore] = useState({})
    const [showMenu, setShowMenu] = useState(true);
    const [menuKeys, setMenuKeys] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)
    const [mapSrc, setMapSrc] = useState("")
    const [msg, setMsg] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        async function get() {
            let response = await fetch(`http://localhost:3001/shops/${city}/${restaurant}`)
            let res = await response.json()
            if (res.error) {
                setMessage("Shop not available at the moment, try with another one")
                navigate(`/${city}`)
                console.log(res.msg)
            } else {
                setStore(res)
                setMenuKeys(Object.keys(res.menu))
                let finalAddress = res.address.replaceAll(" ", "%20") + ",%20" + city + ", Italy"
                setMapSrc(finalAddress)
            }
        }
        get()
    }, [city, restaurant]);

    useEffect(() => {
        if (shopCart[store.name] && shopCart[store.name].length > 0) {
            let newTotalPrice = shopCart[store.name].reduce((acc, curr) => acc + curr.price * curr.quantity, 0)
            setTotalPrice(newTotalPrice.toFixed(2))
        } else {
            setTotalPrice(0)
        }
    }, [shopCart, store.name])

    function addToCart(item) {
        if (user.name) {
            setMsg("")
        }
        let newCart = { ...shopCart }
        let cartKeys = Object.keys(shopCart)
        if (cartKeys.length === 0) {
            item["quantity"] = 1
            newCart[store.name] = [item]
            setShopCart({ ...newCart })
            return
        }

        let shopCartIndex = cartKeys.indexOf(store.name)
        if (shopCartIndex > -1) {
            if (newCart[store.name].find(dupli => dupli.name === item.name)) {
                item["quantity"] += 1
            } else {
                item["quantity"] = 1
                newCart[store.name].push(item)
            }
        } else {
            item["quantity"] = 1
            newCart[store.name] = [item]
        }
        setShopCart({ ...newCart })
    }

    function removeOne(item) {
        let newCart = { ...shopCart }
        let itemIndex = newCart[store.name].findIndex(orderItem => orderItem.name === item.name)
        if (newCart[store.name][itemIndex].quantity > 1) {
            newCart[store.name][itemIndex].quantity -= 1
        } else {
            newCart[store.name].splice(itemIndex, 1)
        }
        setShopCart({ ...newCart })
    }

    async function checkout() {

        if (shopCart[store.name].length === 0) {
            setMsg("Inserisci qualcosa prima di ordinare")
            return
        }

        if (!user.name) {
            return
        }

        let order = { user: user.email, shop: restaurant, shopAddress: store.address, city: city, items: shopCart[store.name], totalPrice: totalPrice }
        let response = await fetch(`http://localhost:3001/orders/${city}/${store.email}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order)
        })
        let res = await response.json()
        if (res.error) {
            setMsg(res.msg)
        } else {
            setMsg("Ordine effettuato con successo")
        }
    }

    console.log(mapSrc)

    return (
        <>
            {store && (
                <div className='store-middle'>
                    {store.name && <div className={`bg-${store.name.replaceAll(" ", "")}`}>
                        <div className='arrow' onClick={() => navigate(`/${city}`)}></div>
                        <div className='store-box'>
                            <h1>{store.name}</h1>
                            <span>{store.address}, {store.city}</span>
                        </div>
                        <div className='order-box'>
                            <h2>IL TUO ORDINE</h2>
                            {shopCart[store.name] && shopCart[store.name].length > 0 ?
                                <div>
                                    {shopCart[store.name].map(item =>
                                        <div className='order-items' key={item.name} >
                                            <div className='order-item'>
                                                <div className='item-info'>
                                                    <p><strong>{item.name}</strong></p>
                                                    <p>{item.description}</p>
                                                    <p>{item.price * item.quantity} €</p>
                                                </div>
                                                <div className='item-qty'>
                                                    <button className='item-qty-btn' onClick={() => addToCart(item)}> + </button>
                                                    <p>{item.quantity}</p>
                                                    <button className='item-qty-btn' onClick={() => removeOne(item)}> - </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div> : <div>
                                    <p>Non hai ancora aggiunto prodotti al tuo ordine.</p>
                                </div>}
                            {(!user.name && totalPrice > 0) &&
                                <div>
                                    <p className='error'>Devi effettuare il login per completare l'ordine</p>
                                </div>}
                            <div className='delivery-address'>
                                {user.name &&
                                    <div>
                                        <p><strong>Indirizzo di consegna:</strong></p>
                                        <p>{user.address} - {user.city}</p>
                                    </div>}
                            </div>
                            <div className="cart-total">
                                <span>Totale: {totalPrice} €</span>
                                <button className='checkout' onClick={checkout}>Completa l'ordine</button>
                            </div>
                            <div>{msg && <p className='msg'>{msg}</p>}</div>
                        </div>
                    </div>}
                    <div className='menu-info'>
                        <button className='shop-btn' onClick={() => setShowMenu(true)}>
                            <p>Menù</p>
                        </button>
                        <button className='shop-btn' onClick={() => setShowMenu(false)}>
                            <p>Info</p>
                        </button>
                    </div>
                    <div className='content'>
                        {showMenu ? (
                            store.menu && (
                                <div className='menu'>
                                    <h2>Menù</h2>
                                    {menuKeys.map(key =>
                                        <div>
                                            <h3>{key}</h3>
                                            {store.menu[key].map(item => (
                                                <div className='menu-item' key={item.name} onClick={() => addToCart(item)}>
                                                    <p><strong>{item.name}</strong></p>
                                                    <p>{item.description}</p>
                                                    <p>{item.price} €</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )
                        ) : (
                            <div className='info-menu'>
                                <h2>DOVE SIAMO</h2>
                                <div>
                                    <iframe
                                        width="550"
                                        height="380"
                                        loading="lazy"
                                        style={{ border: 0 }}
                                        title={store.name}
                                        referrerpolicy="no-referrer-when-downgrade"
                                        src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${mapSrc}`}>
                                    </iframe>
                                </div>
                                <h2>RECENSIONI</h2>
                                {store.reviews.length > 0 &&
                                    <div>
                                        {store.reviews.map(review =>
                                            <div className='recensione'>
                                                <span>Utente: {review.name}</span>
                                                <p>{review[Object.keys(review)[0]]}</p>
                                            </div>)}
                                    </div>}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}