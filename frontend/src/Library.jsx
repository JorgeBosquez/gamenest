import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Library.css";

function Library() {
  const navigate = useNavigate();

  const [juegos, setJuegos] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    cargarBiblioteca();
  }, []);

  const cargarBiblioteca = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/library/${user.id}`
      );

      const data = await response.json();

      setJuegos(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="library-owned-page">
      <header className="library-owned-header">
        <div>
          <h1>Mi Biblioteca</h1>
          <p>{juegos.length} videojuegos adquiridos</p>
        </div>

        <button onClick={() => navigate("/home")}>
          Volver al catálogo
        </button>
      </header>

      <section className="owned-grid">
        {juegos.map((juego) => (
          <article className="owned-card" key={juego.compra_id}>
            <img src={juego.imagen} alt={juego.nombre} />

            <div className="owned-info">
              <h3>{juego.nombre}</h3>

              <p>{juego.genero}</p>

              <span>
                Comprado:
                {" "}
                {new Date(juego.fecha).toLocaleDateString()}
              </span>

              <button>Jugar</button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export default Library;