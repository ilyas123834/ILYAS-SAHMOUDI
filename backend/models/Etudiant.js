const mongoose = require("mongoose");

// Un schéma décrit la forme d'un document dans la collection "etudiants".
const etudiantSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true }
});

// Mongoose crée automatiquement la collection "etudiants" (nom du modèle en minuscules + pluriel).
module.exports = mongoose.model("Etudiant", etudiantSchema);
