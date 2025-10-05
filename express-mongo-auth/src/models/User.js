// src/models/User.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: { type: String },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  birthdate: { type: Date, required: true },
  url_profile: { type: String },
  address: { type: String },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8 },
  roles: [{ type: Schema.Types.ObjectId, ref: 'Role' }]
}, { timestamps: true });

// Virtual para edad
UserSchema.virtual('age').get(function() {
  if (!this.birthdate) return null;
  const diff = Date.now() - this.birthdate.getTime();
  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  return years;
});

UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });

// 🔹 Eliminamos el pre-save (el hash ya se hace en AuthController)

export default mongoose.model('User', UserSchema);
