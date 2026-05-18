import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

function Cart() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const [carrito, setCarrito] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [metodoPago, setMetodoPago] = useState("Tarjeta");
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        if (!user) {
            navigate("/");
            return;
        }

        cargarCarrito();
    }, []);

    const cargarCarrito = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/cart/${user.id}`);
            const data = await response.json();
            setCarrito(data);
        } catch (error) {
            console.error(error);
        }
    };

    const eliminarProducto = async (id) => {
        try {
            await fetch(`http://localhost:3000/api/cart/remove/${id}`, {
                method: "DELETE",
            });

            cargarCarrito();
        } catch (error) {
            console.error(error);
        }
    };

    const total = carrito.reduce(
        (acc, item) => acc + item.precio * item.cantidad,
        0
    );

    const finalizarCompra = async () => {
        if (carrito.length === 0) {
            setMensaje("Tu carrito está vacío");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/api/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    usuario_id: user.id,
                    metodo_pago: metodoPago,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setMensaje(data.error || "No se pudo procesar la compra");
                return;
            }

            setMensaje(`Compra realizada correctamente 🎮 Total: $${data.total.toFixed(2)}`);
            setCarrito([]);
            setMostrarModal(false);

            setTimeout(() => {
                navigate("/home");
            }, 1800);
        } catch (error) {
            console.error(error);
            setMensaje("Error al procesar compra");
        }
    };

    return (
        <main className="cart-page">
            <header className="cart-header">
                <h1>🛒 Mi Carrito</h1>

                <button onClick={() => navigate("/home")}>Volver</button>
            </header>

            {mensaje && <div className="cart-message">{mensaje}</div>}

            {carrito.length === 0 ? (
                <div className="empty-cart">
                    <h2>Tu carrito está vacío</h2>
                    <p>Agrega videojuegos para continuar</p>
                </div>
            ) : (
                <>
                    <section className="cart-grid">
                        {carrito.map((item) => (
                            <article className="cart-card" key={item.id}>
                                <img src={item.imagen} alt={item.nombre} />

                                <div className="cart-info">
                                    <h3>{item.nombre}</h3>
                                    <p>{item.genero}</p>

                                    <strong>
                                        {item.precio === 0 ? "Gratis" : `$${item.precio}`}
                                    </strong>

                                    <span className="cart-quantity">
                                        Cantidad: {item.cantidad}
                                    </span>

                                    <button onClick={() => eliminarProducto(item.id)}>
                                        Eliminar
                                    </button>
                                </div>
                            </article>
                        ))}
                    </section>

                    <section className="cart-summary">
                        <h2>Total: ${total.toFixed(2)}</h2>

                        <button
                            className="checkout-btn"
                            onClick={() => setMostrarModal(true)}
                        >
                            Finalizar Compra
                        </button>
                    </section>
                </>
            )}

            {mostrarModal && (
                <div className="modal-overlay">
                    <div className="checkout-modal">
                        <h2>Confirmar compra</h2>

                        <div className="buyer-info">
                            <p>
                                <strong>Cliente:</strong> {user?.nombre || "Usuario"}
                            </p>
                            <p>
                                <strong>Correo:</strong> {user?.correo}
                            </p>
                        </div>

                        <div className="checkout-items">
                            {carrito.map((item) => (
                                <div key={item.id} className="checkout-item">
                                    <span>
                                        {item.nombre} x{item.cantidad}
                                    </span>

                                    <strong>
                                        {item.precio === 0
                                            ? "Gratis"
                                            : `$${(item.precio * item.cantidad).toFixed(2)}`}
                                    </strong>
                                </div>
                            ))}
                        </div>

                        <h3>Total a pagar: ${total.toFixed(2)}</h3>

                        <label>Método de pago</label>
                        <select
                            value={metodoPago}
                            onChange={(e) => setMetodoPago(e.target.value)}
                        >
                            <option>Tarjeta</option>
                            <option>PayPal</option>
                            <option>Transferencia</option>
                        </select>

                        <div className="modal-actions">
                            <button onClick={finalizarCompra}>Confirmar Pago</button>

                            <button onClick={() => setMostrarModal(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default Cart;