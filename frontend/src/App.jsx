import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import logo from "./assets/logo.png";

import { FcGoogle } from "react-icons/fc";
import { FaDiscord, FaUsers } from "react-icons/fa";
import { IoGameController } from "react-icons/io5";
import { GiTrophyCup } from "react-icons/gi";

const API_URL = "http://localhost:3000/api/auth";

function App() {
  const navigate = useNavigate();

  const [modo, setModo] = useState("login");
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [info, setInfo] = useState("");

  const [nombreError, setNombreError] = useState("");
  const [correoError, setCorreoError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const esLogin = modo === "login";

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/home");
    }
  }, [navigate]);

  const limpiarMensajes = () => {
    setError("");
    setSuccess("");
    setInfo("");
  };

  const limpiarFormulario = () => {
    setNombre("");
    setCorreo("");
    setPassword("");
    setNombreError("");
    setCorreoError("");
    setPasswordError("");
  };

  const validarNombre = (valor) => {
    setNombre(valor);

    if (!valor.trim()) {
      setNombreError("El nombre es obligatorio");
    } else {
      setNombreError("");
    }
  };

  const validarCorreo = (valor) => {
    setCorreo(valor);

    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!valor.trim()) {
      setCorreoError("El correo es obligatorio");
    } else if (!correoRegex.test(valor)) {
      setCorreoError("Ingresa un correo válido. Ej: usuario@gmail.com");
    } else {
      setCorreoError("");
    }
  };

  const validarPassword = (valor) => {
  setPassword(valor);

  if (!valor) {
    setPasswordError("La contraseña es obligatoria");
  } else {
    setPasswordError("");
  }
};

  const formularioValido = () => {
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let valido = true;

    if (!esLogin && !nombre.trim()) {
      setNombreError("El nombre es obligatorio");
      valido = false;
    }

    if (!correo.trim()) {
      setCorreoError("El correo es obligatorio");
      valido = false;
    } else if (!correoRegex.test(correo)) {
      setCorreoError("Ingresa un correo válido. Ej: usuario@gmail.com");
      valido = false;
    }

    if (!password) {
    setPasswordError("La contraseña es obligatoria");
    valido = false;
    }

    return valido;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    limpiarMensajes();

    if (!formularioValido()) {
      setError("Corrige los campos antes de continuar.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "No se pudo iniciar sesión");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      setSuccess("Usuario encontrado. Inicio de sesión exitoso.");
      limpiarFormulario();

      setTimeout(() => {
        navigate("/home");
      }, 800);
    } catch {
      setError("No se pudo conectar con el servidor");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    limpiarMensajes();

    if (!formularioValido()) {
      setError("Corrige los campos antes de registrarte.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, correo, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "No se pudo registrar el usuario");
        return;
      }

      setSuccess("Usuario registrado correctamente. Ahora inicia sesión.");
      setModo("login");
      limpiarFormulario();
    } catch {
      setError("No se pudo conectar con el servidor");
    }
  };

  const cambiarModo = () => {
    limpiarMensajes();
    limpiarFormulario();
    setModo(esLogin ? "register" : "login");
  };

  const mostrarProximamente = (proveedor) => {
    setError("");
    setSuccess("");
    setInfo(`Inicio de sesión con ${proveedor} estará disponible próximamente.`);
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="left-panel">
          <div className="logo-box">
            <img src={logo} alt="GameNest Logo" className="logo-img" />
            <h1>GAMENEST</h1>
          </div>

          <h2>
            TU MUNDO, <br />
            <span>TUS JUEGOS</span>
          </h2>

          <p>
            Inicia sesión para acceder a tu perfil, descubrir nuevos juegos y
            conectar con la comunidad gamer.
          </p>

          <div className="features-container">
            <div className="feature">
              <span>
                <IoGameController />
              </span>
              <div>
                <h3>Descubre</h3>
                <p>Nuevos juegos cada semana</p>
              </div>
            </div>

            <div className="feature">
              <span>
                <FaUsers />
              </span>
              <div>
                <h3>Conecta</h3>
                <p>Únete a una comunidad gamer</p>
              </div>
            </div>

            <div className="feature">
              <span>
                <GiTrophyCup />
              </span>
              <div>
                <h3>Compite</h3>
                <p>Participa y mejora tu experiencia</p>
              </div>
            </div>
          </div>
        </div>

        <div className="right-panel">
          <form
            className="login-form"
            onSubmit={esLogin ? handleLogin : handleRegister}
            noValidate
          >
            <h2>{esLogin ? "Bienvenido de vuelta" : "Crear cuenta"}</h2>

            <p>
              {esLogin
                ? "Inicia sesión para continuar"
                : "Regístrate para empezar en GameNest"}
            </p>

            {!esLogin && (
              <>
                <label htmlFor="nombre">Nombre</label>
                <input
                  id="nombre"
                  type="text"
                  placeholder="Tu nombre"
                  value={nombre}
                  onChange={(e) => validarNombre(e.target.value)}
                  className={nombreError ? "input-error" : ""}
                />
                {nombreError && <p className="field-error">{nombreError}</p>}
              </>
            )}

            <label htmlFor="correo">Correo electrónico</label>
            <input
              id="correo"
              type="email"
              placeholder="tu@email.com"
              value={correo}
              onChange={(e) => validarCorreo(e.target.value)}
              className={correoError ? "input-error" : ""}
            />
            {correoError && <p className="field-error">{correoError}</p>}

            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => validarPassword(e.target.value)}
               className={passwordError ? "input-error" : ""}
            />
            {passwordError && <p className="field-error">{passwordError}</p>}

            {esLogin && (
              <a
                href="#"
                className="forgot"
                onClick={(e) => {
                  e.preventDefault();
                  setInfo("Recuperación de contraseña disponible próximamente.");
                  setError("");
                  setSuccess("");
                }}
              >
                ¿Olvidaste tu contraseña?
              </a>
            )}

            <button type="submit">
              {esLogin ? "Iniciar sesión →" : "Registrarse →"}
            </button>

            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            {info && <p className="info-message">{info}</p>}

            {esLogin && (
              <>
                <div className="divider">
                  <span></span>
                  <p>o continúa con</p>
                  <span></span>
                </div>

                <div className="social-buttons">
                  <button
                    type="button"
                    className="social-btn"
                    onClick={() => mostrarProximamente("Google")}
                  >
                    <FcGoogle className="social-icon" />
                    Google
                  </button>

                  <button
                    type="button"
                    className="social-btn discord"
                    onClick={() => mostrarProximamente("Discord")}
                  >
                    <FaDiscord className="social-icon" />
                    Discord
                  </button>
                </div>
              </>
            )}

            <p className="register-text">
              {esLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
              <span onClick={cambiarModo}>
                {esLogin ? "Regístrate" : "Inicia sesión"}
              </span>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}

export default App;