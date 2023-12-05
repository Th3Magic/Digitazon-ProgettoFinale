import { useState } from 'react'

export default function Faq() {

    const faqData = [
        { id: 1, question: 'Come posso registrarmi?', answer: 'Per registrarti, vai alla pagina di registrazione e compila il modulo con le informazioni richieste.' },
        { id: 2, question: 'Come posso effettuare un ordine?', answer: "Effettuare il tuo primo ordine è molto facile. Effettua una ricerca per i negozi affiliati nella tua città. Scegli dal menù i prodotti che vuoi ordinare e concludi l'operazione confermando l'ordine dal carrello." },
        { id: 3, question: 'Quanto costa la consegna?', answer: 'Il prezzo del servizio è ottimizzato in base alla distanza. Più è breve, meno costa. ' },
        { id: 4, question: 'Che cosa posso chiedere?', answer: "Ci puoi utilizzare per acquistare qualsiasi prodotto o inviare qualsiasi cosa velocemente in città. Vuoi che andiamo in farmacia per te? Vuoi comprare un paio di scarpe? Vuoi qualcosa da mangiare? Vuoi spedire un pacchetto? Vuoi inviare un mazzo di chiavi? Qualsiasi cosa tu desideri" },
        { id: 5, question: 'Quali sono i metodi di pagamento accettati?', answer: 'Attualmente accettiamo pagamenti tramite carta di credito e PayPal.' },
        { id: 6, question: 'Non avevo ordinato questo. Come posso fare?', answer: "Che cosa è successo? Il prodotto non corrisponde alla descrizione fatta? Vorremmo saperlo per evitare situazioni di questo tipo in futuro. Scrivici e faremo il possibile per risolvere il problema. A prescindere da quanto precede, nel caso specifico degli ordini posti sulla Piattaforma attraverso il dropdown del prodotto McDonald's, il Cliente deve contattare direttamente noi." }
    ];

    const [openQuestion, setOpenQuestion] = useState(null);

    const toggleAnswer = (id) => {
        setOpenQuestion(openQuestion === id ? null : id);
    };

    return (
        <div className='main'>
            <div className="faq-container">
                {faqData.map((faq) => (
                    <div key={faq.id} className="faq-item">
                        <div className="faq-question" onClick={() => toggleAnswer(faq.id)}>
                            {faq.question}
                        </div>
                        <div className={`faq-answer ${openQuestion === faq.id ? 'open' : ''}`}>
                            {faq.answer}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
