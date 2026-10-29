# Questions de compréhension — TP1 MERN

> À reformuler avec tes propres mots avant de rendre : l'important est de pouvoir les expliquer à l'oral.

**1. Quelle est la différence entre Node.js et Express ?**
Node.js est l'environnement d'exécution qui permet de faire tourner du JavaScript en dehors du navigateur (accès aux fichiers, au réseau, etc.). Express est une bibliothèque qui s'exécute dans Node.js et simplifie la création d'un serveur web : déclaration des routes, middlewares, lecture des requêtes et envoi des réponses.

**2. Quel est le rôle de MongoDB dans une application MERN ?**
MongoDB est la base de données : elle stocke les données de façon persistante sous forme de documents JSON (BSON) regroupés en collections. Sans elle, les données seraient perdues à chaque redémarrage du serveur.

**3. Quelle différence existe-t-il entre GET et POST ?**
GET sert à lire une ressource : il ne modifie rien et ses paramètres passent dans l'URL. POST sert à créer une ressource : les données sont envoyées dans le corps de la requête. Répéter un GET donne le même résultat ; répéter un POST peut créer plusieurs ressources.

**4. À quoi servent `req.body` et `req.params` ?**
`req.body` contient les données envoyées dans le corps de la requête (JSON), accessibles grâce au middleware `express.json()`. `req.params` contient les paramètres de l'URL : pour `/api/etudiants/:id`, `req.params.id` donne l'identifiant.

**5. Pourquoi utilise-t-on Mongoose ?**
MongoDB accepte n'importe quelle structure de document. Mongoose ajoute des schémas (types, champs obligatoires, unicité), de la validation et des méthodes pratiques (`find`, `save`, `findByIdAndUpdate`, `findByIdAndDelete`), ce qui rend le code plus sûr et plus lisible.

**6. Pourquoi ne doit-on jamais stocker un mot de passe en clair ?**
Si la base de données est piratée ou consultée par une personne non autorisée, tous les mots de passe seraient immédiatement exploitables, y compris sur d'autres sites si l'utilisateur réutilise le même. Un hash empêche de retrouver le mot de passe d'origine.

**7. Quelle différence existe-t-il entre `bcrypt.hash()` et `bcrypt.compare()` ?**
`bcrypt.hash(password, 12)` transforme le mot de passe en empreinte salée à sens unique, utilisée à l'inscription (12 est le coût de calcul). `bcrypt.compare(password, hash)` hache la saisie avec le même sel (contenu dans le hash) et renvoie `true` si le résultat correspond, utilisé à la connexion. On ne « déchiffre » jamais un hash.

**8. Pourquoi tester une API avec Postman avant de développer React ?**
Postman permet de tester le backend seul. Si quelque chose échoue ensuite avec React, on sait que l'API fonctionne et que le problème vient du frontend. Il permet aussi de tester facilement les cas d'erreur (400, 404, 409, 401) qui sont difficiles à provoquer depuis une interface.

**9. Pourquoi le fichier `.env` doit-il être ignoré par Git ?**
Il contient des informations secrètes (URI MongoDB avec identifiant et mot de passe). Un dépôt GitHub peut être lu par d'autres personnes, et des robots scannent GitHub pour récupérer ces secrets. De plus, un fichier commité reste dans l'historique même si on le supprime ensuite.

**10. Quel est le rôle de `useEffect` et `useState` dans le composant React fourni ?**
`useState` crée des variables d'état (`etudiants`, `erreur`) et leurs fonctions de mise à jour : quand on appelle `setEtudiants`, React réaffiche le composant avec les nouvelles données. `useEffect` avec un tableau de dépendances vide `[]` exécute le `fetch` une seule fois, au premier affichage du composant. Sans lui, chaque rendu relancerait la requête, ce qui créerait une boucle infinie.
