# ILYAS-SAHMOUDI — TP1 MERN Stack : gestion des étudiants (ESISA, module CMS S101)

Application MERN : API REST (Node.js, Express, MongoDB/Mongoose) + frontend React (Vite).

## Structure

```
gestion-etudiants/
├── backend/
│   ├── models/Etudiant.js
│   ├── models/Utilisateur.js
│   ├── server.js
│   ├── package.json
│   └── .env.example        (modèle du .env, à copier)
├── frontend/               (React + Vite)
├── postman/                (collection à importer dans Postman)
├── .gitignore
├── README.md
└── REPONSES.md             (réponses aux 10 questions de compréhension)
```

## 1. Installation

Prérequis : Node.js LTS, Git, Postman, un compte MongoDB Atlas.

```bash
cd backend
npm install

cd ../frontend
npm install
```

## 2. Configurer MongoDB Atlas

1. Crée un compte sur https://www.mongodb.com/atlas, puis un cluster gratuit (M0).
2. **Database Access** : crée un utilisateur de base de données (nom + mot de passe **alphanumérique**, sans `@ # / :`).
3. **Network Access** : ajoute ton adresse IP (pour un TP, `0.0.0.0/0` est acceptable ; jamais en production).
4. **Connect > Drivers** : copie la chaîne `mongodb+srv://...`.
5. Dans `backend/`, copie `.env.example` en `.env` :
   ```bash
   cp .env.example .env        # Windows : copy .env.example .env
   ```
6. Ouvre `.env` et remplace `UTILISATEUR`, `MOT_DE_PASSE` et `VOTRE_CLUSTER` par tes vraies valeurs. Garde `/gestion-etudiants` à la fin (nom de la base).

## 3. Lancer le projet (2 terminaux)

Terminal 1 — backend :
```bash
cd backend
npm run dev
```
Tu dois voir : `MongoDB est connecté` puis `Serveur lancé sur le port 5000`.

Terminal 2 — frontend :
```bash
cd frontend
npm run dev
```
Ouvre http://localhost:5173.

## 4. Tester avec Postman

Importe `postman/gestion-etudiants.postman_collection.json` (Import > fichier).
Ordre conseillé :

| # | Requête | Résultat attendu |
|---|---|---|
| 1 | GET /api/test | 200 + `{"message":"L'API fonctionne correctement"}` |
| 2 | POST /api/etudiants | 201 + document avec `_id` |
| 3 | GET /api/etudiants | 200 + liste |
| 4 | PUT /api/etudiants/ID | 200 + document modifié (copie l'`_id` du POST dans la variable `id` de la collection) |
| 5 | DELETE /api/etudiants/ID | 200 + « Étudiant supprimé » |
| 6 | POST /api/auth/register | 201, sans mot de passe dans la réponse |
| 7 | POST /api/auth/login | 200 « Connexion réussie » |
| 8 | login avec un mauvais mot de passe | 401 |

Tests d'erreur à faire aussi (utiles pour la note) : même email deux fois (400 sur étudiants, 409 sur register), mot de passe de moins de 8 caractères (400), `_id` inexistant (404).
Prends une capture d'écran de chaque test pour ton rendu.

## 5. Vérifier le hachage dans Atlas

Atlas > Database > Browse Collections > base `gestion-etudiants` > collection `utilisateurs`.
Le champ `password` doit ressembler à `$2a$12$...` (60 caractères), jamais au mot de passe saisi. Capture d'écran à joindre.

## 6. Git : faire des commits explicites

Depuis la racine `gestion-etudiants/` :

```bash
git init
git config user.name "Ton Nom"
git config user.email "ton@email.com"
git status          # vérifie que .env et node_modules n'apparaissent PAS
git add .
git commit -m "Creation du serveur et des routes CRUD"
git log --oneline
```

Pour avoir un historique qui montre ta progression, tu peux faire plusieurs commits (ex. : « Initialisation du projet », « Connexion MongoDB », « Routes CRUD étudiants », « Inscription et connexion avec bcrypt », « Frontend React »).

## 7. Publier sur GitHub sans exposer les secrets

1. Sur https://github.com, crée un dépôt **vide** (sans README ni .gitignore).
2. Puis :
   ```bash
   git branch -M main
   git remote add origin https://github.com/TON_PSEUDO/ILYAS-SAHMOUDI.git
   git push -u origin main
   ```
3. Sur la page GitHub du dépôt, vérifie que `.env` et `node_modules` n'y sont pas. Seul `.env.example` (sans vrais identifiants) doit être visible.
4. Si un secret a été publié par erreur : change immédiatement le mot de passe de l'utilisateur Atlas.

## 8. Erreurs fréquentes

| Erreur | Cause probable |
|---|---|
| `MongooseServerSelectionError` | Ton IP n'est pas autorisée dans Network Access |
| `bad auth` / `Authentication failed` | Mauvais utilisateur ou mot de passe dans `MONGO_URI` |
| `req.body` est `undefined` | Body Postman pas en raw > JSON, ou `express.json()` absent |
| `EADDRINUSE` | Le port 5000 est déjà utilisé : ferme l'autre terminal |
| Erreur CORS dans la console du navigateur | Le frontend ne tourne pas sur http://localhost:5173 |
| Liste vide sur la page React | Aucun étudiant créé : fais d'abord un POST dans Postman |
