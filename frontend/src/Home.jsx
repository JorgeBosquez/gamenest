import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const [juegos, setJuegos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [genero, setGenero] = useState("Todos");
  const [precio, setPrecio] = useState("Todos");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch("http://localhost:3000/api/games")
      .then((res) => res.json())
      .then((data) => setJuegos(data))
      .catch((err) => console.error("Error al cargar juegos:", err));
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const generos = ["Todos", ...new Set(juegos.map((juego) => juego.genero))];

  const juegosFiltrados = juegos.filter((juego) => {
    const coincideBusqueda = juego.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());

    const coincideGenero = genero === "Todos" || juego.genero === genero;

    const coincidePrecio =
      precio === "Todos" ||
      (precio === "Gratis" && juego.precio === 0) ||
      (precio === "Menos de $30" && juego.precio > 0 && juego.precio < 30) ||
      (precio === "$30 - $60" && juego.precio >= 30 && juego.precio <= 60) ||
      (precio === "Más de $60" && juego.precio > 60);

    return coincideBusqueda && coincideGenero && coincidePrecio;
  });

  return (
    <main className="library-page">
      <aside className="sidebar">
        <h2>GameNest</h2>

        <div className="sidebar-section">
          <h3>Favoritos</h3>
          <p onClick={() => setGenero("Acción RPG")}>Acción RPG</p>
          <p onClick={() => setGenero("Shooter")}>Shooter</p>
          <p onClick={() => setGenero("Aventura")}>Aventura</p>
        </div>

        <div className="sidebar-section">
          <h3>Géneros</h3>
          {generos
            .filter((g) => g !== "Todos")
            .map((g) => (
              <p key={g} onClick={() => setGenero(g)}>
                {g}
              </p>
            ))}
        </div>

        <div className="sidebar-section">
          <h3>Estado</h3>
          <p onClick={() => setPrecio("Todos")}>Disponibles</p>
          <p onClick={() => setPrecio("Gratis")}>Gratis</p>
          <p onClick={() => setPrecio("Más de $60")}>Premium</p>
        </div>
      </aside>

      <section className="library-content">
        <header className="topbar">
          <nav>
            <span className="active">STORE</span>
            <span>LIBRARY</span>
            <span>COMMUNITY</span>
          </nav>

          <div className="user-box">
            <span>{user?.nombre || "Gamer"}</span>
            <button onClick={logout}>Salir</button>
          </div>
        </header>

        <section className="library-header">
          <div>
            <h1>Biblioteca de videojuegos</h1>
            <p>
              Mostrando {juegosFiltrados.length} de {juegos.length} videojuegos
            </p>
          </div>

          <div className="filters">
            <input
              type="text"
              placeholder="Buscar videojuego..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />

            <select value={genero} onChange={(e) => setGenero(e.target.value)}>
              {generos.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>

            <select value={precio} onChange={(e) => setPrecio(e.target.value)}>
              <option value="Todos">Todos los precios</option>
              <option value="Gratis">Gratis</option>
              <option value="Menos de $30">Menos de $30</option>
              <option value="$30 - $60">$30 - $60</option>
              <option value="Más de $60">Más de $60</option>
            </select>
          </div>
        </section>

        <section className="games-library-grid">
          {juegosFiltrados.length > 0 ? (
            juegosFiltrados.map((juego) => (
              <article className="library-game-card" key={juego.id}>
                <img src={juego.imagen} alt={juego.nombre} loading="lazy" />

                <div className="game-overlay">
                  <h3>{juego.nombre}</h3>
                  <p>{juego.genero}</p>
                  <strong>
                    {juego.precio === 0 ? "Gratis" : `$${juego.precio}`}
                  </strong>
                </div>
              </article>
            ))
          ) : (
            <p className="no-results">
              No se encontraron videojuegos con esos filtros.
            </p>
          )}
        </section>
      </section>
    </main>
  );
}

export default Home;