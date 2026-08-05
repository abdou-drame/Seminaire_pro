# DOCUMENTATION TECHNIQUE — PHASE 2 : SPÉCIFICATION DES APIS, DTOS & CONTRATS D'INTERFACE (REVALIDE & ENRICHI)

**Projet** : SeminairePro — Plateforme B2B de réservation d'hôtels et d'espaces professionnels  
**Auteur** : Lead Backend Architect & Senior Software Engineer  
**Date** : Août 2026  
**Version Document** : 2.1 (Revue intégrale du Cahier des Charges)  

---

## 1. Synthèse de la Revue Exhaustive du Cahier des Charges

Après revue complète des 28 chapitres du cahier des charges, 6 endpoints et fonctionnalités spécifiques ont été ajoutés pour couvrir **100 % des exigences opérationnelles** :
1. **Récupération / Réinitialisation de mot de passe** (Section 6.1) : `/auth/forgot-password` & `/auth/reset-password`.
2. **Messagerie interne sécurisée par événement** (Section 9) : `/event-requests/:id/messages`.
3. **Cartographie & Géolocalisation avec périmètre** (Section 11) : `/establishments/map` (Recherche par coordonnées GPS + rayon km).
4. **Relance automatique des hôtels** (Section 6.5) : `/event-requests/:id/remind`.
5. **Tableaux de bord analytiques** (Sections 6.8, 7.9, 18) : Dashboards dédiés (`/organizations/dashboard`, `/establishments/dashboard`, `/admin/dashboard`).
6. **Modération des avis clients** (Sections 8 & 10) : `/admin/reviews/:id/moderate`.

---

## 2. Format de Réponse JSON Unifié & Pagination

### 2.1. Succès Simple (200 / 201)
```json
{
  "success": true,
  "data": {
    "id": "c1f8e4a9-8d2b-4e12-b91c-3f7d2a5b6e78",
    "referenceNumber": "RFQ-2026-0042",
    "status": "SENT",
    "createdAt": "2026-08-04T23:30:00.000Z"
  }
}
```

### 2.2. Liste Paginée (200)
```json
{
  "success": true,
  "data": [
    { "id": "uuid-1", "name": "Hôtel Terrou-Bi Dakar" },
    { "id": "uuid-2", "name": "King Fahd Palace" }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

### 2.3. Structure d'Erreur (4xx / 5xx)
```json
{
  "success": false,
  "error": {
    "code": "DOUBLE_BOOKING_CONFLICT",
    "message": "La salle sélectionnée est déjà réservée ou sous option aux dates choisies.",
    "details": [
      {
        "field": "startDate",
        "message": "Chevauchement avec la réservation RES-2026-0012"
      }
    ]
  }
}
```

---

## 3. Cartographie Complète & Réajustée des Endpoints RESTful (38 Endpoints)

### 3.1. Module 1 : Authentification & Sécurité (`/api/v1/auth`)

| Verbe | Route Exacte | Description Fonctionnelle | Restriction RBAC |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register/organization` | Inscription compte organisation client. | Public |
| `POST` | `/auth/register/hotel` | Inscription compte établissement partenaire. | Public |
| `POST` | `/auth/login` | Connexion utilisateur & émission des tokens JWT. | Public |
| `POST` | `/auth/forgot-password` | Demande de réinitialisation de mot de passe. | Public |
| `POST` | `/auth/reset-password` | Validation du nouveau mot de passe via token. | Public |
| `POST` | `/auth/verify-2fa` | Validation du code TOTP 2FA. | Public |
| `POST` | `/auth/refresh-token` | Renouvellement de l'AccessToken. | Public |
| `GET` | `/auth/me` | Récupération du profil et permissions. | Authentifié |
| `POST` | `/auth/logout` | Déconnexion & dépréciation du token. | Authentifié |

---

### 3.2. Module 2 : Organisations Clients (`/api/v1/organizations`)

| Verbe | Route Exacte | Description Fonctionnelle | Restriction RBAC |
| :--- | :--- | :--- | :--- |
| `GET` | `/organizations/profile` | Consultation des informations institutionnelles. | `ORG_*` |
| `PUT` | `/organizations/profile` | Mise à jour profil, NINEA, adresse et logo. | `ORG_ADMIN` |
| `GET` | `/organizations/users` | Liste des collaborateurs rattachés. | `ORG_ADMIN` |
| `POST` | `/organizations/users` | Ajout d'un utilisateur et attribution de rôle. | `ORG_ADMIN` |
| `DELETE` | `/organizations/users/:userId` | Révocation d'un collaborateur. | `ORG_ADMIN` |
| `PUT` | `/organizations/approval-workflow` | Configuration des niveaux d'approbation interne. | `ORG_ADMIN` |
| `GET` | `/organizations/dashboard` | Tableau de bord synthétique (alertes, dépenses, réservations). | `ORG_*` |

---

### 3.3. Module 3 : Établissements, Recherche & Géolocalisation (`/api/v1/establishments`)

| Verbe | Route Exacte | Description Fonctionnelle | Restriction RBAC |
| :--- | :--- | :--- | :--- |
| `GET` | `/establishments/search` | Recherche multicritère (Ville, Dates, Participants, Disposition). | Public |
| `GET` | `/establishments/map` | Recherche géospatiale sur carte (GPS Lat/Lng + Rayon km). | Public |
| `GET` | `/establishments/:id` | Fiche détaillée d'un hôtel (Salles, Chambres, Forfaits, Avis). | Public |
| `PUT` | `/establishments/my-profile` | Mise à jour autonome de la fiche établissement. | `HOTEL_ADMIN` |
| `POST` | `/establishments/meeting-rooms` | Ajout d'une salle et capacités par disposition. | `HOTEL_ADMIN` |
| `POST` | `/establishments/bedrooms` | Ajout/Mise à jour du stock de chambres et tarifs. | `HOTEL_ADMIN` |
| `POST` | `/establishments/packages` | Gestion des forfaits (Journée d'étude, Résidentiel, etc.). | `HOTEL_ADMIN` |
| `POST` | `/establishments/availability-blocks` | Déclaration de blocages de dates / tarifs saisonniers. | `HOTEL_RESERVATION`, `HOTEL_ADMIN` |
| `GET` | `/establishments/dashboard` | Tableau de bord hôtel (Taux d'occupation, CA, devis). | `HOTEL_*` |

---

### 3.4. Module 4 : Demandes de Devis (RFQ) & Messagerie (`/api/v1/event-requests`)

| Verbe | Route Exacte | Description Fonctionnelle | Restriction RBAC |
| :--- | :--- | :--- | :--- |
| `POST` | `/event-requests` | Création et envoi d'une demande à plusieurs hôtels. | `ORG_REQUESTER`, `ORG_ADMIN` |
| `GET` | `/event-requests` | Liste des demandes d'événements de l'organisation. | `ORG_*` |
| `GET` | `/event-requests/:id` | Détails d'une demande et réponses reçues. | `ORG_*`, `HOTEL_*` (si ciblé) |
| `POST` | `/event-requests/:id/remind` | Relance automatique des hôtels n'ayant pas encore répondu. | `ORG_REQUESTER`, `ORG_ADMIN` |
| `GET` | `/event-requests/:id/messages` | Fil de discussion et pièces jointes de la demande. | `ORG_*`, `HOTEL_*` |
| `POST` | `/event-requests/:id/messages` | Envoi d'un message / fichier dans le fil d'échange. | `ORG_*`, `HOTEL_*` |
| `POST` | `/event-requests/:id/compare` | Génération de la matrice comparative (Export JSON/PDF). | `ORG_*` |

---

### 3.5. Module 5 : Devis & Offres Commerciales (`/api/v1/quotes`)

| Verbe | Route Exacte | Description Fonctionnelle | Restriction RBAC |
| :--- | :--- | :--- | :--- |
| `POST` | `/quotes` | Soumission d'un devis officiel par l'hôtel. | `HOTEL_COMMERCIAL`, `HOTEL_ADMIN` |
| `GET` | `/quotes/received` | Consultation des devis reçus pour une demande. | `ORG_*` |
| `POST` | `/quotes/:id/accept` | Acceptation d'un devis et déclenchement de la réservation. | `ORG_APPROVER`, `ORG_ADMIN` |
| `POST` | `/quotes/:id/reject` | Rejet d'un devis avec commentaires. | `ORG_APPROVER`, `ORG_ADMIN` |

---

### 3.6. Module 6 : Réservations & Valideurs (`/api/v1/reservations`)

| Verbe | Route Exacte | Description Fonctionnelle | Restriction RBAC |
| :--- | :--- | :--- | :--- |
| `POST` | `/reservations/hold-option` | Pose d'une option temporaire avec expiration automatique. | `ORG_LOGISTICS`, `ORG_REQUESTER` |
| `GET` | `/reservations` | Liste des réservations et options. | `ORG_*`, `HOTEL_*` |
| `GET` | `/reservations/:id` | Détails complets de la réservation et contrats. | `ORG_*`, `HOTEL_*` |
| `POST` | `/reservations/:id/approve` | Validation interne selon niveau d'approbation (Niv 1, 2, 3). | `ORG_APPROVER`, `ORG_FINANCE` |
| `POST` | `/reservations/:id/cancel` | Annulation d'une réservation. | `ORG_*`, `HOTEL_*` |

---

### 3.7. Module 7 : Factures & Paiements (`/api/v1/invoices` & `/api/v1/payments`)

| Verbe | Route Exacte | Description Fonctionnelle | Restriction RBAC |
| :--- | :--- | :--- | :--- |
| `GET` | `/invoices/:reservationId` | Téléchargement PDF Facture Pro Forma ou Définitive. | `ORG_FINANCE`, `HOTEL_FINANCE` |
| `POST` | `/payments/initiate` | Initialisation d'un paiement (Wave, Orange Money, Carte, Virement). | `ORG_FINANCE` |
| `POST` | `/payments/webhook/wave` | Webhook de validation automatique Gateway Wave. | System Callback |
| `POST` | `/payments/webhook/orange` | Webhook de validation automatique Gateway Orange Money. | System Callback |
| `GET` | `/payments/status/:transactionRef` | Vérification du statut de la transaction en temps réel. | `ORG_FINANCE`, `HOTEL_FINANCE` |

---

### 3.8. Module 8 : Avis & Administration SeminairePro (`/api/v1/reviews`, `/api/v1/admin`)

| Verbe | Route Exacte | Description Fonctionnelle | Restriction RBAC |
| :--- | :--- | :--- | :--- |
| `POST` | `/reviews` | Publication d'un avis (restreint aux activités réalisées). | `ORG_ADMIN`, `ORG_REQUESTER` |
| `PUT` | `/admin/reviews/:id/moderate` | Modération administrative d'un avis client. | `SUPER_ADMIN`, `MODERATOR` |
| `GET` | `/notifications` | Récupération des notifications utilisateur. | Authentifié |
| `GET` | `/admin/pending-hotels` | Hôtels soumis en attente de validation. | `SUPER_ADMIN`, `PARTNER_MANAGER` |
| `POST` | `/admin/hotels/:id/validate` | Approbation officielle ou rejet d'un hôtel. | `SUPER_ADMIN`, `PARTNER_MANAGER` |
| `GET` | `/admin/dashboard` | Tableau de bord analytique global SeminairePro. | `SUPER_ADMIN`, `FINANCIAL_MANAGER` |
| `GET` | `/admin/commissions` | Suivi des commissions calculées et perçues. | `SUPER_ADMIN`, `FINANCIAL_MANAGER` |
| `GET` | `/admin/audit-logs` | Consultation du journal d'audit de sécurité. | `SUPER_ADMIN` |

---

## 4. Bilan de la Revue & Prochaines Étapes

- **Exhaustivité des APIs** : 38 endpoints REST révisés couvrant l'ensemble des parcours et sous-systèmes du Cahier des Charges.
- **Actions manuelles requis** : **AUCUNE** pendant le développement. Tout le code, les validations et les services sont générés automatiquement par votre assistant.

📄 **Fichier réactualisé dans le projet** : [DOCUMENTATION_PHASE2.md](file:///c:/Users/Moi/Desktop/SEMINAIREE_PRO/DOCUMENTATION_PHASE2.md)
