const mongoose = require("mongoose");

const utilisateurSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  // Ce champ contiendra le HASH bcrypt, jamais le mot de passe en clair.
  password: { type: String, required: true }
});

module.exports = mongoose.model("Utilisateur", utilisateurSchema);
