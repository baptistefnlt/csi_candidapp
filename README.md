# CandidApp - Gestion des Candidatures Étudiantes

Application web de gestion des candidatures pour les stages, alternances et CDD destinée aux établissements d'enseignement supérieur.

## 📋 Description

CandidApp permet de gérer le processus complet de candidature des étudiants aux offres d'emploi (stages, alternances, CDD) proposées par les entreprises partenaires. L'application propose différents rôles avec des fonctionnalités adaptées :

- **Étudiants** : Consultation des offres, candidatures, gestion du profil et attestations RC
- **Entreprises** : Création et gestion des offres, suivi des candidatures reçues
- **Enseignants** : Validation des offres, suivi des étudiants, gestion du référentiel
- **Secrétaires** : Gestion des étudiants de leur groupe, validation des attestations RC
- **Administrateurs** : Gestion des groupes, création des comptes enseignants/secrétaires, archivage annuel

## 🛠️ Technologies

### Backend
- **Node.js** avec **Express 5**
- **TypeScript**
- **PostgreSQL** avec vues et triggers
- **JWT** pour l'authentification
- **bcrypt** pour le hashage des mots de passe

### Frontend
- **HTML5** / **CSS3** avec **Tailwind CSS**
- **JavaScript** vanilla
- Design responsive

## 📁 Structure du projet

```
csi_candidapp/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuration base de données
│   │   ├── controllers/    # Logique métier
│   │   ├── enums/          # Énumérations TypeScript
│   │   ├── routes/         # Routes API
│   │   ├── services/       # Services (auth, etc.)
│   │   ├── types/          # Types TypeScript
│   │   └── server.ts       # Point d'entrée
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── js/                 # Scripts JavaScript
│   └── *.html              # Pages HTML
├── schema.sql              # Schéma de base de données
└── package.json
```

## 🚀 Installation

### Prérequis
- Node.js (v18+)
- PostgreSQL (v14+)
- npm ou yarn

### Configuration de la base de données

1. Créer une base de données PostgreSQL
2. Exécuter le script `schema.sql` pour créer les tables, vues et triggers

```bash
psql -U votre_utilisateur -d votre_base -f schema.sql
```

### Configuration du backend

1. Accéder au dossier backend :
```bash
cd backend
```

2. Installer les dépendances :
```bash
npm install
```

3. Créer un fichier `.env` avec les variables suivantes :
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=votre_base
DB_USER=votre_utilisateur
DB_PASSWORD=votre_mot_de_passe
```

4. Lancer le serveur en mode développement :
```bash
npm run dev
```

Ou en mode production :
```bash
npm start
```

## 📡 API Endpoints

| Route | Description |
|-------|-------------|
| `/api/auth` | Authentification (login, register, check) |
| `/api/utilisateurs` | Gestion des utilisateurs |
| `/api/offres` | Gestion des offres |
| `/api/candidatures` | Gestion des candidatures |
| `/api/enseignant` | Fonctionnalités enseignant |
| `/api/dashboard/secretaire` | Fonctionnalités secrétaire |
| `/api/entreprise` | Fonctionnalités entreprise |
| `/api/etudiant` | Fonctionnalités étudiant |
| `/api/attestation-rc` | Gestion des attestations RC |
| `/api/notifications` | Système de notifications |
| `/api/admin` | Fonctionnalités administrateur |

## 👥 Rôles et permissions

| Rôle | Accès |
|------|-------|
| ETUDIANT | Profil, offres validées, candidatures, attestation RC |
| ENTREPRISE | Dashboard, création d'offres, gestion des candidatures |
| ENSEIGNANT | Dashboard, validation des offres, référentiel, archives |
| SECRETAIRE | Dashboard, gestion des étudiants, validation RC |
| ADMIN | Dashboard, gestion des groupes, archivage annuel |

## 📝 Licence

Projet académique - Master MIAGE - Université de Lorraine. Non destiné à un usage commercial.
