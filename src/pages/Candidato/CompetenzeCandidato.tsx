// CompetenzeCandidato.tsx
import React, { useEffect, useState, useCallback } from "react";
import "./CompetenzeCandidato.css";


interface Competenza {
    id: number;
    attributes: {
        Nome: string;
        Categoria: string;
        Livello: "Base" | "Intermedio" | "Esperto";
    };
}

const CompetenzeCandidato: React.FC = () => {
    const [competenze, setCompetenze] = useState<Competenza[]>([]);
    const [form, setForm] = useState({ Nome: "", Categoria: "", Livello: "" });
    const [editingId, setEditingId] = useState<number | null>(null);
    const candidatoId = localStorage.getItem("candidatoId");

    const fetchCompetenze = useCallback(async () => {
        try {
            const res = await fetch(
                `https://lovable-horses-1f1c111d86.strapiapp.com/api/competenzas?filters[candidato][documentId][$eq]=${candidatoId}&populate=*`,
                { headers: { Authorization: `Bearer b5632dd6d92dc4e479b3ac08cc274838e51f3a615ef860826377250ca6eed93472c36c340f0a141655ac185f2fe1ba79ae5191c24202e333cd5ca1c22e5fb89bd0d401b31d7a666281b2174c0b1253388236e58d50e1b6328042c5d8a87fe55d129448d5480bff690fbd0b2123745dc4e95caef908cb5311797e70634a61b3ba` } }
            );
            const data = await res.json();
            console.log(data);
            setCompetenze(
                Array.isArray(data?.data)
                    ? data.data.filter(
                        (c: any): c is Competenza =>
                            c &&
                            typeof c == "object" &&
                            typeof c.id == "number" &&
                            typeof c.attributes == "object" &&
                            typeof c.attributes.Nome == "string" &&
                            typeof c.attributes.Categoria == "string" &&
                            ["Base", "Intermedio", "Esperto"].includes(c.attributes.Livello)
                    )
                    : []
            );
        } catch (err) {
            console.error("Errore nel recupero delle competenze:", err);
        }
    }, [candidatoId]);

    useEffect(() => {
        fetchCompetenze();
    }, [fetchCompetenze]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    console.log(candidatoId);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const body = {
            data: {
                Nome: form.Nome,
                Categoria: form.Categoria,
                Livello: form.Livello,
                candidato: {
                    connect: [{ documentId: candidatoId }]
                }
            },
        };

        const url = `https://lovable-horses-1f1c111d86.strapiapp.com/api/competenzas/`;

        const method = "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer b5632dd6d92dc4e479b3ac08cc274838e51f3a615ef860826377250ca6eed93472c36c340f0a141655ac185f2fe1ba79ae5191c24202e333cd5ca1c22e5fb89bd0d401b31d7a666281b2174c0b1253388236e58d50e1b6328042c5d8a87fe55d129448d5480bff690fbd0b2123745dc4e95caef908cb5311797e70634a61b3ba`,
                },
                body: JSON.stringify(body),
            });


            if (!res.ok) {
                const errData = await res.json();
                console.error("Errore Strapi:", errData);
                alert("Errore nella richiesta: " + JSON.stringify(errData.error.message));
                return;
            }

            setForm({ Nome: "", Categoria: "", Livello: "" });
            setEditingId(null);
            fetchCompetenze();
        } catch (err) {
            console.error("Errore nel salvataggio competenza:", err);
        }
    };

    const handleEdit = (c: Competenza) => {
        setForm({
            Nome: c.attributes.Nome,
            Categoria: c.attributes.Categoria,
            Livello: c.attributes.Livello,
        });
        setEditingId(c.id);
    };

    const handleDelete = async (id: number) => {
        try {
            await fetch(`https://lovable-horses-1f1c111d86.strapiapp.com/api/competenzas/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer b5632dd6d92dc4e479b3ac08cc274838e51f3a615ef860826377250ca6eed93472c36c340f0a141655ac185f2fe1ba79ae5191c24202e333cd5ca1c22e5fb89bd0d401b31d7a666281b2174c0b1253388236e58d50e1b6328042c5d8a87fe55d129448d5480bff690fbd0b2123745dc4e95caef908cb5311797e70634a61b3ba` },
            });
            fetchCompetenze();
        } catch (err) {
            console.error("Errore nella cancellazione competenza:", err);
        }
    };

    return (
        <div className="competenze-container">
            <h2>Le tue competenze</h2>

            <form onSubmit={handleSubmit} className="competenza-form">
                <input
                    name="Nome"
                    placeholder="Nome competenza"
                    value={form.Nome}
                    onChange={handleChange}
                    required
                />
                <input
                    name="Categoria"
                    placeholder="Categoria"
                    value={form.Categoria}
                    onChange={handleChange}
                    required
                />
                <select name="Livello" value={form.Livello} onChange={handleChange} required>
                    <option value="">Livello</option>
                    <option value="Base">Base</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Esperto">Esperto</option>
                </select>
                <button type="submit">{editingId ? "Aggiorna" : "Aggiungi"}</button>
            </form>

            <ul className="competenza-list">
                {competenze.length > 0 ? (() => {
                    const items = [];
                    for (let i = 0; i < competenze.length; i++) {
                        const c = competenze[i];
                        if (!c || !c.attributes) continue;

                        items.push(
                            <li key={c.id} className="competenza-item">
                                <strong>{c.attributes.Nome}</strong> - {c.attributes.Categoria} ({c.attributes.Livello})
                                <div className="btn-group">
                                    <button onClick={() => handleEdit(c)}>Modifica</button>
                                    <button onClick={() => handleDelete(c.id)}>Elimina</button>
                                </div>
                            </li>
                        );
                    }
                    return items;
                })() : (
                    <li className="competenza-item">Nessuna competenza inserita</li>
                )}
            </ul>


        </div>
    );
};

export default CompetenzeCandidato;

