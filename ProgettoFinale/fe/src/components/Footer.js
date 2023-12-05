import React from 'react'
import { useNavigate } from "react-router-dom";

export default function Footer() {

    const navigate = useNavigate();

    return (
        <footer>
            <div className="footer">
                <div className="row">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div className="row">
                    <ul>
                        <li><span onClick={() => navigate("/")}>Home</span></li>
                        <li><span onClick={() => navigate("/LavoraConNoi")}>Lavora con noi</span></li>
                        <li><span onClick={() => navigate("/Privacy")}>Privacy Policy</span></li>
                        <li><span onClick={() => navigate("/Termini&Condizioni")}>Termini & Condizioni</span></li>
                        <li><a href="mailto:gabry.rotundo@gmail.com?subject=Feedback"><span>Feedback</span></a></li>
                    </ul>
                </div>
                <div className="row">
                    Copyright © 2023 Just Eat - All rights reserved
                </div>
            </div>
        </footer>
    )
}