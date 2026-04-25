import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import UserList from "./pages/UserList";
import UserCreate from "./pages/UserCreate";
import UserEdit from "./pages/UserEdit";
import PartidaList from "./pages/PartidaList";
import PartidaCreate from "./pages/PartidaCreate";
import PartidaEdit from "./pages/PartidaEdit";
import NoticiaList from "./pages/NoticiaList";
import NoticiaCreate from "./pages/NoticiaCreate";
import NoticiaEdit from "./pages/NoticiaEdit";
import "./styles/global.css";

function App() {
  return (
    <BrowserRouter>
      <nav className='navbar'>
        <Link to="/dashboard" className="navbar-brand">Sport Club Internacional</Link>
        <div className="navbar-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/">Jogadores</Link>
          <Link to="/partidas">Partidas</Link>
          <Link to="/noticias">Notícias</Link>
        </div>
        <div className="navbar-actions">
          <Link to="/create">+ Jogador</Link>
          <Link to="/partida/create">+ Partida</Link>
          <Link to="/noticia/create">+ Notícia</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<UserList/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/create" element={<UserCreate/>} />
        <Route path="/edit/:id" element={<UserEdit/>} />
        
        <Route path="/partidas" element={<PartidaList/>} />
        <Route path="/partida/create" element={<PartidaCreate/>} />
        <Route path="/partida/edit/:id" element={<PartidaEdit/>} />
        
        <Route path="/noticias" element={<NoticiaList/>} />
        <Route path="/noticia/create" element={<NoticiaCreate/>} />
        <Route path="/noticia/edit/:id" element={<NoticiaEdit/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
