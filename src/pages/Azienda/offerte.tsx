// src/components/OfferteAzienda.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./offerte.css";

interface OffertaLavoro {
    id: number;
    attributes: {
        Titolo: string;
        Descrizione: string;
        TipoContratto: string;
        Sede: string;
        EsperienzaRichiesta: string;
        Benefit: { benefit: string }[];
        Requisito: { requisito: string }[];
        createdAt: string;
    };
}

const OfferteAzienda: React.FC = () => {
    const [azienda, setAzienda] = useState<any>(null);
    const [offerte, setOfferte] = useState<OffertaLavoro[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    // singoli campi
    const [titolo, setTitolo] = useState("");
    const [descrizione, setDescrizione] = useState("");
    const [tipoContratto, setTipoContratto] = useState("Determinato");
    const [sede, setSede] = useState("");
    const [esperienza, setEsperienza] = useState("Junio");
    const [benefit, setBenefit] = useState<string[]>([""]);
    const [requisiti, setRequisiti] = useState<string[]>([""]);

    const [aziendaId, setAziendaId] = useState<number | null>(null);
    const jwt = localStorage.getItem("jwt");
    const userId = localStorage.getItem("userId");

    // 1) fetch aziendaId e offerte
    useEffect(() => {
        const fetchAzienda = async () => {
            try {
                const res = await fetch(
                    `https://lovable-horses-1f1c111d86.strapiapp.com/api/users/${userId}?populate=azienda`,
                    {
                        headers: {
                            Authorization: `Bearer ${jwt}`,
                        },
                    }
                );
                const data = await res.json();
                setAzienda(data);
                setLoading(false);
            } catch (err) {
                console.error("Errore caricamento dati utente:", err);
            }
        };

        fetchAzienda();

        async function init() {
            // prendi aziendaId dal user
            const resUser = await fetch(
                `https://lovable-horses-1f1c111d86.strapiapp.com/api/users/${userId}?populate=azienda`,
                { headers: { Authorization: `Bearer ${jwt}` } }
            );
            const userJson = await resUser.json();
            const aziendaData = userJson.azienda;

            if (!aziendaData) {
                console.error("Azienda non trovata:", userJson);
                return;
            }

            setAziendaId(aziendaData.id);

            // carica offerte
            const res = await fetch(
                `https://lovable-horses-1f1c111d86.strapiapp.com/api/offerta-lavoros?populate=*&filters[azienda][id][$eq]=${aziendaData.id}`,
                { headers: { Authorization: `Bearer ${jwt}` } }
            );
            const offJson = await res.json();
            setOfferte(offJson.data || []);
            setLoading(false);
        }
        init();
    }, [userId, jwt]);

    // 2) handler cambi singoli
    const handleTitoloChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setTitolo(e.target.value);
    const handleDescrizioneChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
        setDescrizione(e.target.value);
    const handleTipoContrattoChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
        setTipoContratto(e.target.value);
    const handleSedeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setSede(e.target.value);
    const handleEsperienzaChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
        setEsperienza(e.target.value);

    // benefit & requisiti
    const handleBenefitChange = (idx: number, v: string) => {
        const arr = [...benefit];
        arr[idx] = v;
        setBenefit(arr);
    };
    const addBenefit = () => setBenefit((b) => [...b, ""]);
    const removeBenefit = (idx: number) =>
        setBenefit((b) => b.filter((_, i) => i !== idx));

    const handleRequisitiChange = (idx: number, v: string) => {
        const arr = [...requisiti];
        arr[idx] = v;
        setRequisiti(arr);
    };
    const addRequisito = () => setRequisiti((r) => [...r, ""]);
    const removeRequisito = (idx: number) =>
        setRequisiti((r) => r.filter((_, i) => i !== idx));

    // 3) entra in modifica
    const handleEdit = (off: OffertaLavoro) => {
        setEditingId(off.id);
        setTitolo(off.attributes.Titolo);
        setDescrizione(off.attributes.Descrizione);
        setTipoContratto(off.attributes.TipoContratto);
        setSede(off.attributes.Sede);
        setEsperienza(off.attributes.EsperienzaRichiesta);
        setBenefit(off.attributes.Benefit.map((b) => b.benefit));
        setRequisiti(off.attributes.Requisito.map((r) => r.requisito));
        setShowForm(true);
    };

    const resetForm = () => {
        setEditingId(null);
        setTitolo("");
        setDescrizione("");
        setTipoContratto("Determinato");
        setSede("");
        setEsperienza("Junior");
        setBenefit([""]);
        setRequisiti([""]);
        setShowForm(false);
    };

    // 4) Salva tutta l'offerta
    const handleSalvaOfferta = async () => {
        if (!aziendaId) return;
        const payload = {
            data: {
                Titolo: titolo,
                Descrizione: descrizione,
                TipoContratto: tipoContratto,
                Sede: sede,
                EsperienzaRichiesta: esperienza,
                Benefit: benefit.filter((b) => b.trim()).map((b) => ({ benefit: b.trim() })),
                Requisito: requisiti.filter((r) => r.trim()).map((r) => ({ requisito: r.trim() })),
                azienda: aziendaId,
            },
        };

        const url = editingId
            ? `https://lovable-horses-1f1c111d86.strapiapp.com/api/offerta-lavoros/${editingId}`
            : `https://lovable-horses-1f1c111d86.strapiapp.com/api/offerta-lavoros`;

        const res = await fetch(url, {
            method: editingId ? "PUT" : "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            console.error("Strapi:", await res.text());
            return;
        }
        // dopo POST, l'ID nuovo è in ref.data.id
        await fetch(
            `https://lovable-horses-1f1c111d86.strapiapp.com/api/offerta-lavoros?populate=*&filters[azienda][id][$eq]=${aziendaId}`,
            { headers: { Authorization: `Bearer ${jwt}` } }
        )
            .then((r) => r.json())
            .then((j) => setOfferte(j.data || []));

        resetForm();
    };

    // 5) Elimina
    const handleDelete = async (id: number) => {
        if (!window.confirm("Eliminare questa offerta?")) return;
        await fetch(
            `https://lovable-horses-1f1c111d86.strapiapp.com/api/offerta-lavoros/${id}`,
            { method: "DELETE", headers: { Authorization: `Bearer ${jwt}` } }
        );
        setOfferte((o) => o.filter((x) => x.id !== id));
    };

    if (loading) return <div>Caricamento…</div>;

    return (
        <div className="admin-profilo">
            <aside className="sidebar">
                <h2 className="logo">{azienda?.data?.attributes?.azienda?.data?.attributes?.NomeAzienda || "Utente"}</h2>
                <div style={{ display: "flex", gap: "1rem", padding: "1rem 2rem" }}>
                    <Link to="/dashboard-azienda" className="no-style-link">Azienda</Link><span>|</span>
                    <Link to="/dashboard-recruiter" className="no-style-link">Recruiter</Link>
                </div>
            </aside>

            <main className="profilo-azienda">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                    <h2>Le tue offerte</h2>
                    <button className="primary-button" onClick={() => (showForm ? resetForm() : setShowForm(true))}>
                        {showForm ? "Annulla" : editingId ? "Modifica Offerta" : "Nuova Offerta"}
                    </button>
                </div>

                {showForm && (
                    <div className="dashboard-azienda-section">
                        <h3>{editingId ? "Modifica Offerta" : "Nuova Offerta"}</h3>
                        <div className="profilo-dettaglio">
                            <strong>Titolo:</strong><br />
                            <input value={titolo} onChange={handleTitoloChange} />
                        </div>
                        <div className="profilo-dettaglio">
                            <strong>Descrizione:</strong><br />
                            <textarea value={descrizione} onChange={handleDescrizioneChange} />
                        </div>
                        <div className="profilo-dettaglio">
                            <strong>Tipo Contratto:</strong><br />
                            <select value={tipoContratto} onChange={handleTipoContrattoChange}>
                                <option>Determinato</option><option>Indeterminato</option><option>Apprendistato</option><option>In stage</option><option>Part-Time</option>
                            </select>
                        </div>
                        <div className="profilo-dettaglio">
                            <strong>Sede:</strong><br />
                            <input value={sede} onChange={handleSedeChange} />
                        </div>
                        <div className="profilo-dettaglio">
                            <strong>Esperienza Richiesta:</strong><br />
                            <select value={esperienza} onChange={handleEsperienzaChange}>
                                <option>Junio</option><option>Mid</option><option>Senior</option>
                            </select>
                        </div>

                        <fieldset>
                            <legend>Benefit</legend>
                            {benefit.map((b, i) => (
                                <div key={i} style={{ display: "flex", gap: ".5rem" }}>
                                    <input value={b} onChange={e => handleBenefitChange(i, e.target.value)} placeholder="Es: Buoni pasto" />
                                    <button type="button" onClick={() => removeBenefit(i)}>–</button>
                                </div>
                            ))}
                            <button type="button" onClick={addBenefit}>+ Aggiungi Benefit</button>
                        </fieldset>

                        <fieldset>
                            <legend>Requisiti</legend>
                            {requisiti.map((r, i) => (
                                <div key={i} style={{ display: "flex", gap: ".5rem" }}>
                                    <input value={r} onChange={e => handleRequisitiChange(i, e.target.value)} placeholder="Es: Laurea" />
                                    <button type="button" onClick={() => removeRequisito(i)}>–</button>
                                </div>
                            ))}
                            <button type="button" onClick={addRequisito}>+ Aggiungi Requisito</button>
                        </fieldset>

                        <button className="salva-btn" onClick={handleSalvaOfferta}>
                            Salva Offerta
                        </button>
                    </div>
                )}

                <div className="card-grid">
                    {offerte.map((off) => (
                        <div key={off.id} className="card">
                            <h3>{off.attributes.Titolo}</h3>
                            <p>{off.attributes.Descrizione}</p>
                            <p><strong>Tipo:</strong> {off.attributes.TipoContratto}</p>
                            <p><strong>Sede:</strong> {off.attributes.Sede}</p>
                            <p><strong>Esp:</strong> {off.attributes.EsperienzaRichiesta}</p>
                            <p><strong>Benefit:</strong> {off.attributes.Benefit.map(b => b.benefit).join(", ")}</p>
                            <p><strong>Req:</strong> {off.attributes.Requisito.map(r => r.requisito).join(", ")}</p>
                            <div style={{ display: "flex", gap: ".5rem" }}>
                                <button onClick={() => handleEdit(off)}>Modifica</button>
                                <button onClick={() => handleDelete(off.id)} className="elimina-btn">Elimina</button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default OfferteAzienda;
