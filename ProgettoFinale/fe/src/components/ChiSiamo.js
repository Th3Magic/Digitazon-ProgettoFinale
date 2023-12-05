import React from 'react'
import signup from '../img/signup.svg'
import pack from '../img/pack.svg'
import orders from '../img/orders.svg'

export default function ChiSiamo() {
    return (
        <div className='termini'>
            <div className='condizioni'>
                <h1>La nostra storia</h1>
                <p>Just Eat è l'app leader per ordinare online pranzo e cena a domicilio in tutta Italia e nel mondo, è presente in Italia dal 2011 e oggi opera con ristoranti partner su tutto il territorio nazionale.
                    <br />
                    <br />
                    Just Eat è accessibile da app iOS e Android e dal sito www.justeat.it, e permette di ordinare il proprio food delivery in pochi e semplici click, inserendo l’indirizzo di consegna, selezionando il ristorante preferito, e scegliendo i piatti desiderati dal menu.
                    <br />
                    Ordinare cibo a domicilio con Just Eat è un’abitudine comune che non può mancare nella quotidianità di ognuno, sia per comodità, sia per assaggiare e sperimentare nuovi sapori.
                    <br />
                    È ideale perché è adatto a tutti, in ogni situazione e occasione, e grazie alla sua facilità e velocità di utilizzo consente di sentirsi a proprio agio in ogni situazione, unendo comodità, convenienza, grazie alla presenza di sconti e offerte vantaggiose, a nuove tendenze food e alla possibilità di leggere e consultare le recensioni della community di utenti sui ristoranti partner, fino al pagamento in tre diverse modalità, contanti alla consegna, carta di credito e PayPal.
                    <br />
                    <br />
                    Nata in Danimarca nel 2001, Just Eat è oggi attiva nel mondo con milioni di clienti, supportando il business e il successo dei ristoranti partner.</p>
            </div>
            <div className='three-columns'>
                <div className='info'>
                    <img src={signup} alt="registrati" />
                    <h4>Registrati</h4>
                    <p>Inserisci i tuoi dati e comincia a vendere con facilità i tuoi prodotti</p>
                </div>
                <div className='info'>
                    <img src={pack} alt="imposta profilo" />
                    <h4>Imposta il profilo</h4>
                    <p>Carica il tuo menù o catalogo di prodotti e sarai pronto ad iniziare la tua fantastica avventura con noi</p>
                </div>
                <div className='info'>
                    <img src={orders} alt="inizia" />
                    <h4>Inizia a vendere</h4>
                    <p>Ricevi i primi ordini e concludi le prime vendite</p>
                </div>
            </div>
            <div className='info'>
                <quote><i>"Da quando sono su Just Eat il fatturato è cresciuto del 25%. Gli ordini a domicilio sono diventati sempre più importanti per il mio business."</i></quote>
                <p><i>Riccardo, Bench - Milano</i></p>
            </div>
        </div>
    );
}
