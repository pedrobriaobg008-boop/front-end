import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import "../styles/list.css";

function NoticiaList() {
    const [noticias, setNoticias] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    const fetchNoticias = async () => {
        try {
            const response = await api.get("/noticias");
            setNoticias(Array.isArray(response.data) ? response.data : []);
            setErrorMessage("");
        } catch (error) {
            console.error("Erro ao buscar notícias:", error);
            setNoticias([]);
            setErrorMessage("Não foi possível carregar as notícias.");
        }
    };

    useEffect(() => {
        fetchNoticias();
    }, [])

    const deleteNoticia = async (id) => {
        const confirmDelete = window.confirm("Tem certeza que deseja excluir esta notícia?");

        if(!confirmDelete) {
            return
        }

        try {
            await api.delete(`/noticias/${id}`);
            fetchNoticias();
            alert("Notícia excluída com sucesso");
        } catch (error) {
            console.error("Erro ao excluir: ", error);
            alert("Erro ao excluir notícia");
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
            <h1>Notícias do Internacional</h1>

            {errorMessage && <p>{errorMessage}</p>}

            {noticias.length === 0 && <p>Nenhuma notícia cadastrada.</p>}

            {noticias.map((noticia) => (
                <div className={`card noticia-card ${noticia.destaque ? 'destaque' : ''}`} key={noticia._id}>
                    <div>
                        <div className="noticia-header">
                            {noticia.destaque && <span className="badge-destaque">⭐ DESTAQUE</span>}
                            <span className="noticia-categoria">{noticia.categoria}</span>
                        </div>
                        <strong className="noticia-titulo">{noticia.titulo}</strong>
                        <p className="noticia-conteudo">{noticia.conteudo.substring(0, 200)}...</p>
                        <p className="noticia-meta">
                            ✍️ {noticia.autor} • 📅 {formatarData(noticia.createdAt)} às {formatarHora(noticia.createdAt)}
                        </p>
                    </div>

                    <div className="actions">
                        <Link to={`/noticia/edit/${noticia._id}`}>
                            <button className="edit-btn">Editar</button>
                        </Link>

                        <button className="delete-btn" onClick={() => deleteNoticia(noticia._id)}>Excluir</button>
                    </div>
                </div>
            ) ) }
        </div>
    )
}

export default NoticiaList;
