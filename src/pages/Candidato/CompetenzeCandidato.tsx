import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./CompetenzeCandidato.css";

const CompetenzeCandidato = () => {
    const [competenze, setCompetenze] = useState<any[]>([]);
    const [form, setForm] = useState({ Nome: "", Categoria: "", Livello: "" });
    const [candidato, setCandidato] = useState<any>(null);

    // Nuovi stati per editing
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingForm, setEditingForm] = useState({ Nome: "", Categoria: "", Livello: "" });

    const jwt = localStorage.getItem("jwt");
    const documentId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchDatiCandidato = async () => {
            try {
                const res = await fetch(
                    //`https://lovable-horses-1f1c111d86.strapiapp.com/api/users/${documentId}?populate[candidato][populate]=competenzas`,
                    `http://localhost:1338/api/users/${documentId}?populate[candidato][populate]=competenzas`,
                    {
                        headers: { Authorization: `Bearer ${jwt}` },
                    }
                );
                const data = await res.json();
                const candidatoData = data?.candidato;
                setCandidato(candidatoData);
                setCompetenze(
                    candidatoData?.competenzas?.filter((c: any) => c?.id && c?.Nome) || []
                );
            } catch (error) {
                console.error("Errore nel recupero del candidato:", error);
            }
        };

        fetchDatiCandidato();
    }, [jwt, documentId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!candidato?.id) return;

        try {
            const res = await fetch(
                //`https://lovable-horses-1f1c111d86.strapiapp.com/api/competenzas`,
                `http://localhost:1338/api/competenzas`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwt}`,
                    },
                    body: JSON.stringify({
                        data: {
                            ...form,
                            candidato: candidato.id,
                        },
                    }),
                }
            );

            if (res.ok) {
                const nuovo = await res.json();
                setCompetenze((prev) => [...prev, nuovo.data]);
                setForm({ Nome: "", Categoria: "", Livello: "" });
            } else {
                console.error("Errore inserimento:", await res.text());
            }
        } catch (err) {
            console.error("Errore:", err);
        }
    };

    // Funzione per iniziare modifica
    const startEditing = (comp: any) => {
        setEditingId(comp.id);
        setEditingForm({
            Nome: comp.Nome,
            Categoria: comp.Categoria,
            Livello: comp.Livello,
        });
    };

    // Gestione cambiamenti nel form di modifica
    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditingForm((prev) => ({ ...prev, [name]: value }));
    };

    // Salvataggio modifica
    const saveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingId || isNaN(editingId)) {
            console.error("ID di modifica non valido:", editingId);
            return;
        }

        try {
            const res = await fetch(
                //`https://lovable-horses-1f1c111d86.strapiapp.com/api/competenzas/${editingId}?publicationState=preview`,
                `http://localhost:1338/api/competenzas/${editingId}?publicationState=preview`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwt}`,
                    },
                    body: JSON.stringify({
                        data: {
                            Nome: editingForm.Nome,
                            Categoria: editingForm.Categoria,
                            Livello: editingForm.Livello,
                        },
                    }),
                }
            );
            console.log(res);

            if (res.ok) {
                const updated = await res.json();
                setCompetenze((prev) =>
                    prev.map((c) => (c.id === editingId ? updated.data : c))
                );
                setEditingId(null);
                setEditingForm({ Nome: "", Categoria: "", Livello: "" });
            } else {
                console.error("Errore aggiornamento:", await res.text());
            }
        } catch (err) {
            console.error("Errore:", err);
        }
        console.log("Aggiorno ID:", editingId);
        //console.log("URL:", `https://lovable-horses-1f1c111d86.strapiapp.com/api/competenzas/${editingId}`);
        console.log("URL:", `http://localhost:1338/api/competenzas/${editingId}`);
    };

    //Funzione per eliminare una competenza
    const handleDelete = async (competenzaId: number) => {
        if (!jwt) return;

        try {
            const deleteRes = await fetch(
                //`https://lovable-horses-1f1c111d86.strapiapp.com/api/competenzas/${competenzaId}`,
                `http://localhost:1338/api/competenzas/${competenzaId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            );

            if (!deleteRes.ok) {
                console.error("Errore durante la DELETE:", await deleteRes.text());
                return;
            }

            setCompetenze((prev) => prev.filter((c) => c.id !== competenzaId));
            console.log(`Competenza ${competenzaId} eliminata correttamente.`);

        } catch (error) {
            console.error("Errore durante la cancellazione:", error);
        }
    };


    return (
        <div className="admin-dashboard">
      <aside className="sidebar">
        <h2 className="logo">BugBusters</h2>
        <nav className="nav">
          <ul>
            <li><Link className="no-style-link" to="/dashboard-candidato">Dashboard</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/profilo-candidato">Profilo</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/competenze-candidato">Competenze</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/preferenze">Attitudini e Preferenze</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/offerte-suggerite">Offerte di Lavoro</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/colloqui">Colloqui</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/feedback">Feedback Ricevuti</Link></li>
            <li><Link className="no-style-link" to="/dashboard-candidato/materiale-formativo">Materiali Formativi</Link></li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <div className="competenze-container">
            <h2>Competenze</h2>
            <form className="competenza-form" onSubmit={handleSubmit}>
                <input
                    name="Nome"
                    value={form.Nome}
                    onChange={handleChange}
                    placeholder="Nome"
                    required
                />
                <input
                    name="Categoria"
                    value={form.Categoria}
                    onChange={handleChange}
                    placeholder="Categoria"
                    required
                />
                <select name="Livello" value={form.Livello} onChange={handleChange} required>
                    <option value="">Livello</option>
                    <option value="Base">Base</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Esperto">Esperto</option>
                </select>
                <button type="submit">Aggiungi</button>
            </form>

            <ul className="competenza-list">
                {competenze.length === 0 ? (
                    <li className="competenza-item">Nessuna competenza inserita.</li>
                ) : (
                    competenze.map((c) => (
                        <li key={c.id} className="competenza-item">
                            {editingId === c.id ? (
                                <form onSubmit={saveEdit} style={{ display: "inline" }}>
                                    <input
                                        name="Nome"
                                        value={editingForm.Nome}
                                        onChange={handleEditChange}
                                        required
                                    />
                                    <input
                                        name="Categoria"
                                        value={editingForm.Categoria}
                                        onChange={handleEditChange}
                                        required
                                    />
                                    <select
                                        name="Livello"
                                        value={editingForm.Livello}
                                        onChange={handleEditChange}
                                        required
                                    >
                                        <option value="">Livello</option>
                                        <option value="Base">Base</option>
                                        <option value="Intermedio">Intermedio</option>
                                        <option value="Esperto">Esperto</option>
                                    </select>
                                    <button type="submit">Salva</button>
                                    <button type="button" onClick={() => setEditingId(null)}>
                                        Annulla
                                    </button>

                                </form>
                            ) : (
                                <>
                                    <span>
                                        {c.Nome} - {c.Categoria} ({c.Livello})
                                    </span>
                                    <button onClick={() => startEditing(c)}>Modifica</button>
                                    <button onClick={() => handleDelete(c.id)}>Elimina</button>
                                </>
                            )}
                        </li>
                    ))
                )}
            </ul>
        </div>
        </main>
        </div>
    );
};

export default CompetenzeCandidato;