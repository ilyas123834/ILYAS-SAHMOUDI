# TP1 MERN — Commandes à taper (PowerShell, Windows)

Tape les commandes **dans l'ordre**. Les lignes en gris `# ...` sont des commentaires : ne les tape pas.
Après chaque étape, vérifie le « Résultat attendu » avant de continuer.

---

## ÉTAPE 0 — Vérifier les outils

```powershell
node -v
npm -v
git --version
```
Résultat attendu : trois numéros de version. Si une commande n'est pas reconnue, installe l'outil (Node.js LTS : https://nodejs.org, Git : https://git-scm.com/downloads), puis **ferme et rouvre** le terminal.

---

## ÉTAPE 1 — Créer tous les fichiers du projet

1. Télécharge `installer-projet.ps1` depuis la conversation (il va dans ton dossier Téléchargements).
2. Dans PowerShell :

```powershell
New-Item -ItemType Directory -Force "$env:USERPROFILE\gestion-etudiants" | Out-Null
cd "$env:USERPROFILE\gestion-etudiants"
powershell -ExecutionPolicy Bypass -File "$env:USERPROFILE\Downloads\installer-projet.ps1"
dir
```

Résultat attendu : la liste `cree : ...` (14 fichiers), puis `dir` affiche `backend`, `frontend`, `postman`, `README.md`, `REPONSES.md`.
(Si le fichier a un autre nom, par exemple `installer-projet (1).ps1`, adapte le nom dans la commande.)

Le dossier porte le nom exigé par le TP (`gestion-etudiants`). Le nom **ILYAS-SAHMOUDI** est utilisé pour le dépôt GitHub, le titre du README, le titre de la page web et le nom de la collection Postman. Pour travailler dans VS Code, ouvre le dossier avec `code .`, puis utilise le terminal intégré (il sera déjà dans le bon dossier).

---

## ÉTAPE 2 — Premier commit Git

```powershell
git init
git config user.name "Ilyas Sahmoudi"
git config user.email "ilyassahmoudi45927@gmail.com"
git add .gitignore README.md REPONSES.md backend/package.json backend/.env.example
git commit -m "Initialisation du projet et du backend"
```

---

## ÉTAPE 3 — Installer les dépendances du backend

```powershell
cd backend
npm install
```
Résultat attendu : un dossier `node_modules` apparaît, sans message `npm error`.

---

## ÉTAPE 4 — Préparer MongoDB Atlas (dans le navigateur)

1. https://www.mongodb.com/atlas → créer un compte → créer un cluster gratuit (**M0**).
2. Menu **Database Access** → *Add New Database User* : un nom + un mot de passe **uniquement lettres et chiffres** (pas de `@ # / :`). Note-les.
3. Menu **Network Access** → *Add IP Address* → *Add Current IP Address* (ou `0.0.0.0/0` pour le TP).
4. **Database** → *Connect* → *Drivers* → copie la chaîne `mongodb+srv://...`.

---

## ÉTAPE 5 — Créer le fichier .env

```powershell
copy .env.example .env
code .env
```
(Si `code` n'est pas reconnu : `notepad .env`.)

Dans `.env`, remplace par ta vraie chaîne (garde `/gestion-etudiants` à la fin) :

```
PORT=5000
MONGO_URI=mongodb+srv://TON_UTILISATEUR:TON_MOT_DE_PASSE@cluster0.xxxxx.mongodb.net/gestion-etudiants
```

Pas d'espaces, pas de guillemets. Enregistre le fichier (Ctrl+S).

---

## ÉTAPE 6 — Lancer le backend (Terminal 1)

```powershell
npm run dev
```
Résultat attendu :
```
MongoDB est connecté
Serveur lancé sur le port 5000
```
Ouvre http://localhost:5000/api/test dans le navigateur : tu dois voir `{"message":"L'API fonctionne correctement"}`.
**Laisse ce terminal ouvert.**

---

## ÉTAPE 7 — Commit des modèles et du serveur (dans un 2e terminal)

Ouvre un **nouveau terminal** (icône `+` de VS Code) :

```powershell
cd "$env:USERPROFILE\gestion-etudiants"
git add backend/models
git commit -m "Ajout des modeles Etudiant et Utilisateur"
git add backend/server.js
git commit -m "Serveur Express, routes CRUD et authentification bcrypt"
```

---

## ÉTAPE 8 — Tester avec Postman (pas de commande)

1. Postman → *Import* → choisis `postman\gestion-etudiants.postman_collection.json`.
2. Lance dans cet ordre (le serveur doit tourner) :

| # | Requête | Résultat attendu |
|---|---|---|
| 1 | GET /api/test | 200 |
| 2 | POST créer étudiant | 201 + un `_id` (copie-le) |
| 3 | GET liste | 200 + Sara dans la liste |
| 4 | PUT modifier | colle l'`_id` dans la variable `id` de la collection, puis 200 |
| 5 | DELETE supprimer | 200 « Étudiant supprimé » (refais ensuite un POST pour que la page React ait des étudiants à afficher) |
| 6 | POST register | 201, sans mot de passe dans la réponse |
| 7 | POST login | 200 « Connexion réussie » |
| 8 | login mauvais mot de passe | 401 |

3. Teste aussi les erreurs : même email deux fois, mot de passe de moins de 8 caractères, `_id` inexistant.
4. **Fais une capture d'écran de chaque test** pour le rendu.

---

## ÉTAPE 9 — Vérifier le mot de passe haché dans Atlas (navigateur)

Atlas → *Database* → *Browse Collections* → base `gestion-etudiants` → collection `utilisateurs`.
Le champ `password` doit commencer par `$2a$12$...`. **Capture d'écran.**

---

## ÉTAPE 10 — Lancer le frontend React (Terminal 2)

```powershell
cd "$env:USERPROFILE\gestion-etudiants\frontend"
npm install
npm run dev
```
Ouvre http://localhost:5173 : la page « Gestion des étudiants » affiche la liste. Si elle est vide, crée des étudiants avec Postman (POST) puis recharge la page. **Capture d'écran.**

---

## ÉTAPE 11 — Commit du frontend et de Postman

Dans un 3e terminal :

```powershell
cd "$env:USERPROFILE\gestion-etudiants"
git add frontend
git commit -m "Frontend React affichant la liste des etudiants"
git add postman
git commit -m "Ajout de la collection Postman"
git status
git log --oneline
```
Vérifie que `git status` ne mentionne ni `.env` ni `node_modules`.

---

## ÉTAPE 12 — Publier sur GitHub

1. Sur https://github.com/new : nom `ILYAS-SAHMOUDI`, dépôt **vide** (ne coche ni README, ni .gitignore, ni licence) → *Create repository*.
2. Puis :

```powershell
git branch -M main
git remote add origin https://github.com/ilyas123834/ILYAS-SAHMOUDI.git
git push -u origin main
```
(Une fenêtre de connexion GitHub peut s'ouvrir : connecte-toi.)

3. Sur la page du dépôt, vérifie que **`.env` et `node_modules` n'apparaissent pas**. Seul `.env.example` doit être visible.

---

## ÉTAPE 13 — Avant de rendre

- [ ] Réponses aux 10 questions : ouvre `REPONSES.md` et **reformule avec tes mots**.
- [ ] Captures : tests Postman (CRUD + register + login), hash dans Atlas, page React.
- [ ] Lien du dépôt GitHub.

---

## Si ça bloque

| Message | Cause | Solution |
|---|---|---|
| `npm` / `node` non reconnu | Node.js pas installé ou terminal pas redémarré | Installer Node LTS, rouvrir le terminal |
| `MongooseServerSelectionError` | Ton IP n'est pas autorisée dans Atlas | Network Access → ajouter l'IP |
| `bad auth` | Mauvais utilisateur ou mot de passe dans `.env` | Corriger `.env`, relancer `npm run dev` |
| `EADDRINUSE` | Le port 5000 est déjà pris | Fermer l'autre terminal du backend |
| `req.body` undefined | Body Postman pas en raw → JSON | Choisir Body → raw → JSON |
| Erreur CORS dans le navigateur | Le front n'est pas sur le port 5173 | Utiliser http://localhost:5173 |
| Script `.ps1` bloqué | Politique d'exécution | Utiliser la commande avec `-ExecutionPolicy Bypass` (étape 1) |

Si une erreur persiste : copie le message **exact** (ou une capture) et envoie-le-moi.
