# GUIDE OFFICIEL DES ACTIONS MANUELLES — SEMINAIREPRO VERSION 1 (MVP)
## (Toutes les démarches à effectuer par l'administrateur, le pourquoi et le comment)

**Projet** : SeminairePro — Backend API Engine (Version 1.0)  
**Auteur** : Lead Backend Architect  
**Destinataire** : Porteur du Projet / Administrateur Système  
**Objet** : Manuel complet de configuration et d'exploitation manuelle pour faire fonctionner 100 % des fonctionnalités V1.

---

## 📑 TABLE DES MATIÈRES DES ACTIONS MANUELLES V1

1. **[Action 1] Configuration des Paiements Mobile Money (Wave & Orange Money)**
2. **[Action 2] Configuration du Serveur SMTP d'Envoi d'Emails Transactionnels**
3. **[Action 3] Création et Migration de la Base de Données PostgreSQL**
4. **[Action 4] Définition du Premier Compte Super-Administrateur**
5. **[Action 5] Validation Administrative des Hôtels Inscrit (Workflow de Publication)**
6. **[Action 6] Alimentation de l'Inventaire d'un Hôtel (Salles, Dispositions & Chambres)**
7. **[Action 7] Approbation Interne des Réservations par les Organisations**
8. **[Action 8] Modération Administrative des Avis Clients Post-Événement**

---

### 1. Configuration des Paiements Mobile Money (Wave & Orange Money) 💳

#### 🎯 QUOI FAIRE ?
Obtenir vos clés marchand réelles ou de test chez **Wave Sénégal** et **Orange Money**, puis les inscrire dans le fichier `.env` du backend.

#### ❓ POURQUOI LE FAIRE ?
Dans le backend développée (Module 7 - `PaymentService`), lorsque le client choisit de payer sa facture par Wave ou Orange Money, le code déclenche la transaction et attend le retour du Webhook (`POST /payments/webhook/wave` ou `orange`). Sans ces clés dans le `.env`, la passerelle de paiement renverra une erreur d'authentification.

#### 🛠️ COMMENT LE FAIRE (Pas-à-Pas) ?
1. **Pour Wave Mobile Money** :
   - Rendez-vous sur le site **[https://business.wave.com](https://business.wave.com)** et créez un compte marchand.
   - Accédez à la section **API / Développeurs** et copiez votre clé secrète (`wave_live_pk_...` ou `wave_test_pk_...`).
   - Ouvrez votre fichier `.env` à la racine du backend et collez :
     ```env
     WAVE_API_KEY=wave_live_pk_votre_cle_ici
     ```
2. **Pour Orange Money Sénégal** :
   - Rendez-vous sur **[https://developer.orange.com](https://developer.orange.com)**.
   - Sélectionnez l'API **Orange Money Web Payment (Sénégal)** et récupérez votre `Client ID` et `Client Secret`.
   - Dans le fichier `.env`, ajoutez :
     ```env
     ORANGE_MONEY_CLIENT_ID=votre_client_id_orange
     ORANGE_MONEY_CLIENT_SECRET=votre_client_secret_orange
     ```

---

### 2. Configuration du Serveur SMTP d'Envoi d'Emails ✉️

#### 🎯 QUOI FAIRE ?
Configurer les coordonnées d'un serveur d'envoi d'emails transactionnels (ex: Brevo, SendGrid ou Google Workspace).

#### ❓ POURQUOI LE FAIRE ?
Dans le backend (`NotificationService`), chaque événement clé (confirmation d'inscription, envoi de devis, relance automatique RFQ, réinitialisation de mot de passe) déclenche une notification. Renseigner le serveur SMTP permet d'expédier ces emails directement dans la boîte de réception des clients.

#### 🛠️ COMMENT LE FAIRE (Pas-à-Pas) ?
1. Créez un compte gratuit sur **Brevo** ([https://www.brevo.com](https://www.brevo.com)) ou **SendGrid**.
2. Récupérez vos identifiants SMTP dans les paramètres de votre compte (Hôte, Port 587, Login, Mot de passe API).
3. Ouvrez le fichier `.env` du backend et renseignez les valeurs :
   ```env
   SMTP_HOST=smtp-relay.brevo.com
   SMTP_PORT=587
   SMTP_USER=votre_email_compte@domaine.com
   SMTP_PASS=votre_cle_smtp_secrete
   SMTP_FROM="SeminairePro <no-reply@seminairepro.sn>"
   ```

---

### 3. Création et Migration de la Base de Données PostgreSQL 🗄️

#### 🎯 QUOI FAIRE ?
Installer ou connecter une base de données PostgreSQL et exécuter la structure des 22 tables.

#### ❓ POURQUOI LE FAIRE ?
Le backend utilise **Prisma ORM**. Pour que les utilisateurs, hôtels, devis et réservations puissent être sauvegardés de manière permanente, la base de données doit être initialisée avec le schéma Prisma (`prisma/schema.prisma`).

#### 🛠️ COMMENT LE FAIRE (Pas-à-Pas) ?
1. Installez PostgreSQL sur votre machine ou utilisez un service PostgreSQL hébergé en ligne (ex: Supabase, Render ou Neon.tech).
2. Dans le fichier `.env`, mettez votre lien de connexion :
   ```env
   DATABASE_URL="postgresql://postgres:mot_de_passe@localhost:5432/seminairepro?schema=public"
   ```
3. Lancez la commande suivante dans votre terminal pour créer automatiquement les tables :
   ```bash
   npx prisma migrate deploy
   ```

---

### 4. Définition du Premier Compte Super-Administrateur 👑

#### 🎯 QUOI FAIRE ?
Attribuer le rôle `SUPER_ADMIN` au premier utilisateur inscrit.

#### ❓ POURQUOI LE FAIRE ?
Toutes les routes d'administration (`/api/v1/admin/*`), la validation des hôtels, les rapports de commissions et les journaux d'audit de sécurité sont protégés par le middleware RBAC `authorizeRoles(["SUPER_ADMIN"])`. Sans au moins un compte Super Admin, il est impossible de valider les établissements partenaires.

#### 🛠️ COMMENT LE FAIRE (Pas-à-Pas) ?
1. Inscrivez un compte utilisateur via l'API ou le formulaire d'inscription.
2. Ouvrez l'interface visuelle de gestion de la base de données en tapant :
   ```bash
   npx prisma studio
   ```
3. Dans la table **User**, trouvez votre compte, modifiez la colonne `globalRole` pour remplacer `"USER"` par `"SUPER_ADMIN"`, puis cliquez sur **Save Changes**.

---

### 5. Validation Administrative des Hôtels Inscrit (Publication) 🏨

#### 🎯 QUOI FAIRE ?
Approuver manuellement la fiche de chaque nouvel hôtel qui s'inscrit sur la plateforme.

#### ❓ POURQUOI LE FAIRE ?
Dans le code backend (`AuthService.registerHotel`), lorsqu'un hôtel crée son compte, sa fiche est enregistrée avec le statut `PENDING_VALIDATION`. Conformément à la règle de sécurité #1 du cahier des charges, **un hôtel n'apparaît pas dans les recherches publiques** tant que l'administration SeminairePro n'a pas vérifié ses documents légaux (NINEA, RCCM) et validé sa fiche.

#### 🛠️ COMMENT LE FAIRE (Pas-à-Pas) ?
1. Récupérez le token JWT de votre compte `SUPER_ADMIN`.
2. Effectuez un appel API :
   - **Méthode** : `POST`
   - **URL** : `http://localhost:5000/api/v1/admin/hotels/{ID_DE_L_HOTEL}/validate`
   - **Body JSON** : `{ "approve": true }`
3. Le statut de l'hôtel passe immédiatement à `ACTIVE` et sa fiche devient trouvable sur la carte GPS et dans le moteur de recherche.

---

### 6. Saisie de l'Inventaire d'un Hôtel (Salles, Dispositions & Chambres) 📐

#### 🎯 QUOI FAIRE ?
Ajouter au moins une salle de réunion et des catégories de chambres pour l'hôtel partenaire.

#### ❓ POURQUOI LE FAIRE ?
Pour qu'une organisation puisse faire une demande de devis (`RFQ-XXXX`) ou poser une option de réservation (`OPTION_HELD`), le système backend a besoin d'identifiants de salles réelles (`meetingRoomId`) avec leurs capacités (Théâtre, Classe, U) afin de vérifier l'anti-double réservation et calculer les montants.

#### 🛠️ COMMENT LE FAIRE (Pas-à-Pas) ?
1. Avec le compte de l'hôtel (`HOTEL_ADMIN`), faites une requête API :
   - **Méthode** : `POST`
   - **URL** : `http://localhost:5000/api/v1/establishments/meeting-rooms`
   - **Body JSON** :
     ```json
     {
       "name": "Salle Teranga",
       "surfaceSqm": 150,
       "dayRateCfa": 250000,
       "halfDayRateCfa": 150000,
       "capacities": [
         { "layoutType": "THEATRE", "maxCapacity": 120 },
         { "layoutType": "U_SHAPE", "maxCapacity": 45 }
       ]
     }
     ```
2. Ajoutez le stock de chambres via `POST /api/v1/establishments/bedrooms`.

---

### 7. Approbation Interne des Réservations par les Organisations ✍️

#### 🎯 QUOI FAIRE ?
Signer et valider électroniquement une demande de réservation au sein de l'organisation client.

#### ❓ POURQUOI LE FAIRE ?
Dans le module 6 (`ReservationService`), lorsqu'un chargé de logistique pose une option temporaire, la réservation passe au statut `PENDING_APPROVAL_LOGISTICS` puis `PENDING_APPROVAL_FINANCE`. Elle reste bloquée et ne peut pas être payée ni émettre de Facture Pro Forma sans l'accord explicite des valideurs internes de l'entreprise.

#### 🛠️ COMMENT LE FAIRE (Pas-à-Pas) ?
1. Se connecter avec le compte du responsable logistique (`ORG_LOGISTICS`) ou financier (`ORG_FINANCE`).
2. Effectuer l'appel API :
   - **Méthode** : `POST`
   - **URL** : `http://localhost:5000/api/v1/reservations/approve`
   - **Body JSON** :
     ```json
     {
       "reservationId": "UUID_DE_LA_RESERVATION",
       "decision": "APPROVED",
       "comments": "Validation conforme au budget annuel."
     }
     ```
3. La réservation passe au statut `APPROVED`, ce qui débloque la génération de la Facture Pro Forma et le bouton de paiement.

---

### 8. Modération Administrative des Avis Clients Post-Événement 💬

#### 🎯 QUOI FAIRE ?
Approuver manuellement un avis rédigé par un client après la tenue de son séminaire.

#### ❓ POURQUOI LE FAIRE ?
Dans le code `ReviewService`, tout nouvel avis déposé par un client est enregistré avec `isModerated: false` afin d'éviter la publication de propos inappropriés ou diffamatoires. L'avis et les notes (WiFi, Restauration, Service) restent masqués du profil public de l'hôtel tant qu'ils n'ont pas été relus et modérés.

#### 🛠️ COMMENT LE FAIRE (Pas-à-Pas) ?
1. Avec le compte Admin/Modérateur, effectuez l'appel API :
   - **Méthode** : `PUT`
   - **URL** : `http://localhost:5000/api/v1/reviews/{REVIEW_ID}/moderate`
   - **Body JSON** : `{ "approve": true }`
2. L'avis bascule à `isModerated: true` et met à jour automatiquement la note moyenne de l'établissement.

---

## 📊 RECAPITULATIF GENERAL DES ACTIONS V1

| Action | QUOI FAIRE ? | POURQUOI LE FAIRE ? | COMMENT LE FAIRE ? |
| :--- | :--- | :--- | :--- |
| **1. Paiements** | Mettre les clés Wave & OM dans `.env`. | Autoriser les paiements Mobile Money. | Éditer le fichier `.env`. |
| **2. Emails SMTP** | Configurer l'hôte SMTP dans `.env`. | Expédier les emails de confirmation et relances. | Éditer le fichier `.env`. |
| **3. Base de Données** | Créer la DB & lancer les migrations. | Stocker les 22 tables de la plateforme. | `npx prisma migrate deploy`. |
| **4. Super Admin** | Mettre un utilisateur en `SUPER_ADMIN`. | Débloquer l'accès d'administration. | Via `npx prisma studio`. |
| **5. Validation Hôtel** | Valider la fiche des nouveaux hôtels. | Rendre l'hôtel visible aux clients. | API `POST /admin/hotels/:id/validate`. |
| **6. Inventaire Hôtel** | Ajouter des salles et chambres. | Permettre les devis et réservations. | API `POST /establishments/meeting-rooms`. |
| **7. Validation Client** | Signer la réservation en interne. | Débloquer la facture et le paiement. | API `POST /reservations/approve`. |
| **8. Modération Avis** | Approuver les retours clients. | Afficher l'avis et la note sur la fiche hôtel. | API `PUT /reviews/:id/moderate`. |

---

**Ce document récapitule 100 % des actions manuelles d'exploitation de la Version 1 !**  
Fichier enregistré sous : `GUIDE_DES_ACTIONS_MANUELLES_V1.md`
