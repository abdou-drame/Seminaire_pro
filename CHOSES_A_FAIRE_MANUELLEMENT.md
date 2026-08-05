# LISTE STRICTE DES CHOSES A FAIRE MANUELLEMENT DE VOTRE COTE

**Projet** : SeminairePro — Plateforme B2B de réservation d'hôtels et d'espaces professionnels  
**Objet** : Inventaire exclusif des démarches externes et configurations réelles que vous devez effectuer manuellement de votre côté (hors code) pour rendre la plateforme opérationnelle.

---

## 📌 RÉCAPITULATIF DES 7 CHOSES À FAIRE MANUELLEMENT

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                TOUTES LES CHOSES A FAIRE MANUELLEMENT                            │
├────────────────────────────┬─────────────────────────────────┬───────────────────────────────────┤
│ DOMAINE                    │ CE QUE VOUS DEVEZ FAIRE         │ POURQUOI C'EST NÉCESSAIRE ?       │
├────────────────────────────┼─────────────────────────────────┼───────────────────────────────────┤
│ 1. Wave Mobile Money       │ Obtenir la clé marchande Wave   │ Encaissements réels Wave Sénégal  │
│ 2. Orange Money Sénégal    │ Obtenir les clés Client Orange  │ Encaissements réels Orange Money  │
│ 3. Carte & Géolocalisation │ Obtenir la clé Google Maps API  │ Affichage carte GPS sur le web    │
│ 4. Notifications Email     │ Ouvrir compte SMTP (Brevo)      │ Envoi d'emails réels aux clients  │
│ 5. Nom de Domaine & SSL    │ Acheter le domaine (.sn) + HTTPS│ Exigé par les webhooks Wave/Orange│
│ 6. Base de Données en Ligne│ Créer le serveur PostgreSQL     │ Stockage des données 24h/24h      │
│ 7. Clé Sécurité JWT        │ Générer la clé secrète JWT      │ Cryptage sécurisé des connexions  │
└────────────────────────────┴─────────────────────────────────┴───────────────────────────────────┘
```

---

### 1. Clé API Marchande Wave Mobile Money Sénégal 📲

- **QUOI FAIRE ?** : Vous inscrire sur le portail Wave Business et obtenir votre clé d'API marchande de production (`WAVE_API_KEY`).
- **POURQUOI LE FAIRE ?** : Le backend est codé pour traiter les paiements Wave. Sans votre propre clé marchande Wave entreprise Sénégal, vous ne pourrez pas recevoir l'argent des réservations sur votre compte Wave.
- **COMMENT LE FAIRE ?** :
  1. Allez sur **[https://business.wave.com](https://business.wave.com)**.
  2. Créez un compte entreprise avec le NINEA / Registre de Commerce de SeminairePro.
  3. Dans votre tableau de bord Wave, cliquez sur **Développeurs / Clés API**.
  4. Copiez votre clé d'API et collez-la dans votre fichier `.env` :
     ```env
     WAVE_API_KEY=wave_live_pk_votre_cle_wave_reelle
     ```

---

### 2. Identifiants API Orange Money Sénégal 🍊

- **QUOI FAIRE ?** : Demander vos identifiants marchands Orange Money (`ORANGE_MONEY_CLIENT_ID` et `ORANGE_MONEY_CLIENT_SECRET`).
- **POURQUOI LE FAIRE ?** : Le backend prend en charge la passerelle Orange Money. Ces clés sont indispensables pour valider automatiquement les encaissements des clients par Orange Money.
- **COMMENT LE FAIRE ?** :
  1. Allez sur le portail **[https://developer.orange.com](https://developer.orange.com)**.
  2. Souscrivez à l'API **Orange Money Web Payment (Sénégal)**.
  3. Récupérez le `Client ID` et le `Client Secret` fournis par Orange et collez-les dans `.env` :
     ```env
     ORANGE_MONEY_CLIENT_ID=votre_client_id_orange
     ORANGE_MONEY_CLIENT_SECRET=votre_client_secret_orange
     ```

---

### 3. Clé API Cartographie & Géolocalisation Google Maps 🗺️

- **QUOI FAIRE ?** : Créer une clé d'API Google Maps (`GOOGLE_MAPS_API_KEY`).
- **POURQUOI LE FAIRE ?** : Le backend calcule les distances GPS (formule Haversine), mais pour afficher la carte interactive sur le site web (le frontend), Google exige une clé d'API valide pour autoriser le rendu visuel de la carte.
- **COMMENT LE FAIRE ?** :
  1. Allez sur **[https://console.cloud.google.com](https://console.cloud.google.com)**.
  2. Créez un projet et activez l'API **Maps JavaScript API**.
  3. Générez une clé d'API et gardez-la pour la transmettre au développeur Frontend.

---

### 4. Serveur d'Emails Transactionnels & Validation de Domaine ✉️

- **QUOI FAIRE ?** : Ouvrir un compte d'envoi d'emails (ex: Brevo ou SendGrid) et obtenir les identifiants SMTP.
- **POURQUOI LE FAIRE ?** : Pour que les notifications courriels (relances de devis, confirmations de réservation, réinitialisation de mot de passe) arrivent réellement dans la boîte de réception de vos clients sans être bloquées par les anti-spams.
- **COMMENT LE FAIRE ?** :
  1. Inscrivez-vous sur **[https://www.brevo.com](https://www.brevo.com)** (ex-Sendinblue).
  2. Ajoutez votre nom de domaine (ex: `seminairepro.sn`) et configurez les enregistrements DNS (DKIM / SPF).
  3. Récupérez le mot de passe SMTP et collez-le dans le fichier `.env` :
     ```env
     SMTP_HOST=smtp-relay.brevo.com
     SMTP_PORT=587
     SMTP_USER=votre_email_compte@domaine.com
     SMTP_PASS=votre_mot_de_passe_smtp
     SMTP_FROM="SeminairePro <no-reply@seminairepro.sn>"
     ```

---

### 5. Nom de Domaine Officiel & Certificat de Sécurité SSL (HTTPS) 🔒

- **QUOI FAIRE ?** : Réserver le nom de domaine officiel (ex: `seminairepro.sn` ou `.com`) et activer le HTTPS.
- **POURQUOI LE FAIRE ?** : Les APIs de paiement (Wave et Orange Money) **exigent obligatoirement** une adresse web sécurisée en `https://` pour vous envoyer la confirmation automatique de chaque paiement (les Webhooks).
- **COMMENT LE FAIRE ?** :
  1. Achetez le nom de domaine chez l'NIC Sénégal ou un registrar.
  2. Activez le certificat SSL gratuit (Let's Encrypt ou Cloudflare) pour sécuriser le nom de domaine avec le cadenas vert.

---

### 6. Base de Données PostgreSQL en Ligne 🗄️

- **QUOI FAIRE ?** : Héberger une base de données PostgreSQL sur un serveur en ligne sécurisé 24h/24.
- **POURQUOI LE FAIRE ?** : Pour que les données des hôtels, réservations et paiements restent sauvegardées en toute sécurité sur un serveur distant permanent.
- **COMMENT LE FAIRE ?** :
  1. Créez une base de données PostgreSQL sur un service hébergé (ex: **Supabase**, **Render**, **Neon.tech** ou un serveur VPS).
  2. Copiez l'adresse de la base de données dans votre `.env` :
     ```env
     DATABASE_URL="postgresql://user:password@votre-serveur-db:5432/seminairepro?sslmode=require"
     ```
  3. Exécutez la commande suivante dans le terminal pour créer la structure des 22 tables :
     ```bash
     npx prisma migrate deploy
     ```

---

### 7. Clé Secrète de Sécurité JWT 🔑

- **QUOI FAIRE ?** : Générer une clé secrète de sécurité forte pour la variable `JWT_SECRET`.
- **POURQUOI LE FAIRE ?** : Pour sécuriser le cryptage de toutes les sessions et jetons de connexion des utilisateurs de la plateforme contre le piratage.
- **COMMENT LE FAIRE ?** :
  1. Inventez ou géneréz une chaîne de caractères aléatoire complexe de 64 caractères.
  2. Mettez-la dans votre `.env` :
     ```env
     JWT_SECRET=votre_chaine_secrete_ultra_complexe_2026
     ```

---

**Ce document récapitule 100 % des démarches manuelles réelles que vous devez accomplir de votre côté.**  
Fichier enregistré sous : `CHOSES_A_FAIRE_MANUELLEMENT.md`
