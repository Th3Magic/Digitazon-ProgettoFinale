import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'

export default function LoginForm({ user, login, signup, error, setError, success, setSuccess }) {

    const [isLogin, setIsLogin] = useState(true)
    const [details, setDetails] = useState({ name: "", surname: "", email: "", password: "", city: "", address: "" })
    const navigate = useNavigate()

    useEffect(() => {
        if (user.name) {
            navigate('/Profilo')
        }
    }, [user.name])

    function handleToggleForm() {
        setIsLogin(!isLogin)
        setError("")
        setSuccess("")
    }

    const submitHandler = e => {
        e.preventDefault()

        if (isLogin) {
            login(details)
        } else {
            signup(details)
            setIsLogin(true)
            setDetails({ name: "", surname: "", email: "", password: "", city: "", address: "" })
        }
    }

    return (
        <div className='login'>
            <form onSubmit={submitHandler}>
                <div className='form-inner'>
                    <h2>{isLogin ? 'Login' : 'Signup'}</h2>
                    {error && <span className='login-error'> {error}</span>}
                    {success && <span className='login-success'> {success}</span>}
                    {!isLogin &&
                        <div>
                            <div className='form-group'>
                                <label htmlFor="name">Nome</label>
                                <input type="text" name='name' onChange={e => setDetails({ ...details, name: e.target.value })} value={details.name} />
                            </div>

                            <div className='form-group'>
                                <label htmlFor="name">Cognome</label>
                                <input type="text" name='cognome' onChange={e => setDetails({ ...details, surname: e.target.value })} value={details.surname} />
                            </div>

                            <div className='form-group'>
                                <label htmlFor="password">Città: </label>
                                <input type="text" name='password' placeholder="Es: Milano" onChange={e => setDetails({ ...details, city: e.target.value })} value={details.city} />
                            </div>

                            <div className='form-group'>
                                <label htmlFor="password">Indirizzo: </label>
                                <input type="text" name='password' placeholder="Es: Via Corsico, 2" onChange={e => setDetails({ ...details, address: e.target.value })} value={details.address} />
                            </div>

                        </div>}

                    <div className='form-group'>
                        <label htmlFor="email">Email: </label>
                        <input type="email" name="email" id="email" onChange={e => setDetails({ ...details, email: e.target.value })} value={details.email} />
                    </div>

                    <div className='form-group'>
                        <label htmlFor="password">Password: </label>
                        <input type="password" name='password' id='pass' onChange={e => setDetails({ ...details, password: e.target.value })} value={details.password} />
                    </div>

                    <div className='submit'>
                        <input type="submit" value={isLogin ? 'Login' : 'Signup'} />
                    </div>
                    <p>
                        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                        <span className="toggle" onClick={handleToggleForm}>
                            {isLogin ? 'Sign up' : 'Login'}
                        </span>
                    </p>
                </div>
            </form>
        </div>
    )
}
