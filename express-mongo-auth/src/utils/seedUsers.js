// src/utils/seedUsers.js
import Role from '../models/Role.js';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

export default async function seedUsers() {
  // crear roles si no existen
  let adminRole = await Role.findOne({ name: 'admin' }).exec();
  let userRole = await Role.findOne({ name: 'user' }).exec();

  if (!adminRole) adminRole = await Role.create({ name: 'admin' });
  if (!userRole) userRole = await Role.create({ name: 'user' });

  // admin de ejemplo
  const adminEmail = 'carlos.admin@example.com';
  const existing = await User.findOne({ email: adminEmail }).exec();
  if (existing) {
    console.log('Admin ya existe:', adminEmail);
    return;
  }

  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10);
  const hashed = await bcrypt.hash('Carlos#2025', saltRounds);

  const admin = new User({
    name: 'Carlos',
    lastName: 'Ramírez',
    phoneNumber: '+51981234567',
    birthdate: new Date('1985-06-15'),
    email: adminEmail,
    password: hashed,
    url_profile: '',
    address: 'Lima, Perú',
    roles: [adminRole._id]
  });

  await admin.save();
  console.log('Seeded admin user:', adminEmail, ' / Password: Carlos#2025');
}
