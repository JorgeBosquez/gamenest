import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Favorites.css";

function Favorites() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [favoritos, setFavoritos] = useState([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    cargarFavoritos();
  }, []);

  const cargarFavoritos = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/favorites/${user.id}`
      );

      const data = await response.json();
      setFavoritos(data);
    } catch (error) {
      console.error(error);
      setMensaje("Error al cargar favoritos");
    }
  };

  const eliminarFavorito = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/favorites/remove/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMensaje(data.error || "No se pudo eliminar favorito");
        return;
      }

      setMensaje(data.message);
      cargarFavoritos();

      setTimeout(() => {
        setMensaje("");
      }, 2500);
    } catch (error) {
      console.error(error);
      setMensaje("Error al eliminar favorito");
    }
  };

  return (
    <main className="favorites-page">
      <header className="favorites-header">
        <div>
          <h1>❤️ Mis Favoritos</h1>
          <p>{favoritos.length} videojuegos guardados</p>
        </div>

        <button onClick={() => navigate("/home")}>Volver al catálogo</button>
      </header>

      {mensaje && <div className="favorites-message">{mensaje}</div>}

      {favoritos.length === 0 ? (
        <section className="favorites-empty">
          <h2>No tienes favoritos todavía</h2>
          <p>Agrega videojuegos desde el catálogo usando el botón ❤️.</p>
        </section>
      ) : (
        <section className="favorites-grid">
          {favoritos.map((juego) => (
            <article className="favorite-card" key={juego.favorito_id}>
              <img src={juego.imagen} alt={juego.nombre} />

              <div className="favorite-info">
                <h3>{juego.nombre}</h3>
                <p>{juego.genero}</p>

                <strong>
                  {juego.precio === 0 ? "Gratis" : `$${juego.precio}`}
                </strong>

                <button onClick={() => eliminarFavorito(juego.favorito_id)}>
                  Eliminar favorito
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default Favorites;