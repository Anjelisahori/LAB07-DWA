// src/routes/views.routes.js
import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// 🧩 Middleware para verificar token desde header o query
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization || req.query.token;
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return res.redirect('/signIn');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.sub;
    next();
  } catch (err) {
    console.error('Token inválido o expirado:', err.message);
    return res.redirect('/signIn');
  }
}

// ✅ Rutas públicas
router.get('/', (req, res) => res.redirect('/signIn'));
router.get('/signIn', (req, res) => res.render('auth/signIn'));
router.get('/signUp', (req, res) => res.render('auth/signUp'));

// ✅ Dashboard protegido
router.get('/dashboard', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('roles').lean();
    if (!user) return res.redirect('/signIn');

    const roleNames = user.roles.map(r => r.name);
    if (roleNames.includes('admin')) {
      // Mostrar panel admin con todos los usuarios
      const users = await User.find().populate('roles').lean();
      return res.render('admin/dashboard', { users });
    } else {
      // Mostrar dashboard normal de usuario
      return res.render('user/dashboard', { user });
    }
  } catch (err) {
    console.error(err);
    res.redirect('/signIn');
  }
});

// ✅ Perfil protegido
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('roles').lean();
    if (!user) return res.redirect('/signIn');
    res.render('user/profile', { user });
  } catch (err) {
    console.error(err);
    res.redirect('/signIn');
  }
});

// 🚪 Logout
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/signIn');
});

// ❌ Errores
router.get('/403', (req, res) => res.status(403).render('errors/403'));
router.get('*', (req, res) => res.status(404).render('errors/404'));

export default router;
