# DOCUMENTATION TECHNIQUE — PHASE 1 : MODÉLISATION DB, ENTITÉS & ARCHITECTURE SYSTÈME

**Projet** : SeminairePro — Plateforme B2B de réservation d'hôtels et d'espaces professionnels  
**Auteur** : Lead Backend Architect & Senior Software Engineer  
**Date** : Août 2026  
**Version Document** : 1.0 (Phase 1)  

---

## 1. Présentation & Objectifs de la Phase 1

La **Phase 1** constitue le socle fondamental du backend de la plateforme **SeminairePro**. Conformément aux exigences du cahier des charges fonctionnel (v1.0), cette phase couvre l'analyse métier, la définition de l'architecture logicielle, le dictionnaire de données, le schéma relationnel de la base de données, la stratégie d'indexation et la prévention des conflits de réservation.

---

## 2. Stack Technique Sélectionnée & Justifications

| Composant | Technologie | Justification Technique |
| :--- | :--- | :--- |
| **Langage & Environnement** | **Node.js (v20+) avec TypeScript** | Typer rigoureusement les objets métier, interfaces et DTOs ; assurer la maintenabilité et la détection d'erreurs à la compilation. |
| **Framework HTTP** | **Express.js** | Léger, robuste, extensible, idéal pour une Clean Architecture (Middlewares, Services, Repositories). |
| **Base de Données** | **PostgreSQL (v15+)** | Système de gestion de base de données relationnelle puissant, conforme ACID, supportant les requêtes géospatiales (PostGIS) et les verrous transactionnels. |
| **ORM / Query Builder** | **Prisma ORM (v5+)** | Migrations déclaratives, autocomplétion TypeScript native, sécurité contre les injections SQL et transactions ACID fiables. |
| **Sécurité & Hashage** | **Argon2 + JWT** | Hashage moderne des mots de passe (conforme OWASP) et authentification Stateless via tokens JWT (AccessToken & RefreshToken). |

---

## 3. Dictionnaire de Données Métier

Le modèle de données s'articule autour de 6 grands sous-systèmes représentant **22 entités** et **12 énumérations** :

### 3.1. Sub-system 1 : Gestion de l'Identité & RBAC (Role-Based Access Control)
- **`User`** : Compte utilisateur global (Email, Téléphone, Password Hash Argon2, Statut, 2FA TOTP).
- **`Organization`** : Compte institutionnel client (Raison sociale, NINEA, RCCM, Adresse, Logo, Workflow d'approbation actif).
- **`OrganizationUser`** : Table de jointure attribuant un rôle spécifique dans une organisation (`ORG_ADMIN`, `ORG_REQUESTER`, `ORG_LOGISTICS`, `ORG_FINANCE`, `ORG_APPROVER`, `ORG_VIEWER`).
- **`Establishment`** : Établissement partenaire / Hôtel (Nom, Type, Standing, NINEA, Géolocalisation Lat/Lng, Formule d'abonnement, Statut de validation admin).
- **`EstablishmentUser`** : Table de jointure attribuant un rôle spécifique dans un hôtel (`HOTEL_ADMIN`, `HOTEL_COMMERCIAL`, `HOTEL_RESERVATION`, `HOTEL_FINANCE`, `HOTEL_RECEPTION`).
- **`Subscription`** : Niveaux d'abonnement partenaire (`GRATUITE`, `STANDARD`, `PROFESSIONNELLE`, `PREMIUM`).

### 3.2. Sub-system 2 : Inventaire & Offres Hôtelières
- **`MeetingRoom`** : Salles de réunion (Superficie m², Tarifs demi-journée/journée, Statut).
- **`RoomLayout`** : Capacités d'accueil par disposition (`THEATRE`, `CLASSROOM`, `U_SHAPE`, `BOARDROOM`, `BANQUET`, `COCKTAIL`).
- **`Bedroom`** : Chambres d'hôtel (Type de chambre, Stock disponible, Prix par nuitée).
- **`Equipment`** : Équipements audiovisuels et logistiques (Projecteur, Sonorisation, WiFi, Groupe électrogène).
- **`CateringOption`** : Formules de restauration (Pause-café, Déjeuner buffet, Dîner gala).
- **`Package`** : Forfaits combinés (Journée d'étude, Semi-résidentiel, Résidentiel, VIP).
- **`AvailabilityBlock`** : Gestion des indisponibilités, réservations externes et coefficients tarifaires saisonniers.

### 3.3. Sub-system 3 : Demandes de Devis (RFQs) & Offres Commerciales
- **`EventRequest`** : Demande d'événement initiée par l'organisation (Intitulé, Dates, Participants, Chambres, Budget prévisionnel, Statut).
- **`EventRequestTarget`** : Ciblage multi-hôtels d'une même demande de devis.
- **`Quote`** : Devis officiel proposé par l'hôtel (Décomposition des coûts, Remises, Date limite de validité, Statut).

### 3.4. Sub-system 4 : Réservations & Workflow d'Approbation Internes
- **`Reservation`** : Réservation / Option posée (Numéro unique `RES-xxxx`, Dates, Prix total, Acompte, Statut de la réservation, Date d'expiration de l'option).
- **`ReservationApproval`** : Historique horodaté des validations internes par niveau (Demandeur, Finance, Direction).

### 3.5. Sub-system 5 : Facturation, Paiements & Commissions
- **`Invoice`** : Documents financiers générés (`PRO_FORMA`, `FACTURE_DEFINITIVE`, `BON_DE_COMMANDE`, `CONTRAT`, etc.).
- **`Payment`** : Transactions financières (Méthodes : `MOBILE_MONEY_WAVE`, `MOBILE_MONEY_ORANGE`, `MOBILE_MONEY_FREE`, `CREDIT_CARD`, `BANK_TRANSFER`, `CHECK`).
- **`Commission`** : Calcul automatique des commissions dues à la plateforme SeminairePro selon le contrat de l'hôtel.

### 3.6. Sub-system 6 : Messagerie, Évaluations & Audit
- **`Message`** : Fil de discussion interne sécurisé par demande/devis avec pièces jointes.
- **`Notification`** : Alertes multi-canaux (In-App, Email, SMS).
- **`Review`** : Évaluations et notes vérifiées post-événement (Accueil, Salle, Chambres, Restauration, WiFi, Qualité/Prix).
- **`AuditLog`** : Traçabilité et journalisation de toutes les mutations sensibles (IP, Utilisateur, Action, Avant/Après).

---

## 4. Schéma Relationnel Prisma (`prisma/schema.prisma`)

Le fichier [prisma/schema.prisma](file:///c:/Users/Moi/Desktop/SEMINAIREE_PRO/prisma/schema.prisma) contient l'implémentation DDL complète du modèle ci-dessus.

### Principales Énumérations (Types Métier) :
- **GlobalRole** : `SUPER_ADMIN`, `ADMIN_FUNCTIONAL`, `PARTNER_MANAGER`, `FINANCIAL_MANAGER`, `SUPPORT_AGENT`, `MODERATOR`, `USER`.
- **EstablishmentType** : `HOTEL`, `RESIDENCE_HOTELIERE`, `AUBERGE_PROFESSIONNELLE`, `CENTRE_CONFERENCE`, `SALLE_INDEPENDANTE`, `ESPACE_EVENEMENTIEL`.
- **ReservationStatus** : `DRAFT`, `PENDING_INTERNAL_APPROVAL`, `OPTION_HELD`, `CONFIRMED`, `DEPOSIT_PAID`, `FULLY_PAID`, `ACTIVITE_REALISEE`, `CANCELLED`, `CLOTUREE`.

---

## 5. Règles de Gestion Métier & Prévention des Conflits

### 5.1. Règle Anti-Double Réservation (Garantie Règle de Gestion #2)
Afin d'empêcher toute surréservation d'une même salle aux mêmes dates, le backend applique un contrôle transactionnel strict avant l'attribution d'une option ou d'une confirmation :

$$\text{Overlap} \iff (\text{Reservation.Start} < \text{Requested.End}) \land (\text{Reservation.End} > \text{Requested.Start})$$

Si une réservation existe déjà avec un statut $\in \{\text{OPTION\_HELD}, \text{CONFIRMED}, \text{DEPOSIT\_PAID}, \text{FULLY\_PAID}\}$, la transaction rejette la demande avec une erreur explicite `DOUBLE_BOOKING_CONFLICT`.

### 5.2. Isolation Multi-Tenant & RBAC Strict
Chaque organisation et chaque hôtel n'accèdent qu'à leurs propres données. Le middleware RBAC vérifie les jetons JWT et restreint les accès selon les rôles `ORG_*` ou `HOTEL_*`.

---

## 6. Stratégie d'Indexation & Performance

Pour garantir des temps de réponse rapides (< 200 ms) même sous forte charge, les index suivants sont configurés :
1. **Recherche multicritère** : `(city, status)` et `(standing_stars)` sur `establishments`.
2. **Disponibilité des salles** : `(meeting_room_id, start_date, end_date, status)` sur `reservations`.
3. **Sécurité et Audit** : `(user_id, created_at)` sur `audit_logs`.

---

## 7. Fichiers & Livrables de la Phase 1

- 📂 [cahier_des_charges.md](file:///c:/Users/Moi/Desktop/SEMINAIREE_PRO/cahier_des_charges.md) — Documentation intégrale des exigences
- 📂 [prisma/schema.prisma](file:///c:/Users/Moi/Desktop/SEMINAIREE_PRO/prisma/schema.prisma) — Définition ORM et entités PostgreSQL
- 📂 [package.json](file:///c:/Users/Moi/Desktop/SEMINAIREE_PRO/package.json) — Dépendances et scripts de build/migration
- 📂 [.env.example](file:///c:/Users/Moi/Desktop/SEMINAIREE_PRO/.env.example) — Configuration des variables d'environnement
- 📂 [DOCUMENTATION_PHASE1.md](file:///c:/Users/Moi/Desktop/SEMINAIREE_PRO/DOCUMENTATION_PHASE1.md) — Le présent document d'architecture complète

---

**La Phase 1 est intégralement documentée et validée.**  
Prêt pour la **Phase 2 : Spécification des APIs, DTOs & Contrats d'Interface** sur instruction.
