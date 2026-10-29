require("dotenv").config(); // charge le fichier .env dans process.env

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const Etudiant = require("./models/Etudiant");
const Utilisateur = require("./models/Utilisateur");

const app = express();
const PORT = process.env.PORT || 5000;

// ===== Middlewares (toujours AVANT les routes) =====
app.use(cors({ origin: "http://localhost:5173" })); // autorise le frontend React (Vite)
app.use(express.json());                            // permet de lire req.body au format JSON

// ===== Routes de base =====
app.get("/", (req, res) => {
  res.send("Mon premier serveur MERN !");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "L'API fonctionne correctement" });
});

// ===== CRUD Etudiants =====

// READ : tous les étudiants
app.get("/api/etudiants", async (req, res) => {
  try {
    const etudiants = await Etudiant.find();
    res.json(etudiants);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// CREATE : un nouvel étudiant
app.post("/api/etudiants", async (req, res) => {
  try {
    const nouvelEtudiant = new Etudiant({
      nom: req.body.nom,
      email: req.body.email,
      age: req.body.age
    });
    const resultat = await nouvelEtudiant.save();
    res.status(201).json(resultat);
  } catch (error) {
    res.status(400).json({ message: "Impossible de créer l'étudiant" });
  }
});

// UPDATE : modifier un étudiant (l'identifiant vient de l'URL : req.params.id)
app.put("/api/etudiants/:id", async (req, res) => {
  try {
    const etudiant = await Etudiant.findByIdAndUpdate(
      req.params.id,
      {
        nom: req.body.nom,
        email: req.body.email,
        age: req.body.age
      },
      { new: true, runValidators: true } // new: renvoie le document modifié ; runValidators: applique le schéma
    );
    if (!etudiant) {
      return res.status(404).json({ message: "Étudiant introuvable" });
    }
    res.json(etudiant);
  } catch (error) {
    res.status(400).json({ message: "Modification impossible" });
  }
});

// DELETE : supprimer un étudiant
app.delete("/api/etudiants/:id", async (req, res) => {
  try {
    const etudiant = await Etudiant.findByIdAndDelete(req.params.id);
    if (!etudiant) {
      return res.status(404).json({ message: "Étudiant introuvable" });
    }
    res.json({ message: "Étudiant supprimé" });
  } catch (error) {
    res.status(400).json({ message: "Suppression impossible" });
  }
});

// ===== Authentification =====

// Inscription : valide, vérifie l'unicité, hache le mot de passe puis enregistre
app.post("/api/auth/register", async (req, res) => {
  try {
    const { nom, email, password } = req.body;

    if (!nom || !email || !password) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires" });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Le mot de passe doit contenir au moins 8 caractères" });
    }

    const emailNormalise = email.trim().toLowerCase();
    const existe = await Utilisateur.findOne({ email: emailNormalise });
    if (existe) {
      return res.status(409).json({ message: "Cette adresse e-mail est déjà utilisée" });
    }

    const passwordHash = await bcrypt.hash(password, 12); // 12 = coût de calcul (salt rounds)
    const utilisateur = await Utilisateur.create({
      nom,
      email: emailNormalise,
      password: passwordHash
    });

    // On ne renvoie JAMAIS le mot de passe, même haché.
    res.status(201).json({
      message: "Compte créé avec succès",
      utilisateur: {
        id: utilisateur._id,
        nom: utilisateur.nom,
        email: utilisateur.email
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Cette adresse e-mail est déjà utilisée" });
    }
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Connexion : compare le mot de passe saisi avec le hash stocké
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "E-mail et mot de passe obligatoires" });
    }

    const utilisateur = await Utilisateur.findOne({ email: email.trim().toLowerCase() });
    if (!utilisateur) {
      return res.status(401).json({ message: "Identifiants incorrects" });
    }

    const valide = await bcrypt.compare(password, utilisateur.password);
    if (!valide) {
      return res.status(401).json({ message: "Identifiants incorrects" });
    }

    res.json({
      message: "Connexion réussie",
      utilisateur: {
        id: utilisateur._id,
        nom: utilisateur.nom,
        email: utilisateur.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ===== Démarrage : le serveur n'écoute qu'après la connexion à MongoDB =====
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB est connecté");
    app.listen(PORT, () => {
      console.log(`Serveur lancé sur le port ${PORT}`);
    });
  } catch (error) {
    console.error("Erreur MongoDB :", error.message);
    process.exit(1);
  }
}

startServer();
