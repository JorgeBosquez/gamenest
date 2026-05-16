const sqlite3 = require("sqlite3").verbose();

// Crear o conectar a la base de datos
const db = new sqlite3.Database("./gamenest.db", (err) => {
  if (err) {
    console.error("Error al conectar con la base de datos", err);
  } else {
    console.log("Base de datos SQLite conectada");
  }
});

// ======================
// TABLA USUARIOS
// ======================

db.run(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    correo TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`);

// ======================
// TABLA JUEGOS
// ======================

db.run(`
  CREATE TABLE IF NOT EXISTS juegos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    genero TEXT NOT NULL,
    precio REAL NOT NULL,
    imagen TEXT,
    descripcion TEXT
  )
`);

// ======================
// INSERTAR JUEGOS DE PRUEBA
// ======================
 db.run("DELETE FROM juegos");
const juegosIniciales = [
  {
    nombre: "EA Sports FC 26",
    genero: "Deportes",
    precio: 69.99,
    imagen: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3405690/2d96aa1b06e453cd62dae9029d412f19e61932c3/header.jpg",
    descripcion: "La nueva generación del simulador de fútbol con mejoras gráficas y Ultimate Team renovado."
  },
  {
    nombre: "Call of Duty: Black Ops 6",
    genero: "Shooter",
    precio: 69.99,
    imagen: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2933620/header.jpg",
    descripcion: "Shooter militar con campaña cinematográfica y multijugador competitivo."
  },
  {
    nombre: "Black Myth: Wukong",
    genero: "Acción RPG",
    precio: 59.99,
    imagen: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2358720/header.jpg",
    descripcion: "Aventura inspirada en la mitología china con combates intensos y jefes épicos."
  },
  {
    nombre: "Marvel Rivals",
    genero: "Hero Shooter",
    precio: 0,
    imagen: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2767030/header.jpg",
    descripcion: "Shooter competitivo con héroes y villanos del universo Marvel."
  },
  {
    nombre: "Monster Hunter Wilds",
    genero: "Aventura",
    precio: 69.99,
    imagen: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2246340/header.jpg",
    descripcion: "Explora ecosistemas dinámicos y caza criaturas gigantes."
  },
  {
    nombre: "Dragon Ball: Sparking! ZERO",
    genero: "Lucha",
    precio: 59.99,
    imagen: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1790600/header.jpg",
    descripcion: "Combates anime espectaculares con destrucción total."
  },
  {
    nombre: "Assassin's Creed Shadows",
    genero: "Acción RPG",
    precio: 69.99,
    imagen: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3159330/header.jpg",
    descripcion: "Explora el Japón feudal con sigilo y combates samurái."
  },
  {
    nombre: "Silent Hill 2 Remake",
    genero: "Terror",
    precio: 59.99,
    imagen: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2124490/header.jpg",
    descripcion: "Remake moderno del clásico survival horror psicológico."
  },
  {
    nombre: "Resident Evil 4 Remake",
    genero: "Terror",
    precio: 39.99,
    imagen: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2050650/header.jpg",
    descripcion: "Acción y terror en una reinvención del clásico."
  },
  {
    nombre: "Cyberpunk 2077",
    genero: "Acción RPG",
    precio: 49.99,
    imagen: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg",
    descripcion: "Explora Night City con acción futurista."
  },
  {
    nombre: "Elden Ring",
    genero: "RPG",
    precio: 59.99,
    imagen: "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg",
    descripcion: "Mundo abierto desafiante con combate Soulslike."
  },
  {
    nombre: "Fortnite",
    genero: "Battle Royale",
    precio: 0,
    imagen: "https://cdn2.unrealengine.com/fortnite-chapter-5-season-3-key-art-1920x1080-5e8c5f1d8f5f.jpg",
    descripcion: "Battle royale con temporadas y eventos constantes."
  },
  {
    nombre: "Valorant",
    genero: "Shooter",
    precio: 0,
    imagen: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/news_live/5a8d7e3f7fd5401397dbeed52b21965b4b5d4792-1920x1080.jpg",
    descripcion: "FPS táctico competitivo basado en agentes."
  },
  {
    nombre: "League of Legends",
    genero: "MOBA",
    precio: 0,
    imagen: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/news_live/4db0e4f113fb9a2b805d6e7ca3a0655e768f8b1a-1920x1080.jpg",
    descripcion: "MOBA competitivo con campeones y estrategia."
  },
  {
    nombre: "Apex Legends",
    genero: "Battle Royale",
    precio: 0,
    imagen: "https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/header.jpg",
    descripcion: "Battle royale dinámico con héroes únicos."
  },
  {
    nombre: "Helldivers 2",
    genero: "Shooter",
    precio: 39.99,
    imagen: "https://cdn.cloudflare.steamstatic.com/steam/apps/553850/header.jpg",
    descripcion: "Acción cooperativa intensa contra hordas alienígenas."
  },
  {
    nombre: "NBA 2K26",
    genero: "Deportes",
    precio: 69.99,
    imagen: "https://cdn.cloudflare.steamstatic.com/steam/apps/2878980/header.jpg",
    descripcion: "Simulación de baloncesto con modos online competitivos."
  },
  {
    nombre: "WWE 2K26",
    genero: "Lucha",
    precio: 59.99,
    imagen: "https://cdn.cloudflare.steamstatic.com/steam/apps/2315690/header.jpg",
    descripcion: "Videojuego de lucha libre con superestrellas WWE."
  },
  {
    nombre: "Tekken 8",
    genero: "Lucha",
    precio: 59.99,
    imagen: "https://cdn.cloudflare.steamstatic.com/steam/apps/1778820/header.jpg",
    descripcion: "Combates intensos con gráficos de nueva generación."
  },
  {
    nombre: "Mortal Kombat 1",
    genero: "Lucha",
    precio: 49.99,
    imagen: "https://cdn.cloudflare.steamstatic.com/steam/apps/1971870/header.jpg",
    descripcion: "Lucha brutal con fatalities cinematográficos."
  },
  {
    nombre: "Minecraft",
    genero: "Sandbox",
    precio: 26.95,
    imagen: "https://www.minecraft.net/content/dam/minecraftnet/games/minecraft/key-art/MC-Vanilla-KeyArt.jpg",
    descripcion: "Construye y explora mundos infinitos."
  },
  {
    nombre: "Palworld",
    genero: "Sandbox",
    precio: 29.99,
    imagen: "https://cdn.cloudflare.steamstatic.com/steam/apps/1623730/header.jpg",
    descripcion: "Criaturas, supervivencia y construcción en mundo abierto."
  },
  {
    nombre: "Hollow Knight",
    genero: "Aventura",
    precio: 14.99,
    imagen: "https://cdn.cloudflare.steamstatic.com/steam/apps/367520/header.jpg",
    descripcion: "Metroidvania desafiante con arte espectacular."
  },
  {
    nombre: "Overwatch 2",
    genero: "Hero Shooter",
    precio: 0,
    imagen: "https://cdn.cloudflare.steamstatic.com/steam/apps/2357570/header.jpg",
    descripcion: "Shooter por equipos con héroes únicos."
  },
  {
    nombre: "Sea of Thieves",
    genero: "Aventura",
    precio: 39.99,
    imagen: "https://cdn.cloudflare.steamstatic.com/steam/apps/1172620/header.jpg",
    descripcion: "Explora mares y vive aventuras piratas."
  },
  {
    nombre: "Diablo IV",
    genero: "RPG",
    precio: 59.99,
    imagen: "https://cdn.cloudflare.steamstatic.com/steam/apps/2344520/header.jpg",
    descripcion: "Acción RPG oscura con exploración y loot."
  },
  {
    nombre: "Starfield",
    genero: "RPG",
    precio: 69.99,
    imagen: "https://cdn.cloudflare.steamstatic.com/steam/apps/1716740/header.jpg",
    descripcion: "Explora galaxias en esta aventura espacial."
  },
  {
    nombre: "The Finals",
    genero: "Shooter",
    precio: 0,
    imagen: "https://cdn.cloudflare.steamstatic.com/steam/apps/2073850/header.jpg",
    descripcion: "Shooter destructivo competitivo por equipos."
  },
  {
    nombre: "No Man's Sky",
    genero: "Sandbox",
    precio: 59.99,
    imagen: "https://cdn.cloudflare.steamstatic.com/steam/apps/275850/header.jpg",
    descripcion: "Explora planetas infinitos y galaxias enteras."
  },
  {
    nombre: "Forza Horizon 5",
    genero: "Carreras",
    precio: 59.99,
    imagen: "https://cdn.cloudflare.steamstatic.com/steam/apps/1551360/header.jpg",
    descripcion: "Carreras arcade en escenarios espectaculares."
  }
];
db.get("SELECT COUNT(*) AS total FROM juegos", (err, row) => {
  if (err) {
    console.error("Error al verificar juegos:", err);
    return;
  }

  // Insertar solo si no existen juegos
  if (row.total === 0) {
    const query = `
      INSERT INTO juegos (nombre, genero, precio, imagen, descripcion)
      VALUES (?, ?, ?, ?, ?)
    `;

    juegosIniciales.forEach((juego) => {
      db.run(query, [
        juego.nombre,
        juego.genero,
        juego.precio,
        juego.imagen,
        juego.descripcion
      ]);
    });

    console.log("Juegos insertados correctamente");
  }
});
module.exports = db;