import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/form.css"

function PartidaEdit() {
    const { id } = useParams();
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
        const fetchData = async () => {
            try {
                const [partidaRes, jogadoresRes] = await Promise.all([
                    api.get(`/partidas/${id}`),
                    api.get("/jogadores")
                ]);

                const partida = partidaRes.data;
                if (partida) {
                    setAdversario(partida.adversario);
                    setEstadio(partida.estadio);
                    setDataPartida(partida.dataPartida.slice(0, 16));
                    setGolsInter(String(partida.golsInter ?? ""));
                    setGolsAdversario(String(partida.golsAdversario ?? ""));
                    setMelhorJogador(partida.melhorJogador?._id || partida.melhorJogador || "");
                }

                setJogadores(Array.isArray(jogadoresRes.data) ? jogadoresRes.data : []);
            } catch (error) {
                console.error("Erro ao carregar dados: ", error);
                alert("Erro ao carregar partida");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!melhorJogador) {
            alert("Selecione um melhor jogador");
            return;
        }

        try {
            await api.put(`/partidas/${id}`,
                {
                    adversario,
                    estadio,
                    dataPartida,
                    golsInter: Number(golsInter),
                    golsAdversario: Number(golsAdversario),
                    melhorJogador
                });

                alert("Partida atualizada com sucesso!");
                navigate("/partidas");
        } catch (error) {
            console.error("Erro: ", error.response?.data || error.message);
            alert("Erro ao atualizar partida: " + (error.response?.data?.mensagem || error.message));
        }
    }

    if (loading) {
        return <div className="create-container"><p>Carregando...</p></div>;
    }

    return (
        <div className="create-container">
            <h2>Editar Partida</h2>

            <form className="create-form" onSubmit={handleSubmit}>
                <div className="form-row">
                    <label>Adversário:</label>
                    <input type="text"
                    value={adversario} 
                    onChange={(e) => setAdversario(e.target.value)}
                    required />
                </div>

                <div className="form-row">
                    <label>Estádio:</label>
                    <input type="text"
                    value={estadio} 
                    onChange={(e) => setEstadio(e.target.value)}
                    required />
                </div>

                <div className="form-row">
                    <label>Data e Hora:</label>
                    <input type="datetime-local"
                    value={dataPartida} 
                    onChange={(e) => setDataPartida(e.target.value)}
                    required />
                </div>

                <div className="form-row">
                    <label>Gols do Internacional:</label>
                    <input type="number"
                    min="0"
                    value={golsInter} 
                    onChange={(e) => setGolsInter(e.target.value)}
                    required />
                </div>

                <div className="form-row">
                    <label>Gols do Adversário:</label>
                    <input type="number"
                    min="0"
                    value={golsAdversario} 
                    onChange={(e) => setGolsAdversario(e.target.value)}
                    required />
                </div>

                <div className="form-row">
                    <label>Melhor Jogador da Partida:</label>
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
                    <button type="submit">Atualizar Partida</button>
                </div>
            </form>
        </div>
    );
}

export default PartidaEdit;
