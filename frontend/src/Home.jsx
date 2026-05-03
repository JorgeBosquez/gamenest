function Home() {
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <main style={{
      minHeight: "100vh",
      background: "#05050f",
      color: "white",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      gap: "20px"
    }}>
      <h1>Bienvenido {user?.nombre || "Gamer"} 🎮</h1>
      <p>Has iniciado sesión correctamente en GameNest.</p>
      <button onClick={logout}>Cerrar sesión</button>
    </main>
  );
}

export default Home;