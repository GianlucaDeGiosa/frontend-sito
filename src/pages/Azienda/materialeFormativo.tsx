import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './materialeFormativo.css';

const MaterialeFormativo = () => {
    const [titolo, setTitolo] = useState('');
    const [descrizione, setDescrizione] = useState('');
    const [pubblico, setPubblico] = useState(true);
    const [file, setFile] = useState<File | null>(null);
    const [caricamento, setCaricamento] = useState(false);
    const [messaggio, setMessaggio] = useState('');
    const [materiali, setMateriali] = useState<any[]>([]);
    const [loadingMateriali, setLoadingMateriali] = useState(true);
    const [userData, setUserData] = useState<any>(null);

    const jwt = localStorage.getItem("jwt");
    const aziendaId = localStorage.getItem("aziendaId");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const fetchUserData = React.useCallback(async () => {
        if (!jwt) return;
        try {
            // const res = await fetch(`https://lovable-horses-1f1c111d86.strapiapp.com/api/users/me?populate=azienda`, {
            const res = await fetch(`http://localhost:1338/api/users/me?populate=azienda`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            const data = await res.json();
            setUserData(data);
        } catch (err) {
            console.error("Errore nel recupero user data:", err);
        }
    }, [jwt]);

    const fetchMateriali = React.useCallback(async () => {
        if (!aziendaId) return;
        try {
            const res = await fetch(
                // `https://lovable-horses-1f1c111d86.strapiapp.com/api/materiale-formativos?filters[azienda][documentId][$eq]=${aziendaId}&populate=*`,
                `http://localhost:1338/api/materiale-formativos?filters[azienda][documentId][$eq]=${aziendaId}&populate=*`,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            );
            const data = await res.json();
            setMateriali(data.data);
        } catch (error) {
            console.error("Errore nel recupero dei materiali:", error);
        } finally {
            setLoadingMateriali(false);
        }
    }, [jwt, aziendaId]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!titolo || !aziendaId || !jwt) {
            setMessaggio("Compila tutti i campi obbligatori.");
            return;
        }

        setCaricamento(true);
        setMessaggio('');

        try {
            let fileId: number | null = null;

            if (file) {
                const fileData = new FormData();
                fileData.append('files', file);

                //const uploadRes = await fetch("https://lovable-horses-1f1c111d86.strapiapp.com/api/upload", {
                const uploadRes = await fetch("http://localhost:1338/api/upload", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                    body: fileData,
                });

                const uploadResult = await uploadRes.json();
                fileId = uploadResult[0]?.id;
            }

            const res = await fetch(/*"https://lovable-horses-1f1c111d86.strapiapp.com/api/materiale-formativos"*/"http://localhost:1338/api/materiale-formativos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
                body: JSON.stringify({
                    data: {
                        Titolo: titolo,
                        Descrizione: descrizione,
                        Pubblico: pubblico,
                        azienda: aziendaId,
                        File: fileId ? [fileId] : [],
                    },
                }),
            });

            if (res.ok) {
                setMessaggio("Materiale caricato con successo.");
                setTitolo('');
                setDescrizione('');
                setFile(null);
                await fetchMateriali(); // Refresh materiali
            } else {
                const errorData = await res.json();
                console.error("Errore salvataggio:", errorData);
                setMessaggio("Errore durante il salvataggio del materiale.");
            }
        } catch (error) {
            console.error("Errore generale:", error);
            setMessaggio("Errore durante l'invio.");
        } finally {
            setCaricamento(false);
        }
    };

    // Funzione per eliminare materiale da Strapi e aggiornare la UI
    const handleDelete = async (id: number) => {
        if (!jwt) return;

        if (!window.confirm("Sei sicuro di voler eliminare questo materiale?")) return;

        try {
            setCaricamento(true);
            const res = await fetch(/*`https://lovable-horses-1f1c111d86.strapiapp.com/api/materiale-formativos/${id}`*/`http://localhost:1338/api/materiale-formativos/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });

            if (res.ok) {
                setMessaggio("Materiale eliminato con successo.");
                setMateriali((prev) => prev.filter((mat) => mat.id !== id));
            } else {
                const errorData = await res.json();
                console.error("Errore eliminazione:", errorData);
                setMessaggio("Errore durante l'eliminazione del materiale.");
            }
        } catch (error) {
            console.error("Errore generale:", error);
            setMessaggio("Errore durante l'eliminazione.");
        } finally {
            setCaricamento(false);
        }
    };

    useEffect(() => {
        fetchUserData();
        fetchMateriali();
    }, [fetchUserData, fetchMateriali]);

    return (
        <div className="materiale-formativo">
            <aside className="sidebar">
        <h2 className="logo" style={{ margin: 0 }}>{userData?.azienda?.NomeAzienda || "Utente"}</h2>
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
                <div className="materiale-form">
                    <h1>Carica Materiale Formativo</h1>
                    {messaggio && <div className="mb-4 text-sm text-blue-600">{messaggio}</div>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block font-medium">Titolo *</label>
                            <input
                                type="text"
                                value={titolo}
                                onChange={(e) => setTitolo(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block font-medium">Descrizione</label>
                            <textarea
                                value={descrizione}
                                onChange={(e) => setDescrizione(e.target.value)}
                            ></textarea>
                        </div>
                        <div>
                            <label className="block font-medium">File</label>
                            <input type="file" onChange={handleFileChange} />
                        </div>
                        <div>
                            <label className="inline-flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={pubblico}
                                    onChange={(e) => setPubblico(e.target.checked)}
                                />
                                <span>Visibile pubblicamente</span>
                            </label>
                        </div>
                        <button type="submit" disabled={caricamento}>
                            {caricamento ? "Caricamento..." : "Salva Materiale"}
                        </button>
                    </form>

                    <h2 className="mt-8 text-xl font-semibold">Materiali Inseriti</h2>
                    <div className="materiali-lista">
                        {loadingMateriali ? (
                            <p>Caricamento materiali...</p>
                        ) : materiali.length === 0 ? (
                            <p>Nessun materiale inserito finora.</p>
                        ) : (
                            materiali.map((mat) => {
                                const file = mat.File?.[0];
                                const fileUrl = file?.url;

                                return (
                                    <div key={mat.id} className="materiale-card">
                                        <button
                                            onClick={() => handleDelete(mat.id)}
                                            disabled={caricamento}
                                            style={{
                                                backgroundColor: 'red',
                                                color: 'white',
                                                border: 'none',
                                                padding: '5px 10px',
                                                cursor: 'pointer',
                                                marginBottom: '10px',
                                            }}
                                            aria-label={`Elimina materiale ${mat.Titolo || 'senza titolo'}`}
                                        >
                                            Elimina
                                        </button>

                                        <h3>{mat.Titolo || 'Senza titolo'}</h3>
                                        <p>{mat.Descrizione || 'Nessuna descrizione'}</p>

                                        {fileUrl && (
                                            <a
                                                href={fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Scarica file
                                            </a>
                                        )}

                                        <div className="text-sm">
                                            <strong>Pubblico:</strong> {mat.Pubblico ? 'Sì 🌍' : 'No 🔒'}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MaterialeFormativo;
