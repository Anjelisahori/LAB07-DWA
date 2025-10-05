// src/controllers/AuthController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Role from '../models/Role.js';

// Validación de contraseña según requisitos
function validatePasswordRules(password) {
  const minLen = /.{8,}/;
  const hasUpper = /[A-Z]/;
  const hasDigit = /\d/;
  const hasSpecial = /[#$%&*@]/;
  return minLen.test(password) && hasUpper.test(password) && hasDigit.test(password) && hasSpecial.test(password);
}

class AuthController {
  async signUp(req, res, next) {
    try {
      console.log("📩 BODY RECIBIDO EN SIGNUP:", req.body); // 👈 para depurar

      const { email, password, name, lastName, phoneNumber, birthdate, url_profile, address, roles } = req.body;

      // Validaciones básicas
      if (!email || !password || !lastName || !phoneNumber || !birthdate) {
        return res.status(400).json({ message: 'Faltan campos requeridos: lastName, phoneNumber o birthdate' });
      }

      // Validar contraseña
      if (!validatePasswordRules(password)) {
        return res.status(400).json({
          message: 'La contraseña debe tener al menos 8 caracteres, 1 mayúscula, 1 dígito y 1 carácter especial (# $ % & * @)'
        });
      }

      // Validar si ya existe el usuario
      const existing = await User.findOne({ email }).exec();
      if (existing) return res.status(400).json({ message: 'El email ya se encuentra en uso' });

      // Procesar roles
      const requestedRoles = Array.isArray(roles) && roles.length > 0 ? roles : ['user'];
      const roleDocs = [];

      for (const r of requestedRoles) {
        let roleFound = await Role.findOne({ name: r }).exec();
        if (!roleFound) {
          roleFound = await Role.create({ name: r });
        }
        roleDocs.push(roleFound._id);
      }

      // Validar fecha de nacimiento
      const bd = new Date(birthdate);
      if (Number.isNaN(bd.getTime())) return res.status(400).json({ message: 'birthdate inválida' });

      // Hashear la contraseña
      const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10);
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Crear usuario
      const user = new User({
        name,
        lastName,
        phoneNumber,
        birthdate: bd,
        email,
        password: hashedPassword,
        url_profile,
        address,
        roles: roleDocs
      });

      await user.save();

      return res.status(201).json({
        message: 'Usuario registrado correctamente',
        id: user._id,
        email: user.email,
        roles: requestedRoles
      });
    } catch (err) {
      console.error("❌ Error en signUp:", err);
      next(err);
    }
  }

  async signIn(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password)
        return res.status(400).json({ message: 'El email y password son requeridos' });

      const user = await User.findOne({ email }).populate('roles').exec();
      if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: 'Credenciales inválidas' });

      // Generar token
      const token = jwt.sign(
        {
          sub: user._id.toString(),
          roles: user.roles.map(r => r.name),
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
      );

      return res.status(200).json({
        message: 'Inicio de sesión exitoso',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          roles: user.roles.map(r => r.name)
        }
      });
    } catch (err) {
      console.error("❌ Error en signIn:", err);
      next(err);
    }
  }
}

export default new AuthController();
