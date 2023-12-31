import { useNavigate } from 'react-router'
import ShopProfile from './ShopProfile'
import UserProfile from './UserProfile'
import { useEffect } from 'react'

export default function Profilo({ user, setUser, logout }) {

    const navigate = useNavigate()
    const token = localStorage.getItem('jwtToken')

    useEffect(() => {
        if (!user.name) {
            navigate('/Login')
        }
    }, [user.name])


    useEffect(() => {
        if (user.type) {
            async function get() {
                let response = await fetch(`http://localhost:3001/shops/${user.city}/${user.name}`)
                let res = await response.json()
                if (res.error) {
                    console.log(res.msg)
                } else {
                    setUser(res)
                }
            }
            get()
        } else {
            async function get() {
                let response = await fetch(`http://localhost:3001/users/${user.email}`, {
                    method: 'GET',
                    headers: {
                        Authorization: token,
                    }
                })
                let res = await response.json()
                if (res.error) {
                    console.log(res.msg)
                } else {
                    setUser(res)
                }
            }
            get()
        }

    }, [])

    return (
        <div className='profile'>
            {user.type ? <ShopProfile user={user} setUser={setUser} logout={logout} /> : <UserProfile user={user} setUser={setUser} logout={logout} />}
        </div>
    )
}
