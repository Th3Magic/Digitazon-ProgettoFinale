import { useState } from 'react'

export default function LoginForm({ Login, Signup, error, setError }) {

    const [isLogin, setIsLogin] = useState(true)
    const [details, setDetails] = useState({ name: "", email: "", password: "", city: "", address: "" })

    function handleToggleForm() {
        setIsLogin(!isLogin)
        setError("")
    }

    const submitHandler = e => {
        e.preventDefault()

        if (isLogin) {
            Login(details)
        } else {
            Signup(details)
            setDetails({ name: "", email: "", password: "", city: "", address: "" })
        }
    }

    return (
        <div className='login'>
            <form onSubmit={submitHandler}>
                <div className='form-inner'>
                    <h2>{isLogin ? 'Login' : 'Signup'}</h2>
                    {(error !== "") ? (<div className='error'>{error}</div>) : ""}
                    {!isLogin &&
                        <div>
                            <div className='form-group'>
                                <label htmlFor="name">Nome:</label>
                                <input type="text" name='name' id='name' onChange={e => setDetails({ ...details, name: e.target.value })} value={details.name} />
                            </div>

                            <div className='form-group'>
                                <label htmlFor="password">Città: </label>
                                <input type="text" name='password' id='pass' onChange={e => setDetails({ ...details, city: e.target.value })} value={details.city} />
                            </div>

                            <div className='form-group'>
                                <label htmlFor="password">Indirizzo: </label>
                                <input type="text" name='password' id='pass' onChange={e => setDetails({ ...details, address: e.target.value })} value={details.address} />
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
