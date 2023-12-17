import React, { useState } from 'react'
import dailySavings from '../img/daily-saving.svg'
import cashback from '../img/cashback.svg'
import tech from '../img/tech.svg'

export default function LavoraConNoi({ signup, error }) {

    const [details, setDetails] = useState({ type: "", name: "", city: "", address: "", email: "", password: "" })

    function handleSubmit() {
        signup(details)
    }

    return (
        <div className='lavora-container'>
            <div className='bg_lavora'>
                <div className="form-container">
                    <h2>Inizia subito</h2>
                    <label>Tipo di attività</label>
                    <select name="attivita" onChange={(e) => setDetails({ ...details, type: e.target.value })} required>
                        <option value="">--Seleziona una categoria--</option>
                        <option value="store">Negozio</option>
                        <option value="restaurant">Ristorante</option>
                    </select>

                    <label>Nome del locale</label>
                    <input type="text" onChange={(e) => setDetails({ ...details, name: e.target.value })} required />

                    <label>Città</label>
                    <input type="text" onChange={(e) => setDetails({ ...details, city: e.target.value })} required />

                    <label>Indirizzo del locale</label>
                    <input type="text" onChange={(e) => setDetails({ ...details, address: e.target.value })} required />

                    <label>Email</label>
                    <input type="email" onChange={(e) => setDetails({ ...details, email: e.target.value })} required />

                    <label>Password</label>
                    <input type="password" onChange={(e) => setDetails({ ...details, password: e.target.value })} required />

                    <button type="submit" onClick={handleSubmit}>Invia</button>
                    {error && <div className='error'>{error}</div>}
                </div>
            </div>
            <div className='infos'>
                <h3>Aumenta le tue vendite diventando partner del più grande servizio online di ordini a domicilio d'Italia</h3>
                <p>Metti il tuo attività a disposizione di migliaia di nuovi clienti entrando nel gruppo Just Eat. Appena affiliato avrai più ordini, le tecnologie più recenti, pubblicità e un servizio clienti dedicato.</p>
                <div className='three-columns'>
                    <div className='info'>
                        <img src={dailySavings} alt="risparmi giornalieri" />
                        <h4>Risparmi giornalieri</h4>
                        <p>Grazie alle offerte esclusive sui prodotti per le consegne riservate ai ristoranti partner</p>
                    </div>
                    <div className='info'>
                        <img src={cashback} alt="risparmi pubblicità" />
                        <h4>Risparmia i soldi della pubblicità</h4>
                        <p>Dalle affissioni agli spot in tv, Just Eat pubblicizza per te il tuo ristorante.</p>
                    </div>
                    <div className='info'>
                        <img src={tech} alt="tecnologia innovativa" />
                        <h4>Tecnologia Innovativa</h4>
                        <p>Migliora i tuoi ordini e l'esperienza dei clienti grazie alle più recenti tecnologie.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
