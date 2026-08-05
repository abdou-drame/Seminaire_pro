# ACTIONS MANUELLES BACKEND — VERSION MINIMALE (MVP)
## ("QUOI", "COMMENT" et "POURQUOI" pour chaque action)

**Projet** : SeminairePro — Backend API Engine  
**Objectif** : Explication détaillée des seules actions manuelles nécessaires au fonctionnement de la version minimale développée, avec la raison technique et la méthode exacte d'exécution.

---

### 1. Création du Premier Compte Super-Administrateur 👑

- **QUOI** : Transformer un compte utilisateur classique en compte `SUPER_ADMIN`.
- **POURQUOI (La raison technique)** : Les routes d'administration (`/api/v1/admin/*`), la validation des hôtels et les rapports financiers sont protégés par le middleware RBAC. Sans au moins un compte `SUPER_ADMIN`, personne ne peut valider les nouveaux hôtels ni accéder aux journaux d'audit.
- **COMMENT (La méthode)** :
  1. Inscrivez un utilisateur normal via `POST /api/v1/auth/register/organization` ou `/hotel`.
  2. Ouvrez l'outil visuel de base de données en exécutant la commande : `npx prisma studio`.
  3. Allez dans la table `User`, trouvez votre utilisateur et modifiez le champ `globalRole` de `"USER"` à `"SUPER_ADMIN"`.
  4. Enregistrez la modification.

---

### 2. Validation Administrative des Nouveaux Hôtels Partenaires 🏨

- **QUOI** : Approuver manuellement la fiche d'un hôtel inscrite sur la plateforme.
- **POURQUOI (La raison technique)** : Dans le code backend (`AuthService.registerHotel`), chaque nouvel hôtel s'inscrit avec le statut `PENDING_VALIDATION`. Pour respecter la règle de sécurité #1 du cahier des charges, l'hôtel est **masqué de la recherche publique** tant qu'il n'a pas été approuvé.
- **COMMENT (La méthode)** :
  1. Avec le token JWT de votre compte `SUPER_ADMIN`, faites une requête HTTP :
     `POST /api/v1/admin/hotels/{id_de_l_hotel}/validate`
  2. Envoyez le corps JSON : `{ "approve": true }`.
  3. Le statut de l'hôtel passe à `ACTIVE` et il devient immédiatement visible dans les recherches et sur la carte GPS.

---

### 3. Saisie du Catalogue Inventaire par l'Hôtel (Salles & Chambres) 📐

- **QUOI** : Ajouter au moins une salle de réunion avec sa disposition et des chambres sur l'hôtel.
- **POURQUOI (La raison technique)** : Le moteur de devis (`QuoteService`) et le verrou anti-double réservation (`ReservationService`) ont besoin d'identifiants de salles réelles (`meetingRoomId`) pour calculer les prix et vérifier les disponibilités de dates.
- **COMMENT (La méthode)** :
  1. Avec le token de l'hôtel (`HOTEL_ADMIN`), effectuez un appel API :
     `POST /api/v1/establishments/meeting-rooms`
  2. Envoyez la configuration de la salle (ex: Nom: *"Salle Teranga"*, Capacité Théâtre: 100, Surface: 120m²).
  3. Ajoutez les catégories de chambres via `POST /api/v1/establishments/bedrooms`.

---

### 4. Approbation Interne de la Réservation (Workflow 3 Niveaux) ✍️

- **QUOI** : Valider la réservation au sein de l'organisation client.
- **POURQUOI (La raison technique)** : Selon le cahier des charges, lorsqu'une organisation pose une option (`OPTION_HELD`), la réservation passe en statut `PENDING_APPROVAL_LOGISTICS` puis `PENDING_APPROVAL_FINANCE`. Elle ne peut pas être payée ni confirmée sans les signatures électroniques requises.
- **COMMENT (La méthode)** :
  1. Connectez-vous avec le compte du responsable logistique (`ORG_LOGISTICS`) ou financier (`ORG_FINANCE`).
  2. Effectuez l'appel API :
     `POST /api/v1/reservations/approve`
  3. Envoyez le payload JSON : `{ "reservationId": "uuid-...", "decision": "APPROVED", "comments": "Devis conforme au budget" }`.
  4. Le statut passe à `APPROVED`, autorisant l'émission de la facture Pro Forma et le paiement.

---

### 5. Modération Administrative des Avis Clients Post-Événement 💬

- **QUOI** : Valider la publication d'un avis client rédigé après un séminaire.
- **POURQUOI (La raison technique)** : Dans le code `ReviewService`, tout nouvel avis rédigé par un client est enregistré avec `isModerated: false` afin d'éviter les contenus diffamatoires ou abusifs. Il n'est pas affiché sur la fiche publique de l'hôtel tant qu'il n'est pas modéré.
- **COMMENT (La méthode)** :
  1. Avec le compte Admin/Modérateur, appelez l'API :
     `PUT /api/v1/reviews/{reviewId}/moderate`
  2. Envoyez le corps JSON : `{ "approve": true }`.
  3. L'avis passe à `isModerated: true` et met automatiquement à jour la note moyenne globale de l'établissement.

---

### 6. Renseignement des Clés de Simulation dans le Fichier `.env` 🔑

- **QUOI** : Inscrire les variables de configuration minimales dans le fichier `.env` local.
- **POURQUOI (La raison technique)** : Le backend a besoin de ces clés pour signer les tokens JWT d'authentification et simuler les webhooks de paiement Wave/Orange Money sans planter.
- **COMMENT (La méthode)** :
  Ouvrez le fichier `.env` à la racine de votre dossier et vérifiez qu'il contient au minimum :
  ```env
  PORT=5000
  API_PREFIX=/api/v1
  DATABASE_URL="postgresql://user:password@localhost:5432/seminairepro"
  JWT_SECRET="chaine_secrete_pour_les_tokens_jwt"
  ```

---

## 📊 Tableau Récapitulatif Synthétique

| Action Manuelle | QUOI FAIRE ? | POURQUOI LE FAIRE ? | COMMENT LE FAIRE ? |
| :--- | :--- | :--- | :--- |
| **1. Admin Initial** | Mettre un utilisateur en `SUPER_ADMIN`. | Débloquer l'accès aux API d'administration. | Via `npx prisma studio` (table User -> globalRole). |
| **2. Validation Hôtel** | Approuver un nouvel hôtel inscrit. | Rendre l'hôtel visible dans les recherches. | Appel API `POST /admin/hotels/:id/validate`. |
| **3. Inventaire Hôtel** | Ajouter salles et chambres à l'hôtel. | Permettre les devis et réservations. | Appel API `POST /establishments/meeting-rooms`. |
| **4. Validation Client** | Signer la demande de réservation. | Passer l'option temporaire en réservation payable. | Appel API `POST /reservations/approve`. |
| **5. Modération Avis** | Valider les retours clients. | Publier la note sur la fiche de l'hôtel. | Appel API `PUT /reviews/:id/moderate`. |
| **6. Secret JWT (.env)** | Renseigner `JWT_SECRET` dans `.env`. | Autoriser la création et la vérification des sessions. | Modifier le fichier `.env`. |

---

**Ce fichier est enregistré dans votre projet sous le nom : `EXPLICATIONS_ACTIONS_MANUELLES_MVP.md`.**
