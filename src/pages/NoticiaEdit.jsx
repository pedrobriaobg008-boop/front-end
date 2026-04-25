import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/form.css"

function NoticiaEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [titulo, setTitulo] = useState("");
    const [categoria, setCategoria] = useState("");
    const [autor, setAutor] = useState("");
    const [conteudo, setConteudo] = useState("");
    const [destaque, setDestaque] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNoticia = async () => {
            try {
                const response = await api.get(`/noticias/${id}`);
                const noticia = response.data;

                if (noticia) 
                {
                    setTitulo(noticia.titulo);
                    setCategoria(noticia.categoria);
                    setAutor(noticia.autor);
                    setConteudo(noticia.conteudo);
                    setDestaque(noticia.destaque || false);
                }
            } catch (error) {
                console.error("Erro ao carregar notícia: ", error);
                alert("Erro ao carregar notícia");
            } finally {
                setLoading(false);
            }
        };
        fetchNoticia();
    }, [id])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.put(`/noticias/${id}`,
                {
                    titulo,
                    categoria,
                    autor,
                    conteudo,
                    destaque
                });

                alert("Notícia atualizada com sucesso!");
                navigate("/noticias");
        } catch (error) {
            console.error("Erro: ", error.response?.data || error.message);
            alert("Erro ao atualizar notícia: " + (error.response?.data?.mensagem || error.message));
        }
    }

    if (loading) {
        return <div className="create-container"><p>Carregando...</p></div>;
    }

    return (
        <div className="create-container">
            <h2>Editar Notícia</h2>

            <form className="create-form" onSubmit={handleSubmit}>
                <div className="form-row">
                    <label>Título:</label>
                    <input type="text"
                    value={titulo} 
                    onChange={(e) => setTitulo(e.target.value)}
                    required />
                </div>

                <div className="form-row">
                    <label>Categoria:</label>
                    <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    required
                    >
                        <option value="">Selecione uma categoria</option>
                        <option value="Notícia">Notícia</option>
                        <option value="Análise">Análise</option>
                        <option value="Entrevista">Entrevista</option>
                        <option value="Mercado">Mercado</option>
                        <option value="Outros">Outros</option>
                    </select>
                </div>

                <div className="form-row">
                    <label>Autor:</label>
                    <input type="text"
                    value={autor} 
                    onChange={(e) => setAutor(e.target.value)}
                    required />
                </div>

                <div className="form-row">
                    <label>Conteúdo:</label>
                    <textarea
                    value={conteudo} 
                    onChange={(e) => setConteudo(e.target.value)}
                    required
                    rows="6"
                    />
                </div>

                <div className="form-row checkbox-row">
                    <label>
                        <input type="checkbox"
                        checked={destaque}
                        onChange={(e) => setDestaque(e.target.checked)}
                        />
                        Marcar como destaque?
                    </label>
                </div>

                <div className="form-row button-row">
                    <button type="submit">Atualizar Notícia</button>
                </div>
            </form>
        </div>
    );
}

export default NoticiaEdit;
