import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import "../styles/list.css";

function PartidaList() {
    const [partidas, setPartidas] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    const fetchPartidas = async () => {
        try {
            const response = await api.get("/partidas");
            setPartidas(Array.isArray(response.data) ? response.data : []);
            setErrorMessage("");
        } catch (error) {
            console.error("Erro ao buscar partidas:", error);
            setPartidas([]);
            setErrorMessage("Não foi possível carregar as partidas.");
        }
    };

    useEffect(() => {
        fetchPartidas();
    }, [])

    const deletePartida = async (id) => {
        const confirmDelete = window.confirm("Tem certeza que deseja excluir esta partida?");

        if(!confirmDelete) {
            return
        }

        try {
            await api.delete(`/partidas/${id}`);
            fetchPartidas();
            alert("Partida excluída com sucesso");
        } catch (error) {
            console.error("Erro ao excluir: ", error);
            alert("Erro ao excluir partida");
        }
    };

    const formatarData = (data) => {
        return new Date(data).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatarHora = (data) => {
        return new Date(data).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="container">
            <h1>Partidas do Sport Club Internacional</h1>

            {errorMessage && <p>{errorMessage}</p>}

            {partidas.length === 0 && <p>Nenhuma partida cadastrada.</p>}

            {partidas.map((partida) => (
                <div className="card partida-card" key={partida._id}>
                    <div>
                        <strong className="match-title">Internacional vs {partida.adversario}</strong>
                        <p className="match-result">
                            Placar: {partida.golsInter} x {partida.golsAdversario}
                        </p>
                        <p className="match-details">
                            📍 {partida.estadio} • 📅 {formatarData(partida.dataPartida)} às {formatarHora(partida.dataPartida)}
                        </p>
                        <p className="match-info">
                            ⭐ Melhor Jogador: <strong>{partida.melhorJogador?.nome || "N/A"}</strong>
                        </p>
                    </div>

                    <div className="actions">
                        <Link to={`/partida/edit/${partida._id}`}>
                            <button className="edit-btn">Editar</button>
                        </Link>

                        <button className="delete-btn" onClick={() => deletePartida(partida._id)}>Excluir</button>
                    </div>
                </div>
            ) ) }
        </div>
    )
}

export default PartidaList;
