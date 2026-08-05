# GUIDE ET CHECKLIST DES ACTIONS MANUELLES A EFFECTUER POUR LA MISE EN SERVICE REELLE

**Projet** : SeminairePro — Plateforme B2B de réservation d'hôtels et d'espaces professionnels  
**Auteur** : Lead Backend Architect  
**Destinataire** : Porteur du projet & Équipe technique  
**Document** : Manuel d'activation externe  

---

## 📋 Résumé des 5 Actions Manuelles Extérieures

Puisque le code source backend est 100 % terminé, compilé et testé, voici les **5 démarches manuelles administratives et techniques** que vous devez effectuer pour que la plateforme fonctionne réellement avec de vrais paiements, de vrais emails et un vrai nom de domaine.

---

### 1. Inscription & Clés API Wave Mobile Money Sénégal 📲
Pour permettre aux organisations de payer leurs acomptes et réserves par **Wave Mobile Money** :
- **Action Manuelle** :
  1. Créez un compte marchand entreprise sur le portail Wave Business Sénégal ([https://business.wave.com](https://business.wave.com)).
  2. Fournissez le NINEA et le Registre de Commerce de SeminairePro.
  3. Dans l'onglet **Développeurs / API**, générez votre **Clé d'API Production (`WAVE_API_KEY`)**.
  4. Renseignez l'URL du Webhook backend : `https://api.seminairepro.sn/api/v1/payments/webhook/wave`.
- **Fichier impacté** : Copiez la clé dans votre fichier `.env` (`WAVE_API_KEY=wave_live_...`).

---

### 2. Inscription & Clés API Orange Money Sénégal 🍊
Pour autoriser les paiements via **Orange Money Sénégal** :
- **Action Manuelle** :
  1. Rendez-vous sur le portail Orange Developer ([https://developer.orange.com](https://developer.orange.com)) ou contactez le service Orange Money Entreprises Sénégal.
  2. Demandez un accès à l'API **Orange Money Web Payment (SN)**.
  3. Récupérez vos deux identifiants secrets : **`ORANGE_MONEY_CLIENT_ID`** et **`ORANGE_MONEY_CLIENT_SECRET`**.
  4. Configurez l'URL de notification Webhook : `https://api.seminairepro.sn/api/v1/payments/webhook/orange`.
- **Fichier impacté** : Copiez les identifiants dans votre fichier `.env`.

---

### 3. Configuration du Serveur d'Envoi d'Emails (SMTP) ✉️
Pour que les emails d'inscription, de réinitialisation de mot de passe, de relance et de confirmation soient distribués dans la boîte de réception des clients :
- **Action Manuelle** :
  1. Créez un compte sur un fournisseur d'emails transactionnels (ex: **Brevo / Sendinblue**, **SendGrid**, **Mailgun** ou votre adresse professionnelle Google Workspace).
  2. Validez votre nom de domaine (ex: `seminairepro.sn`) avec les enregistrements DNS SPF & DKIM.
  3. Récupérez les identifiants SMTP : `SMTP_HOST`, `SMTP_PORT` (587), `SMTP_USER`, `SMTP_PASS`.
- **Fichier impacté** : Copiez ces variables dans votre fichier `.env`.

---

### 4. Création de la Base de Données PostgreSQL en Ligne 🗄️
Pour stocker les données en toute sécurité 24h/24h :
- **Action Manuelle** :
  1. Ouvrez un serveur de base de données PostgreSQL de production chez un hébergeur (ex: **Supabase**, **Render**, **Neon.tech**, **DigitalOcean** ou un serveur VPS privé).
  2. Récupérez la chaîne de connexion sécurisée `DATABASE_URL` (format: `postgresql://user:password@host:5432/seminairepro?sslmode=require`).
  3. Exécutez la commande de migration une fois la base connectée :
     ```bash
     npx prisma migrate deploy
     ```

---

### 5. Nom de Domaine & Certificat Sécurité SSL HTTPS 🔒
Pour avoir une adresse web propre et sécurisée (HTTPS) :
- **Action Manuelle** :
  1. Achetez votre nom de domaine chez l'NIC Sénégal ou un registrar (ex: `seminairepro.sn` ou `seminairepro.com`).
  2. Reliez les serveurs DNS à votre hébergeur web ou utilisez **Cloudflare** (gratuit).
  3. Activez le certificat SSL HTTPS (Certificat Let's Encrypt gratuit) pour garantir le cadenas vert sécurisé.

---

## 💡 Résumé Synthétique de votre Fichier `.env` Final en Production

Une fois vos 5 actions manuelles effectuées, votre fichier `.env` final sur le serveur ressemblera à ceci :

```env
# SERVER CONFIG
NODE_ENV=production
PORT=5000
API_PREFIX=/api/v1
CORS_ORIGIN=https://seminairepro.sn

# DATABASE POSTGRESQL (Action 4)
DATABASE_URL="postgresql://votre_user:votre_mot_de_passe@votre-serveur-db.com:5432/seminairepro_prod?sslmode=require"

# SECURE JWT
JWT_SECRET=chaine_secrete_ultra_securisee_seminairepro_2026

# PAYMENT GATEWAYS (Actions 1 & 2)
WAVE_API_KEY=wave_live_pk_votre_cle_reelle_senegal
ORANGE_MONEY_CLIENT_ID=votre_client_id_orange_reell
ORANGE_MONEY_CLIENT_SECRET=votre_client_secret_orange_reel

# EMAIL SMTP SERVER (Action 3)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.votre_cle_smtp_reelle
SMTP_FROM="SeminairePro <no-reply@seminairepro.sn>"
```

---

## 📌 Qu'avez-vous à faire aujourd'hui ?

Pendant que votre développeur frontend avance sur l'interface graphique sur la branche `feature/frontend`, vous pouvez commencer la création de vos comptes **Wave Business**, **Orange Money** et **Brevo/SendGrid** pour obtenir les clés API !

**Ce document récapitule toutes les étapes manuelles à effectuer hors code.**
