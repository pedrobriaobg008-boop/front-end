import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import "../styles/list.css";

function UserList() {
    const [users, setUsers] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    const fetchUsers = async () => {
        try {
            const response = await api.get("/jogadores");
            setUsers(Array.isArray(response.data) ? response.data : []);
            setErrorMessage("");
        } catch (error) {
            console.error("Erro ao buscar jogadores:", error);
            setUsers([]);
            setErrorMessage("Nao foi possivel carregar os jogadores.");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [])

    const deleteUser = async (id) => {
        const confirmDelete = window.confirm("Tem certeza que deseja excluir este usuário");

        if(!confirmDelete) {
            return
        }

        try {
            await api.delete(`/jogadores/${id}`);
            fetchUsers();
            alert("Jogador excluido com sucesso");
        } catch (error) {
            console.error("Erro ao excluir: ", error);
            alert("Erro ao excluir jogador");
        }
    };

    return (
        <div className="container">
            <h1>Lista de Jogadores</h1>

            {errorMessage && <p>{errorMessage}</p>}

            {users.length === 0 && <p>Nenhum jogador cadastrado.</p>}

            {users.map((user) => (
                <div className="card" key={user._id}>
                    <div>
                        <strong>{user.nome}</strong>
                        <p>Camisa {user.numeroCamisa} • {user.posicao}</p>
                        <p>{user.nacionalidade} • {user.idade} anos</p>
                    </div>

                    <div className="actions">
                        <Link to={`/edit/${user._id}`}>
                            <button className="edit-btn" >Editar</button>
                        </Link>

                        <button className="delete-btn" onClick={() => deleteUser(user._id)}>Excluir</button>
                    </div>
                </div>
            ) ) }
        </div>
    )
}

export default UserList;