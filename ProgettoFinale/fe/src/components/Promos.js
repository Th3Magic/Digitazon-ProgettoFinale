import { useNavigate } from 'react-router'
import promos from '../img/apps_prom.png'
import cityImg from '../img/city.png'

export default function Promos() {

    const navigate = useNavigate()

    return (
        <div className='promos'>
            <img src={promos} alt="" className='promos-img' />
            <div className='categorie'>
                <div className='categories'>
                    <img src={cityImg} alt="" className='categorie-img' />
                    <div className='cities'>
                        <button className='city-btn' onClick={() => navigate('/Milano')}>Milano</button>
                        <button className='city-btn' onClick={() => navigate('/Torino')}>Torino</button>
                        <button className='city-btn' onClick={() => navigate('/Genova')}>Genova</button>
                        <button className='city-btn' onClick={() => navigate('/Roma')}>Roma</button>
                        <button className='city-btn' onClick={() => navigate('/Napoli')}>Napoli</button>
                        <button className='city-btn' onClick={() => navigate('/Palermo')}>Palermo</button>
                        <button className='city-btn' onClick={() => navigate('/Firenze')}>Firenze</button>
                        <button className='city-btn' onClick={() => navigate('/Bologna')}>Bologna</button>
                    </div>
                </div>
            </div>
        </div>
    )
}