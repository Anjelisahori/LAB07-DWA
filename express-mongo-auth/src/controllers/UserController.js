// src/controllers/UserController.js
import User from '../models/User.js';

class UserController {
  // GET /api/users (admin)
  async getAll(req, res, next) {
    try {
      const users = await User.find().populate('roles').select('-password').exec();
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  }

  // GET /api/users/me (cualquier usuario autenticado)
  async getMe(req, res, next) {
    try {
      const user = await User.findById(req.userId).populate('roles').select('-password').exec();
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }

  // GET /api/users/:id (admin)
  async getById(req, res, next) {
    try {
      const id = req.params.id;
      const user = await User.findById(id).populate('roles').select('-password').exec();
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }

  // PUT /api/users/me
  async updateMe(req, res, next) {
    try {
      const id = req.userId;
      const { name, lastName, phoneNumber, birthdate, url_profile, address } = req.body;
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

      user.name = name ?? user.name;
      user.lastName = lastName ?? user.lastName;
      user.phoneNumber = phoneNumber ?? user.phoneNumber;
      user.birthdate = birthdate ? new Date(birthdate) : user.birthdate;
      user.url_profile = url_profile ?? user.url_profile;
      user.address = address ?? user.address;

      await user.save();
      res.status(200).json({ message: 'Actualizado' });
    } catch (err) {
      next(err);
    }
  }

  // PUT /api/users/:id (admin)
  async updateById(req, res, next) {
    try {
      const id = req.params.id;
      const { name, lastName, phoneNumber, birthdate, url_profile, address } = req.body;
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

      user.name = name ?? user.name;
      user.lastName = lastName ?? user.lastName;
      user.phoneNumber = phoneNumber ?? user.phoneNumber;
      user.birthdate = birthdate ? new Date(birthdate) : user.birthdate;
      user.url_profile = url_profile ?? user.url_profile;
      user.address = address ?? user.address;

      await user.save();
      res.status(200).json({ message: 'Actualizado' });
    } catch (err) {
      next(err);
    }
  }
}

export default new UserController();
