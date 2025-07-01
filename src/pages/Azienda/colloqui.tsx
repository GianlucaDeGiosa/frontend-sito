// src/pages/dashboard-azienda/colloqui.tsx
import React, { useEffect, useState } from 'react';
import './colloqui.css';
import { Link } from 'react-router-dom';

interface Colloquio {
    id: number;
    candidato: string;
    data: string;
    posizione: string;
    stato: string;
}

const Colloqui: React.FC = () => {
    const [Azienda, setAzienda] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [colloqui] = useState<Colloquio[]>([]);

    const jwt = localStorage.getItem("jwt");
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchAzienda = async () => {
            try {
                //const res = await fetch(`https://lovable-horses-1f1c111d86.strapiapp.com/api/users/${userId}?populate=azienda`, {
                const res = await fetch(`http://localhost:1338/api/users/${userId}?populate=azienda`, {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
                );
                const data = await res.json();
                setAzienda(data);
                setLoading(false);
                if (!localStorage.getItem("aziendaId")) {
                    localStorage.setItem("aziendaId", data.azienda.documentId);
                }
                localStorage.setItem("ruolo", "azienda");
            } catch (err) {
                console.error("Errore caricamento dati utente:", err);
            }
        };

        fetchAzienda();
    }, [userId, jwt]);

    if (loading) return <div>Caricamento...</div>;
    if (!Azienda) return <div>Errore nel caricamento dati.</div>;

    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <h2 className="logo" style={{ margin: 0 }}>{Azienda.azienda?.NomeAzienda || "Utente"}</h2>
                <nav className="nav">
                    <ul>
                        <li><Link className="no-style-link" to="/dashboard-azienda">Dashboard</Link></li>
                        <li><Link className="no-style-link" to="/dashboard-azienda/profilo-azienda">Profilo</Link></li>
                        <li><Link className="no-style-link" to="/dashboard-azienda/materiale-formativo">Materiale Formativi Aziendali</Link></li>
                        <li><Link className="no-style-link" to="/dashboard-azienda/offerte">Gestione Posizioni</Link></li>
                        <li><Link className="no-style-link" to="/dashboard-azienda/colloqui">Colloqui</Link></li>
                        <li><Link className="no-style-link" to="/dashboard-azienda/candidature-ricevute">Candidature Ricevute</Link></li>
                    </ul>
                </nav>
            </aside>

            <main className="main-content">
                <h1>Colloqui di Lavoro</h1>
                {colloqui.length === 0 ? (
                    <p>Nessun colloquio programmato.</p>
                ) : (
                    <table className="colloqui-table">
                        <thead>
                            <tr>
                                <th>Candidato</th>
                                <th>Data</th>
                                <th>Posizione</th>
                                <th>Stato</th>
                            </tr>
                        </thead>
                        <tbody>
                            {colloqui.map(colloquio => (
                                <tr key={colloquio.id}>
                                    <td>{colloquio.candidato}</td>
                                    <td>{new Date(colloquio.data).toLocaleString()}</td>
                                    <td>{colloquio.posizione}</td>
                                    <td>{colloquio.stato}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </main>
        </div>
    );
};

export default Colloqui;
