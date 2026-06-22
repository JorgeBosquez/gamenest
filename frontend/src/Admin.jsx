import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

const API_URL = "http://localhost:3000/api/games";

function Admin() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (!user || user.correo !== "admingamenest@gmail.com") {
            navigate("/home");
        }
    }, [navigate, user]);

    const [juegos, setJuegos] = useState([]);
    const [mensaje, setMensaje] = useState("");
    const [editandoId, setEditandoId] = useState(null);

    const [form, setForm] = useState({
        nombre: "",
        genero: "",
        precio: "",
        imagen: "",
        descripcion: "",
    });

    useEffect(() => {
        cargarJuegos();
    }, []);

    const cargarJuegos = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            setJuegos(data);
        } catch {
            setMensaje("Error al cargar videojuegos");
        }
    };

    const limpiarFormulario = () => {
        setForm({
            nombre: "",
            genero: "",
            precio: "",
            imagen: "",
            descripcion: "",
        });
        setEditandoId(null);
    };

    const validarFormulario = () => {
        if (!form.nombre.trim() || !form.genero.trim() || form.precio === "") {
            setMensaje("Nombre, género y precio son obligatorios");
            return false;
        }

        if (isNaN(form.precio) || Number(form.precio) < 0) {
            setMensaje("El precio debe ser válido y mayor o igual a 0");
            return false;
        }

        return true;
    };

    const guardarJuego = async (e) => {
        e.preventDefault();
        setMensaje("");

        if (!validarFormulario()) return;

        const metodo = editandoId ? "PUT" : "POST";
        const url = editandoId ? `${API_URL}/${editandoId}` : API_URL;

        try {
            const response = await fetch(url, {
                method: metodo,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await response.json();

            if (!response.ok) {
                setMensaje(data.error || "Error al guardar videojuego");
                return;
            }

            setMensaje(data.message);
            limpiarFormulario();
            cargarJuegos();
        } catch {
            setMensaje("No se pudo conectar con el servidor");
        }
    };

    const editarJuego = (juego) => {
        setEditandoId(juego.id);
        setForm({
            nombre: juego.nombre,
            genero: juego.genero,
            precio: juego.precio,
            imagen: juego.imagen,
            descripcion: juego.descripcion,
        });

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const eliminarJuego = async (id) => {
        const confirmar = confirm("¿Seguro que deseas eliminar este videojuego?");

        if (!confirmar) return;

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (!response.ok) {
                setMensaje(data.error || "Error al eliminar videojuego");
                return;
            }

            setMensaje(data.message);
            cargarJuegos();
        } catch {
            setMensaje("No se pudo eliminar el videojuego");
        }
    };

    return (
        <main className="admin-page">
            <header className="admin-header">
                <div>
                    <h1>Panel de Administración</h1>
                    <p>CRUD de videojuegos - GameNest</p>
                </div>

                <button onClick={() => navigate("/home")}>Volver al catálogo</button>
            </header>

            {mensaje && <div className="admin-message">{mensaje}</div>}

            <section className="admin-form-card">
                <h2>{editandoId ? "Editar videojuego" : "Crear videojuego"}</h2>

                <form onSubmit={guardarJuego} className="admin-form">
                    <input
                        type="text"
                        placeholder="Nombre del videojuego"
                        value={form.nombre}
                        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    />

                    <input
                        type="text"
                        placeholder="Género"
                        value={form.genero}
                        onChange={(e) => setForm({ ...form, genero: e.target.value })}
                    />

                    <input
                        type="number"
                        step="0.01"
                        placeholder="Precio"
                        value={form.precio}
                        onChange={(e) => setForm({ ...form, precio: e.target.value })}
                    />

                    <input
                        type="text"
                        placeholder="URL de imagen"
                        value={form.imagen}
                        onChange={(e) => setForm({ ...form, imagen: e.target.value })}
                    />
                    {form.imagen && (
                        <div className="image-preview-box">
                            <p>Vista previa</p>
                            <img src={form.imagen} alt="Vista previa del videojuego" />
                        </div>
                    )}

                    <textarea
                        placeholder="Descripción"
                        value={form.descripcion}
                        onChange={(e) =>
                            setForm({ ...form, descripcion: e.target.value })
                        }
                    />

                    <div className="admin-form-actions">
                        <button type="submit">
                            {editandoId ? "Actualizar" : "Crear"}
                        </button>

                        {editandoId && (
                            <button type="button" onClick={limpiarFormulario}>
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </section>

            <section className="admin-list">
                <h2>Videojuegos registrados</h2>

                <div className="admin-table">
                    {juegos.map((juego) => (
                        <article className="admin-game-row" key={juego.id}>
                            <img src={juego.imagen} alt={juego.nombre} />

                            <div className="admin-game-info">
                                <h3>{juego.nombre}</h3>
                                <p>{juego.genero}</p>
                                <strong>
                                    {juego.precio === 0 ? "Gratis" : `$${juego.precio}`}
                                </strong>
                            </div>

                            <div className="admin-actions">
                                <button onClick={() => editarJuego(juego)}>Editar</button>
                                <button onClick={() => eliminarJuego(juego.id)}>
                                    Eliminar
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}

export default Admin;