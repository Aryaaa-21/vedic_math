const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const ActivitySchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, enum: ["practice", "challenge"], required: true },
  title: { type: String, required: true },
  desc: { type: String, required: true },
  date: { type: String, required: true },
  xpAwarded: { type: Number, default: 0 }
});

const BadgeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  unlocked: { type: Boolean, default: false },
  unlockedAt: { type: Date, default: null }
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  joinedDate: { type: Date, default: Date.now },
  level: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 },
  badges: { type: Array, default: [] },
  completedTechniques: { type: Array, default: [] },
  challengeHistory: { type: Array, default: [] },
  profileImage: { type: String, default: "" },
  avatar: { type: String, default: "https://lh3.googleusercontent.com/a/default-user" },
  avgSpeed: { type: Number, default: 0 },
  completedLessons: { type: Number, default: 0 },
  challengeHighScore: { type: Number, default: 0 },
  recentActivities: { type: [ActivitySchema], default: [] }
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
