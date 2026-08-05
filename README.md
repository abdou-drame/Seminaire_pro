# 🏢 SeminairePro — Backend API Engine

**SeminairePro** est une plateforme marketplace B2B avancée dédiée à la recherche, la comparaison, la réservation et la facturation d'hôtels, de salles de séminaires, de chambres et de services événementiels professionnels au Sénégal et en Afrique de l'Ouest.

---

## 🚀 Fonctionnalités & Modules Métier

Le backend intègre **8 modules fonctionnels** développés en **Clean Architecture** :

1. **🔐 Module 1 : Authentification & Sécurité (`/api/v1/auth`)**
   - Inscription des Organisations & Hôtels, Hashage Argon2id, Tokens JWT Stateless, Password Reset, 2FA.
2. **🏢 Module 2 : Organisations Clients (`/api/v1/organizations`)**
   - Profil institutionnel, NINEA, gestion des collaborateurs et circuit de validation interne.
3. **📍 Module 3 : Établissements & Cartographie GPS (`/api/v1/establishments`)**
   - Recherche multicritère, **Recherche GPS par périmètre km (Formule Haversine)**, salles par disposition, chambres & forfaits.
4. **📑 Module 4 : Demandes de Devis (RFQ) & Messagerie (`/api/v1/event-requests`)**
   - Émission multi-hôtels (`RFQ-XXXX`), fil de discussion, **Génération de la Matrice Comparative**.
5. **🏷️ Module 5 : Offres Commerciales & Devis (`/api/v1/quotes`)**
   - Soumission de devis chiffrés (`DEV-XXXX`), dépréciation automatique des offres concurrentes (`SUPERSEDED`).
6. **🔒 Module 6 : Réservations & Anti-Double Réservation (`/api/v1/reservations`)**
   - Options temporaires (`OPTION_HELD`), **Verrou transactionnel Anti-Double Réservation**, circuit d'approbation 3 niveaux.
7. **💳 Module 7 : Factures & Paiements Mobile Money (`/api/v1/payments` & `/api/v1/invoices`)**
   - Factures Pro Forma & Définitives (TVA 18% FCFA), Webhooks Wave / Orange Money, **Commissions automatiques**.
8. **📊 Module 8 : Avis, Notifications & Admin (`/api/v1/admin`)**
   - Avis vérifiés post-événement, modération, notifs in-app, validation des hôtels, audit logs de sécurité.

---

## 🛠️ Stack Technique

- **Runtime** : Node.js (v18+)
- **Framework** : Express.js (TypeScript)
- **Base de données** : PostgreSQL + Prisma ORM (22 entités, 12 enums)
- **Sécurité** : Helmet HSTS, OWASP Input Sanitization (XSS), Rate Limiting, RBAC Guards, Argon2id
- **Tests** : Jest & Supertest (Suite d'intégration 100 % validée)

---

## 💻 Démarrage Rapide

### 1. Cloner le projet & Installer les dépendances
```bash
git clone https://github.com/votre-org/seminairepro-backend.git
cd seminairepro-backend
npm install
```

### 2. Variables d'Environnement
Copiez le fichier d'exemple `.env.example` vers `.env` et ajustez les paramètres :
```bash
cp .env.example .env
```

### 3. Exécuter les Migrations de la Base de Données
```bash
npx prisma migrate deploy
npx prisma generate
```

### 4. Démarrer le Serveur en Mode Développement
```bash
npm run dev
```
> Le serveur sera accessible sur : `http://localhost:5000/api/v1/health`

### 5. Lancer la Suite de Tests Automatisés
```bash
npm test
```

### 6. Compiler pour la Production
```bash
npm run build
```

---

## 📚 Index de la Documentation du Projet

- 📘 [EXPLICATION_PROJET_SEMINAIREPRO.md](file:///c:/Users/Moi/Desktop/SEMINAIREE_PRO/EXPLICATION_PROJET_SEMINAIREPRO.md) — Explication simple et scénario fonctionnel de bout en bout.
- 👨‍💻 [GUIDE_DEVELOPPEUR_FRONTEND.md](file:///c:/Users/Moi/Desktop/SEMINAIREE_PRO/GUIDE_DEVELOPPEUR_FRONTEND.md) — Guide complet d'intégration pour l'équipe Frontend Web.
- 📕 [GUIDE_DEPLOIEMENT_PRODUCTION.md](file:///c:/Users/Moi/Desktop/SEMINAIREE_PRO/GUIDE_DEPLOIEMENT_PRODUCTION.md) — Checklist et instructions de mise en ligne (PM2 & Nginx).
- 📜 [cahier_des_charges.md](file:///c:/Users/Moi/Desktop/SEMINAIREE_PRO/cahier_des_charges.md) — Spécifications fonctionnelles initiales.
- 📗 [DOCUMENTATION_PHASE1.md](file:///c:/Users/Moi/Desktop/SEMINAIREE_PRO/DOCUMENTATION_PHASE1.md) à [DOCUMENTATION_PHASE4.md](file:///c:/Users/Moi/Desktop/SEMINAIREE_PRO/DOCUMENTATION_PHASE4.md) — Documentation d'architecture par phase.

---

**© 2026 SeminairePro — Tous droits réservés.**
