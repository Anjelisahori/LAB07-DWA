// src/server.js
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js';
import viewsRoutes from './routes/views.routes.js';
import seedRoles from './utils/seedRoles.js';
import seedUsers from './utils/seedUsers.js';

// 📦 Configuración inicial
dotenv.config();
const app = express();

// 📁 Configurar __dirname para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🧩 Middlewares base
app.use(cors());
app.use(express.json({ limit: '10mb' })); // 👈 asegura que JSONs grandes no se corten
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// 🧠 Motor de vistas (EJS)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 🔧 Middleware global (evita error "user is not defined" en vistas EJS)
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// 🧭 Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// 🌐 Rutas de vistas (frontend)
app.use('/', viewsRoutes);

// 🩺 Ruta de prueba
app.get('/health', (req, res) => res.json({ ok: true }));

// 🧱 Manejador de errores global
app.use((err, req, res, next) => {
  console.error('❌ Error en servidor:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Error interno del servidor',
  });
});

// 🚀 Conexión a MongoDB
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
  })
  .then(async () => {
    console.log('✅ Conectado a MongoDB');

    // ⚙️ Inicialización de roles y usuarios base
    if (typeof seedRoles === 'function') await seedRoles();
    if (typeof seedUsers === 'function') await seedUsers();

    // 🚀 Iniciar servidor
    app.listen(PORT, () =>
      console.log(`💻 Servidor corriendo en: http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error('❌ Error al conectar con MongoDB:', err);
    process.exit(1);
  });
