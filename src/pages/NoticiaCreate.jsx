import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/form.css"

function NoticiaCreate() {
    const navigate = useNavigate();
    const [titulo, setTitulo] = useState("");
    const [categoria, setCategoria] = useState("");
    const [autor, setAutor] = useState("");
    const [conteudo, setConteudo] = useState("");
    const [destaque, setDestaque] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            await api.post("/noticias", {
                titulo,
                categoria,
                autor,
                conteudo,
                destaque
            })

            setTitulo("");
            setCategoria("");
            setAutor("");
            setConteudo("");
            setDestaque(false);
            alert("Notícia criada com sucesso");
            navigate("/noticias");
        } catch (error) {
            console.error("Erro: ", error.response?.data || error.message);
            alert("Erro ao criar notícia: " + (error.response?.data?.mensagem || error.message))
        }
    }

    return (
        <div className="create-container">
            <h2>Publicar Nova Notícia</h2>
            
            <form className="create-form" onSubmit={handleSubmit}>
                <div className="form-row">
                    <label>Título</label>
                    <input type="text"
                    placeholder="Título da notícia"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    required
                    />
                </div>

                <div className="form-row">
                    <label>Categoria</label>
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
                    <label>Autor</label>
                    <input type="text"
                    placeholder="Nome do autor"
                    value={autor}
                    onChange={(e) => setAutor(e.target.value)}
                    required
                    />
                </div>

                <div className="form-row">
                    <label>Conteúdo</label>
                    <textarea
                    placeholder="Escreva o conteúdo da notícia aqui..."
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
                    <button type="submit">Publicar Notícia</button>
                </div>
            </form>
        </div>
    );
}

export default NoticiaCreate;
