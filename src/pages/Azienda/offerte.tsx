// src/components/OfferteAzienda.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./offerte.css";

interface OffertaLavoro {
    id: number;
    Titolo: string;
    Descrizione: string;
    TipoContratto: string;
    Sede: string;
    EsperienzaRichiesta: string;
    Benefit: { Nome: string }[];
    Requisito: { Competenza: string; LivelloCompetenza: string }[];
}

const OfferteAzienda: React.FC = () => {
    const [azienda, setAzienda] = useState<any>(null);
    const [offerte, setOfferte] = useState<OffertaLavoro[]>([]);
    const [candidatiSuggeriti, setCandidatiSuggeriti] = useState<{ [key: number]: any[] }>({});
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    // singoli campi
    const [titolo, setTitolo] = useState("");
    const [descrizione, setDescrizione] = useState("");
    const [tipoContratto, setTipoContratto] = useState("Determinato");
    const [sede, setSede] = useState("");
    const [esperienza, setEsperienza] = useState("Junior");
    const [benefit, setBenefit] = useState<string[]>([""]);
    const [requisiti, setRequisiti] = useState<
        { Competenza: string; LivelloCompetenza: string }[]
    >([{ Competenza: "", LivelloCompetenza: "Base" }]);

    const [aziendaId, setAziendaId] = useState<string | null>(null);
    const jwt = localStorage.getItem("jwt");
    const userId = localStorage.getItem("userId");

    // 1) fetch aziendaId e offerte
    useEffect(() => {
        const fetchData = async () => {
            if (!userId || !jwt) {
                console.warn("Manca userId o jwt");
                setLoading(false);
                return;
            }

            try {
                // 1) Fetch utente
                const resUser = await fetch(
                    `http://localhost:1338/api/users/${userId}?populate=azienda`,
                    { headers: { Authorization: `Bearer ${jwt}` } }
                );
                console.log("Fetch utente, status:", resUser.status);
                if (!resUser.ok) {
                    console.error("Errore HTTP caricamento utente", resUser.status);
                    setLoading(false);
                    return;
                }
                const userJson = await resUser.json();
                console.log("userJson:", userJson);

                const aziendaData = userJson.azienda || userJson.data?.azienda;
                console.log("aziendaData:", aziendaData);

                if (!aziendaData) {
                    console.error("Azienda non trovata nel JSON:", userJson);
                    setLoading(false);
                    return;
                }
                const aziendaId = aziendaData.documentId;
                console.log("aziendaId:", aziendaId);
                setAzienda(userJson);
                setAziendaId(aziendaId);

                // 2) Fetch offerte
                const urlOff = `http://localhost:1338/api/offerta-lavoros?filters[azienda][documentId][$eq]=${aziendaId}&populate[azienda][fields][0]=NomeAzienda&populate[Benefit][fields][0]=Nome&populate[Requisito][fields][0]=*`;
                console.log("URL fetch offerte:", urlOff);
                const resOff = await fetch(urlOff, { headers: { Authorization: `Bearer ${jwt}` } });
                console.log("Fetch offerte, status:", resOff.status);
                if (!resOff.ok) {
                    console.error("Errore HTTP caricamento offerte", resOff.status);
                    setLoading(false);
                    return;
                }
                const offJson = await resOff.json();
                console.log("offJson:", offJson);
                // offJson.data è array di offerte; vedi se offJson.data.length > 0
                setOfferte(
                    offJson.data.map((item: any) => ({
                        id: item.id,
                        Titolo: item.Titolo,
                        Descrizione: item.Descrizione,
                        TipoContratto: item.TipoContratto,
                        Sede: item.Sede,
                        EsperienzaRichiesta: item.EsperienzaRichiesta,
                        Benefit: item.Benefit?.map((b: any) => ({
                            Nome: b?.Nome || ""
                        })) || [],
                        Requisito: item.Requisito?.map((r: any) => ({
                            Competenza: r.Competenza,
                            LivelloCompetenza: r.LivelloCompetenza
                        })) || [],
                    }))
                );
            } catch (err) {
                console.error("Errore in fetchData:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
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

    const handleRequisitoCompetenzaChange = (idx: number, value: string) => {
        const arr = [...requisiti];
        arr[idx].Competenza = value;
        setRequisiti(arr);
    };

    const handleRequisitoLivelloChange = (idx: number, value: string) => {
        const arr = [...requisiti];
        arr[idx].LivelloCompetenza = value;
        setRequisiti(arr);
    };

    const addRequisito = () =>
        setRequisiti((r) => [...r, { Competenza: "", LivelloCompetenza: "Base" }]);
    const removeRequisito = (idx: number) =>
        setRequisiti((r) => r.filter((_, i) => i !== idx));

    // 3) entra in modifica
    const handleEdit = (off: OffertaLavoro) => {
        setEditingId(off.id);
        setTitolo(off.Titolo);
        setDescrizione(off.Descrizione);
        setTipoContratto(off.TipoContratto);
        setSede(off.Sede);
        setEsperienza(off.EsperienzaRichiesta);
        setBenefit(off.Benefit.map((b) => b.Nome));
        setRequisiti(
            off.Requisito.map((r) => ({
                Competenza: r.Competenza || "",
                LivelloCompetenza: r.LivelloCompetenza || "Base",
            }))
        );
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
        setRequisiti([{ Competenza: "", LivelloCompetenza: "Base" }]);
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
                Benefit: benefit
                    .filter((b) => typeof b === "string" && b.trim() !== "")
                    .map((b) => ({ Nome: b.trim() })),

                Requisito: requisiti
                    .filter((r) => r.Competenza && r.Competenza.trim() !== "")
                    .map((r) => ({
                        Competenza: r.Competenza ? r.Competenza.trim() : "",
                        LivelloCompetenza: r.LivelloCompetenza,
                    })),

                azienda: aziendaId,
            },
        };

        // Cloud URL esempio
        //`https://lovable-horses-1f1c111d86.strapiapp.com/api/offerta-lavoros${editingId ? `/${editingId}` : ""}`
        const url = editingId
            ? `http://localhost:1338/api/offerta-lavoros/${editingId}`
            : `http://localhost:1338/api/offerta-lavoros`;

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
        // Cloud URL esempio
        //`https://lovable-horses-1f1c111d86.strapiapp.com/api/offerta-lavoros?populate=*&filters[azienda][id][$eq]=${aziendaId}`
        await fetch(
            `http://localhost:1338/api/offerta-lavoros?populate=*&filters[azienda][id][$eq]=${aziendaId}`,
            { headers: { Authorization: `Bearer ${jwt}` } }
        )
            .then((r) => r.json())
            .then((j) => setOfferte(j.data || []));

        resetForm();
    };

    // 5) Elimina
    const handleDelete = async (id: number) => {
        if (!window.confirm("Eliminare questa offerta?")) return;
        // Cloud URL esempio
        //`https://lovable-horses-1f1c111d86.strapiapp.com/api/offerta-lavoros/${id}`
        await fetch(`http://localhost:1338/api/offerta-lavoros/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${jwt}` },
        });
        setOfferte((o) => o.filter((x) => x.id !== id));
    };

    const fetchCandidatiSuggeriti = async (offerta: OffertaLavoro) => {
        try {
            const url = `http://localhost:1338/api/candidatoes?populate=competenzas&populate=CurriculumVitae`;
            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${jwt}` },
            });
            const data = await res.json();

            if (!Array.isArray(data.data)) return;

            const candidatiCompatibili = data.data.filter((candidato: any) => {
                const livelloEsperienza = candidato.LivelloEsperienza;
                const competenze = candidato.competenzas || [];

                const esperienzaCompatibile =
                    (offerta.EsperienzaRichiesta === "Junior" && livelloEsperienza === "Junior") ||
                    (offerta.EsperienzaRichiesta === "Mid" && livelloEsperienza === "Mid") ||
                    (offerta.EsperienzaRichiesta === "Senior" && livelloEsperienza === "Senior");

                const requisiti = offerta.Requisito || [];

                const competenzeCompatibili = requisiti.every((req) =>
                    competenze.some(
                        (comp: any) =>
                            comp.Nome?.toLowerCase() === req.Competenza?.toLowerCase() &&
                            comp.Livello === req.LivelloCompetenza
                    )
                );

                return esperienzaCompatibile && competenzeCompatibili;
            });

            setCandidatiSuggeriti((prev) => ({
                ...prev,
                [offerta.id]: candidatiCompatibili,
            }));

            setOpenMenuId((prev) => (prev === offerta.id ? null : offerta.id));
        } catch (error) {
            console.error("Errore nel caricamento candidati suggeriti:", error);
        }
    };

    if (loading) return <div>Caricamento…</div>;


    return (
        <div className="admin-profilo">
            <aside className="sidebar">
                <h2 className="logo" style={{ margin: 0 }}>
                    {azienda.azienda?.NomeAzienda || "Utente"}
                </h2>
                <nav className="nav">
                    <ul>
                        <li>
                            <Link className="no-style-link" to="/dashboard-azienda">
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link className="no-style-link" to="/dashboard-azienda/profilo-azienda">
                                Profilo
                            </Link>
                        </li>
                        <li>
                            <Link
                                className="no-style-link"
                                to="/dashboard-azienda/materiale-formativo"
                            >
                                Materiale Formativi Aziendali
                            </Link>
                        </li>
                        <li>
                            <Link className="no-style-link" to="/dashboard-azienda/offerte">
                                Gestione Posizioni
                            </Link>
                        </li>
                        <li>
                            <Link className="no-style-link" to="/dashboard-azienda/colloqui">
                                Colloqui
                            </Link>
                        </li>
                        <li><Link className="no-style-link" to="/dashboard-azienda/candidature-ricevute">Candidature Ricevute</Link></li>
                    </ul>
                </nav>
            </aside>

            <main className="profilo-azienda">
                <div
                    style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}
                >
                    <h2>Le tue posizioni</h2>
                    {!showForm && (
                        <button
                            className="primary-button"
                            onClick={() => {
                                setEditingId(null);
                                setShowForm(true);
                            }}
                        >
                            Crea nuova posizione
                        </button>
                    )}

                    {showForm && (
                        <button className="secondary-button" onClick={resetForm}>
                            Annulla
                        </button>
                    )}

                </div>

                {showForm && (
                    <div className="dashboard-azienda-section">
                        <h3>{editingId ? "Modifica posizione" : "Crea nuova posizione"}</h3>
                        <div className="profilo-dettaglio">
                            <strong>Titolo:</strong>
                            <br />
                            <input value={titolo} onChange={handleTitoloChange} />
                        </div>
                        <div className="profilo-dettaglio">
                            <strong>Descrizione:</strong>
                            <br />
                            <textarea value={descrizione} onChange={handleDescrizioneChange} />
                        </div>
                        <div className="profilo-dettaglio">
                            <strong>Tipo contratto:</strong>
                            <br />
                            <select value={tipoContratto} onChange={handleTipoContrattoChange}>
                                <option>Determinato</option>
                                <option>Indeterminato</option>
                                <option>Apprendistato</option>
                                <option>In stage</option>
                                <option>Part-Time</option>
                            </select>
                        </div>
                        <div className="profilo-dettaglio">
                            <strong>Sede:</strong>
                            <br />
                            <input value={sede} onChange={handleSedeChange} />
                        </div>
                        <div className="profilo-dettaglio">
                            <strong>Esperienza richiesta:</strong>
                            <br />
                            <select value={esperienza} onChange={handleEsperienzaChange}>
                                <option>Junior</option>
                                <option>Mid</option>
                                <option>Senior</option>
                            </select>
                        </div>

                        <fieldset>
                            <legend>Benefit</legend>
                            {benefit.map((b, i) => (
                                <div key={i} style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
                                    <input
                                        value={b}
                                        onChange={(e) => handleBenefitChange(i, e.target.value)}
                                        placeholder="Es: Buoni pasto"
                                    />
                                    <button type="button" onClick={() => removeBenefit(i)}>
                                        –
                                    </button>
                                </div>
                            ))}
                            <button type="button" onClick={addBenefit}>
                                + Aggiungi Benefit
                            </button>
                        </fieldset>

                        <fieldset>
                            <legend>Requisiti</legend>
                            {requisiti.map((r, i) => (
                                <div
                                    key={i}
                                    style={{ display: "flex", gap: ".5rem", alignItems: "center" }}
                                >
                                    <input
                                        value={r.Competenza}
                                        onChange={(e) => handleRequisitoCompetenzaChange(i, e.target.value)}
                                        placeholder="Es: JavaScript"
                                    />
                                    <select
                                        value={r.LivelloCompetenza}
                                        onChange={(e) => handleRequisitoLivelloChange(i, e.target.value)}
                                    >
                                        <option>Base</option>
                                        <option>Intermedio</option>
                                        <option>Esperto</option>
                                    </select>
                                    <button type="button" onClick={() => removeRequisito(i)}>
                                        –
                                    </button>
                                </div>
                            ))}
                            <button type="button" onClick={addRequisito}>
                                + Aggiungi Requisito
                            </button>
                        </fieldset>

                        <button className="primary-button" onClick={handleSalvaOfferta}>
                            Salva Offerta
                        </button>
                    </div>
                )}

                <section className="offerte-container">
                    {offerte.length === 0 ? (
                        <p>Nessuna offerta presente.</p>
                    ) : (
                        <div className="offerte-grid">
                            {offerte.map((off) => (
                                <div key={off.id} className="offerta-card">
                                    <h3>{off.Titolo}</h3>
                                    <p>{off.Descrizione}</p>
                                    <p><strong>Tipo contratto:</strong> {off.TipoContratto}</p>
                                    <p><strong>Sede:</strong> {off.Sede}</p>
                                    <p><strong>Esperienza:</strong> {off.EsperienzaRichiesta}</p>
                                    <p>
                                        <strong>Benefit:</strong>{" "}
                                        {off.Benefit?.map((b) => b.Nome).filter(Boolean).join(", ") || "Nessuno"}
                                    </p>
                                    <p>
                                        <strong>Requisiti:</strong>{" "}
                                        {off.Requisito?.map((r) =>
                                            `${r.Competenza} (${r.LivelloCompetenza})`
                                        ).join(", ") || "Nessuno"}
                                    </p>
                                    <div className="offerta-actions">
                                        <button className="primary-button" onClick={() => handleEdit(off)}>
                                            Modifica
                                        </button>
                                        <button className="secondary-button" onClick={() => handleDelete(off.id)}>
                                            Elimina
                                        </button>
                                        <br></br><br></br>
                                        <button
                                            className="primary-button"
                                            onClick={() => fetchCandidatiSuggeriti(off)}
                                        >
                                            {openMenuId === off.id ? "Nascondi candidati" : "Candidati suggeriti"}
                                        </button>
                                    </div>
                                    {openMenuId === off.id && (
                                        <div className="candidati-suggeriti-dropdown">
                                            {candidatiSuggeriti[off.id]?.length > 0 ? (
                                                <ul>
                                                    {candidatiSuggeriti[off.id].map((cand) => (
                                                        <li key={cand.id}>
                                                            <strong>{cand.Nome} {cand.Cognome}</strong><br />
                                                            {cand.CurriculumVitae?.length > 0 ? (
                                                                cand.CurriculumVitae.map((cv: any, idx: number) => (
                                                                    <div key={idx}>
                                                                        <a
                                                                            href={`http://localhost:1338${cv.url}`}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                        >
                                                                            Visualizza CV {idx + 1}
                                                                        </a>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <span>Nessun CV disponibile</span>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p>Nessun candidato compatibile trovato.</p>
                                            )}
                                        </div>
                                    )}

                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default OfferteAzienda;