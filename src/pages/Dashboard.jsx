import { useState, useEffect } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import "../styles/dashboard.css";

function Dashboard() {
    const [stats, setStats] = useState({
        totalJogadores: 0,
        totalPartidas: 0,
        totalNoticias: 0,
        vitorias: 0,
        derrotas: 0,
        empates: 0
    });
    const [noticias, setNoticias] = useState([]);
    const [partidas, setPartidas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const jogRes = await api.get("/jogadores");
            const partRes = await api.get("/partidas");
            const notRes = await api.get("/noticias");

            const jogadores = Array.isArray(jogRes.data) ? jogRes.data : [];
            const partidas = Array.isArray(partRes.data) ? partRes.data : [];
            const noticias = Array.isArray(notRes.data) ? notRes.data : [];

            let vitorias = 0;
            let derrotas = 0;
            let empates = 0;

            partidas.forEach(p => {
                if (p.golsInter > p.golsAdversario) vitorias++;
                else if (p.golsInter < p.golsAdversario) derrotas++;
                else empates++;
            });

            setStats({
                totalJogadores: jogadores.length,
                totalPartidas: partidas.length,
                totalNoticias: noticias.length,
                vitorias,
                derrotas,
                empates
            });

            const partidasOrdenadas = partidas.sort((a, b) => new Date(b.dataPartida) - new Date(a.dataPartida));
            setPartidas(partidasOrdenadas.slice(0, 5));

            const noticiasDestaque = noticias.filter(n => n.destaque);
            setNoticias(noticiasDestaque.slice(0, 5));
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatarData = (data) => {
        return new Date(data).toLocaleDateString('pt-BR');
    };

    if (loading) {
        return <div className="dashboard-container"><p>Carregando...</p></div>;
    }

    const totalPartidas = stats.vitorias + stats.derrotas + stats.empates;
    const percentualVitorias = totalPartidas > 0 ? ((stats.vitorias / totalPartidas) * 100).toFixed(1) : 0;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Painel de Controle</h1>
                <p className="subtitle">Estatísticas do Sport Club Internacional</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card jogadores">
                    <div className="stat-icon">J</div>
                    <div className="stat-content">
                        <h3>Jogadores</h3>
                        <p className="stat-number">{stats.totalJogadores}</p>
                    </div>
                </div>

                <div className="stat-card partidas">
                    <div className="stat-icon">P</div>
                    <div className="stat-content">
                        <h3>Partidas</h3>
                        <p className="stat-number">{stats.totalPartidas}</p>
                    </div>
                </div>

                <div className="stat-card noticias">
                    <div className="stat-icon">N</div>
                    <div className="stat-content">
                        <h3>Notícias</h3>
                        <p className="stat-number">{stats.totalNoticias}</p>
                    </div>
                </div>

                <div className="stat-card desempenho">
                    <div className="stat-icon">%</div>
                    <div className="stat-content">
                        <h3>Desempenho</h3>
                        <p className="stat-number">{percentualVitorias}%</p>
                    </div>
                </div>
            </div>

            <div className="performance-section">
                <h2>Desempenho em Partidas</h2>
                <div className="performance-chart">
                    {totalPartidas > 0 ? (
                        <>
                            <div className="chart-bars">
                                <div className="bar-container">
                                    <div className="bar vitoria" style={{height: `${(stats.vitorias / totalPartidas) * 100}%`}}></div>
                                    <p className="bar-label">Vitórias</p>
                                    <span className="bar-value">{stats.vitorias}</span>
                                </div>
                                <div className="bar-container">
                                    <div className="bar empate" style={{height: `${(stats.empates / totalPartidas) * 100}%`}}></div>
                                    <p className="bar-label">Empates</p>
                                    <span className="bar-value">{stats.empates}</span>
                                </div>
                                <div className="bar-container">
                                    <div className="bar derrota" style={{height: `${(stats.derrotas / totalPartidas) * 100}%`}}></div>
                                    <p className="bar-label">Derrotas</p>
                                    <span className="bar-value">{stats.derrotas}</span>
                                </div>
                            </div>
                            <div className="chart-stats">
                                <div className="stat-item">
                                    <div className="stat-number">{stats.vitorias}</div>
                                    <div className="stat-label">Vitórias</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-number">{stats.empates}</div>
                                    <div className="stat-label">Empates</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-number">{stats.derrotas}</div>
                                    <div className="stat-label">Derrotas</div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="no-data">Nenhuma partida registrada</p>
                    )}
                </div>
            </div>

            <div className="recent-section">
                <div className="section-header">
                    <h2>Partidas Recentes</h2>
                    <Link to="/partidas" className="view-all">Ver todas</Link>
                </div>
                <div className="recent-list">
                    {partidas.length > 0 ? (
                        partidas.map(p => (
                            <div key={p._id} className="recent-item">
                                <div className="recent-match">
                                    <span className="match-date">{formatarData(p.dataPartida)}</span>
                                    <strong>Internacional {p.golsInter} x {p.golsAdversario} {p.adversario}</strong>
                                    <span className={`result ${p.golsInter > p.golsAdversario ? 'vitoria' : p.golsInter < p.golsAdversario ? 'derrota' : 'empate'}`}>
                                        {p.golsInter > p.golsAdversario ? 'VITÓRIA' : p.golsInter < p.golsAdversario ? 'DERROTA' : 'EMPATE'}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-data">Nenhuma partida registrada</p>
                    )}
                </div>
            </div>

            <div className="recent-section">
                <div className="section-header">
                    <h2>Notícias em Destaque</h2>
                    <Link to="/noticias" className="view-all">Ver todas</Link>
                </div>
                <div className="recent-list">
                    {noticias.length > 0 ? (
                        noticias.map(n => (
                            <div key={n._id} className="recent-item noticia-item">
                                <div className="noticia-preview">
                                    <strong>{n.titulo}</strong>
                                    <p>{n.conteudo.substring(0, 150)}...</p>
                                    <span className="noticia-cat">{n.categoria}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-data">Nenhuma notícia em destaque</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
