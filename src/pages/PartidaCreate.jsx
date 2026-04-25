import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/form.css"

function PartidaCreate() {
    const navigate = useNavigate();
    const [adversario, setAdversario] = useState("");
    const [estadio, setEstadio] = useState("");
    const [dataPartida, setDataPartida] = useState("");
    const [golsInter, setGolsInter] = useState("");
    const [golsAdversario, setGolsAdversario] = useState("");
    const [melhorJogador, setMelhorJogador] = useState("");
    const [jogadores, setJogadores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJogadores = async () => {
            try {
                const response = await api.get("/jogadores");
                setJogadores(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error("Erro ao buscar jogadores:", error);
                alert("Erro ao carregar jogadores");
            } finally {
                setLoading(false);
            }
        };
        fetchJogadores();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!melhorJogador) {
            alert("Selecione um melhor jogador");
            return;
        }

        try {
            await api.post("/partidas", {
                adversario,
                estadio,
                dataPartida,
                golsInter: Number(golsInter),
                golsAdversario: Number(golsAdversario),
                melhorJogador
            })

            setAdversario("");
            setEstadio("");
            setDataPartida("");
            setGolsInter("");
            setGolsAdversario("");
            setMelhorJogador("");
            alert("Partida criada com sucesso");
            navigate("/partidas");
        } catch (error) {
            console.error("Erro: ", error.response?.data || error.message);
            alert("Erro ao criar partida: " + (error.response?.data?.mensagem || error.message))
        }
    }

    if (loading) {
        return <div className="create-container"><p>Carregando jogadores...</p></div>;
    }

    return (
        <div className="create-container">
            <h2>Registrar Nova Partida</h2>
            
            <form className="create-form" onSubmit={handleSubmit}>
                <div className="form-row">
                    <label>Adversário</label>
                    <input type="text"
                    placeholder="Ex: Grêmio, Corinthians..."
                    value={adversario}
                    onChange={(e) => setAdversario(e.target.value)}
                    required
                    />
                </div>

                <div className="form-row">
                    <label>Estádio</label>
                    <input type="text"
                    placeholder="Ex: Beira-Rio"
                    value={estadio}
                    onChange={(e) => setEstadio(e.target.value)}
                    required
                    />
                </div>

                <div className="form-row">
                    <label>Data e Hora da Partida</label>
                    <input type="datetime-local"
                    value={dataPartida}
                    onChange={(e) => setDataPartida(e.target.value)}
                    required
                    />
                </div>

                <div className="form-row">
                    <label>Gols do Internacional</label>
                    <input type="number"
                    min="0"
                    value={golsInter}
                    onChange={(e) => setGolsInter(e.target.value)}
                    required
                    />
                </div>

                <div className="form-row">
                    <label>Gols do Adversário</label>
                    <input type="number"
                    min="0"
                    value={golsAdversario}
                    onChange={(e) => setGolsAdversario(e.target.value)}
                    required
                    />
                </div>

                <div className="form-row">
                    <label>Melhor Jogador da Partida</label>
                    <select
                    value={melhorJogador}
                    onChange={(e) => setMelhorJogador(e.target.value)}
                    required
                    >
                        <option value="">Selecione um jogador</option>
                        {jogadores.map((jogador) => (
                            <option key={jogador._id} value={jogador._id}>
                                {jogador.nome} (Camisa {jogador.numeroCamisa})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-row button-row">
                    <button type="submit">Salvar Partida</button>
                </div>
            </form>
        </div>
    );
}

export default PartidaCreate;
