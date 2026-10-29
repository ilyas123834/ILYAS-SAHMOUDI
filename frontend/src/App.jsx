import { useEffect, useState } from "react";

function App() {
  // etudiants : tableau des données reçues de l'API ; setEtudiants met à jour l'état et relance l'affichage
  const [etudiants, setEtudiants] = useState([]);
  const [erreur, setErreur] = useState("");

  // useEffect avec [] : exécuté une seule fois, quand le composant s'affiche pour la première fois
  useEffect(() => {
    fetch("http://localhost:5000/api/etudiants")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Impossible de charger les étudiants");
        }
        return response.json();
      })
      .then((data) => setEtudiants(data))
      .catch((error) => setErreur(error.message));
  }, []);

  return (
    <div>
      <h1>Gestion des étudiants</h1>
      {erreur && <p>{erreur}</p>}
      <ul>
        {etudiants.map((etudiant) => (
          <li key={etudiant._id}>
            {etudiant.nom} — {etudiant.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
