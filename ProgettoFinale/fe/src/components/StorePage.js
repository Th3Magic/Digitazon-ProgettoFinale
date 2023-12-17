import { useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom"

export default function StorePage({ user, setMessage, shopCart, setShopCart, apiKey }) {

    const { city, restaurant } = useParams()
    const [store, setStore] = useState({})
    const [showMenu, setShowMenu] = useState(true)
    const [menuKeys, setMenuKeys] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)
    const [rating, setRating] = useState("")
    const [deliveryFee, setDeliveryFee] = useState(true)
    const [mapSrc, setMapSrc] = useState("")
    const [msg, setMsg] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        setMessage("")
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
                if (res.reviews.length > 0) {
                    const totalRating = res.reviews.reduce((sum, review) => sum + review.rating, 0)
                    const averageRating = (totalRating / res.reviews.length).toFixed(1)
                    setRating('⭐️'.repeat(averageRating))
                }
            }
        }
        if (user.type) {
            navigate('/Profilo')
        } else {
            get()
        }
    }, [city, restaurant, user]);

    useEffect(() => {
        if (shopCart[store.name] && shopCart[store.name].length > 0) {
            let newTotalPrice = shopCart[store.name].reduce((acc, curr) => acc + curr.price * curr.quantity, 0)
            if (newTotalPrice > 9.99) {
                setTotalPrice(newTotalPrice.toFixed(2))
                setDeliveryFee(false)
            } else {
                setTotalPrice((newTotalPrice + 2.50).toFixed(2))
                setDeliveryFee(true)
            }
        } else {
            setTotalPrice(0)
        }
    }, [shopCart, store.name])

    function addToCart(item) {
        if (user.name) {
            setMsg("")
        }
        setError("")
        let newCart = { ...shopCart }
        let cartKeys = Object.keys(shopCart)
        if (!newCart[store.name] || newCart[store.name].length === 0) {
            item["quantity"] = 1
            newCart[store.name] = [item]
            setShopCart(newCart)
            return
        }
        let shopCartIndex = cartKeys.indexOf(store.name)
        if (shopCartIndex > -1) {
            let itemIndex = newCart[store.name].indexOf(newCart[store.name].find(dupli => dupli.name === item.name))
            if (itemIndex > -1) {
                newCart[store.name][itemIndex].quantity += 1
            } else {
                item["quantity"] = 1
                newCart[store.name].push(item)
            }
        } else {
            item["quantity"] = 1
            newCart[store.name] = [item]
        }
        setShopCart(newCart)
        localStorage.setItem('cart', JSON.stringify(newCart))
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
        localStorage.setItem('cart', JSON.stringify(newCart))
    }

    async function checkout() {

        if (!shopCart[store.name] || shopCart[store.name].length === 0) {
            setError("Inserisci qualcosa prima di ordinare")
            return
        }

        if (!user.name) {
            return
        }

        if (user.city !== store.city) {
            setError("Sei troppo distante. Cerca uno shop più vicino a te")
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
            setError(res.msg)
        } else {
            setMsg("Ordine effettuato con successo")
        }
    }

    return (
        <>
            {store && (
                <div className='store-middle'>
                    {store.name && <div className={`bg-${store.name.replaceAll(/[' ]/g, "")}`}>
                        <div className='arrow' onClick={() => navigate(`/${city}`)}></div>
                        <div className='store-box'>
                            <h1>{store.name}</h1>
                            {rating ? <div className='store-rating'>
                                <span>{rating}</span>
                                <p>({store.reviews.length})</p>
                            </div> :
                                <div className='store-rating'>
                                    <p className='no-reviews'> ★ ★ ★ ★ ★ </p>
                                    <p>(N/A)</p>
                                </div>}
                            <p className='free-delivery'>Ordina per un totale almeno di 10€ e non paghi la consegna!</p>
                        </div>
                        <div className='order-box'>
                            <h2>IL TUO ORDINE</h2>
                            {deliveryFee ? <p className='delivery-fee'>
                                Consegna: <strong> 2.50€ </strong>
                            </p> : <p className='delivery-fee'>
                                Consegna: <strong> GRATUITA </strong>
                            </p>}
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
                            <div>{msg && <p className='login-success'>{msg}</p>}</div>
                            <div>{error && <p className='error'>{error}</p>}</div>
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
                                            {store.menu[key].length > 0 ? <div>{store.menu[key].map(item => (
                                                <div className='menu-item' key={item.name} onClick={() => addToCart(item)}>
                                                    <p><strong>{item.name}</strong></p>
                                                    <p>{item.description}</p>
                                                    <p>{item.price}€</p>
                                                </div>))}
                                            </div> : <div>
                                                <p>Nessun piatto presente.</p>
                                            </div>}
                                        </div>
                                    )}
                                </div>
                            )
                        ) : (
                            <div className='info-menu'>
                                <h2 className='map'>DOVE SIAMO</h2>
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
                                <h2 className='recensioni'>RECENSIONI</h2>
                                {store.reviews.length > 0 ?
                                    <div>
                                        {store.reviews.map(review =>
                                            <div className='recensione'>
                                                <p>{review.name} <span>{'⭐️'.repeat(review.rating)}</span></p>
                                                <span>{review[Object.keys(review)[0]]}</span>
                                            </div>)}
                                    </div> :
                                    <div>
                                        <p>Nessuna recensione presente.</p>
                                    </div>}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}