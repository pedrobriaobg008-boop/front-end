import { useState } from "react";
import api from "../services/api";
import "../styles/form.css"

function UserCreate() {
    const [name, setName] = useState("");
    const [numeroCamisa, setNumeroCamisa] = useState("");
    const [posicao, setPosicao] = useState("");
    const [nacionalidade, setNacionalidade] = useState("");
    const [idade, setIdade] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await api.post("/jogadores", {
                nome: name,
                numeroCamisa: Number(numeroCamisa),
                posicao,
                nacionalidade,
                idade: Number(idade),
            })

            console.log("Resposta da API:", response.data)

            setName("");
            setNumeroCamisa("");
            setPosicao("");
            setNacionalidade("");
            setIdade("");
            alert("Jogador criado com sucesso");
        } catch (error) {
            console.error("Erro: ", error.response?.data || error.message);
            alert("Erro ao criar jogador.")
        }
    }

    return (
        <div className="create-container">
            <h2>Criar Jogador</h2>
            
            <form className="create-form" onSubmit={handleSubmit}>
                <div className="form-row">
                    <label>Nome</label>
                    <input type="text"
                    value={name}
                    onChange={(e) =>setName(e.target.value)}
                    required
                    />
                </div>

                <div className="form-row">
                    <label>Numero da Camisa</label>
                    <input type="number"
                    min="1"
                    max="99"
                    value={numeroCamisa}
                    onChange={(e) =>setNumeroCamisa(e.target.value)}
                    required
                    />
                </div>

                <div className="form-row">
                    <label>Posicao</label>
                    <input type="text"
                    value={posicao}
                    onChange={(e) =>setPosicao(e.target.value)}
                    required
                    />
                </div>

                <div className="form-row">
                    <label>Nacionalidade</label>
                    <input type="text"
                    value={nacionalidade}
                    onChange={(e) =>setNacionalidade(e.target.value)}
                    required
                    />
                </div>

                <div className="form-row">
                    <label>Idade</label>
                    <input type="number"
                    min="15"
                    value={idade}
                    onChange={(e) =>setIdade(e.target.value)}
                    required
                    />
                </div>

                <div className="form-row button-row">
                    <button type="submit">Salvar</button>
                </div>
                
            </form>
        </div>
    );
}

export default UserCreate;