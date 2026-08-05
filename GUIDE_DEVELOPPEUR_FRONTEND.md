# GUIDE D'INTÉGRATION TECHNIQUE POUR LE DÉVELOPPEUR FRONTEND (WEB)

**Projet** : SeminairePro — Plateforme B2B de réservation d'hôtels et d'espaces professionnels  
**Auteur** : Lead Backend Architect  
**Destinataire** : Développeur Web Frontend  
**Version API** : v1.0  

---

## 1. Bienvenue & Vue d'Ensemble

Cher collègue développeur Frontend,

Le backend de la plateforme **SeminairePro** est intégralement développé, sécurisé, testé et compilé. Il fournit une API RESTful complète couvrant les **3 espaces utilisateurs** (Organisations clients, Hôtels partenaires, Administration SeminairePro).

Ce guide a été spécialement rédigé pour vous permettre de connecter l'interface web de manière fluide et **sans aucune erreur**.

---

## 2. Configuration de Base de l'API Backend

### URL de base des API :
- **Environnement de Développement** : `http://localhost:5000/api/v1`
- **Endpoint Health Check (Vérification)** : `GET http://localhost:5000/api/v1/health`

### Authentification & En-tête HTTP :
Toutes les requêtes vers les routes protégées doivent inclure le jeton JWT dans l'en-tête HTTP :
```http
Authorization: Bearer <VOTRE_TOKEN_JWT>
Content-Type: application/json
```

---

## 3. Format Unifié des Réponses API

Le backend retourne toujours des objets JSON structurés de façon uniforme :

### 3.1. Réponse de Succès (HTTP 200 / 201)
```json
{
  "success": true,
  "data": {
    "id": "uuid-1234",
    "referenceNumber": "RFQ-2026-0042",
    "status": "SENT"
  }
}
```

### 3.2. Réponse Paginée (Pour les listes)
```json
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

### 3.3. Réponse d'Erreur Normalisée (HTTP 4xx / 5xx)
En cas d'erreur (validation, authentification, conflit), récupérez directement le champ `error.message` pour l'afficher à l'utilisateur :
```json
{
  "success": false,
  "error": {
    "code": "DOUBLE_BOOKING_CONFLICT",
    "message": "La salle sélectionnée est déjà sous option aux dates choisies.",
    "details": [
      {
        "field": "startDate",
        "message": "Chevauchement détecté avec la réservation RES-2026-0012"
      }
    ]
  }
}
```

---

## 4. Correspondance Écrans Web ↔ Endpoints API Backend

Voici la cartographie exacte des écrans à développer et les API correspondantes à appeler :

### Écran 1 : Authentification & Inscriptions (`/auth`)
- **Page d'inscription Organisation Client** : `POST /auth/register/organization`
- **Page d'inscription Hôtel Partenaire** : `POST /auth/register/hotel`
- **Page de Connexion (Login)** : `POST /auth/login` (Retourne le `token` et les rôles utilisateur).
- **Mot de passe oublié** : `POST /auth/forgot-password`
- **Récupérer l'utilisateur courant** : `GET /auth/me`

### Écran 2 : Recherche d'Hôtels & Carte GPS Interactive (`/establishments`)
- **Recherche multicritère** (Ville, Standing, Dates, Capacité) :  
  `GET /establishments/search?city=Dakar&standingStars=5&page=1`
- **Recherche sur carte GPS par périmètre** (Rayon km) :  
  `GET /establishments/map?latitude=14.6937&longitude=-17.4441&radiusKm=10`
- **Fiche détaillée d'un hôtel** (Salles par disposition, Chambres, Forfaits, Avis) :  
  `GET /establishments/:id`

### Écran 3 : Espace Organisation (Client) (`/event-requests` & `/reservations`)
- **Créer et envoyer une demande de devis multi-hôtels** : `POST /event-requests`
- **Consulter la liste de mes demandes** : `GET /event-requests`
- **Générer le tableau comparatif des devis reçus** : `POST /event-requests/:id/compare`
- **Poser une option temporaire (48h)** : `POST /reservations/hold-option`
- **Valider la réservation (Circuit 3 niveaux)** : `POST /reservations/approve`
- **Tableau de bord Organisation** : `GET /organizations/dashboard`

### Écran 4 : Espace Hôtel (Partenaire) (`/quotes` & `/establishments`)
- **Mettre à jour la fiche établissement** : `PUT /establishments/my-profile`
- **Ajouter des salles de réunion et dispositions** : `POST /establishments/meeting-rooms`
- **Ajouter du stock de chambres & tarifs** : `POST /establishments/bedrooms`
- **Répondre à une demande en soumettant un devis** : `POST /quotes`
- **Tableau de bord Hôtel (Taux d'occupation, CA)** : `GET /establishments/dashboard`

### Écran 5 : Paiement & Facturation (`/payments` & `/invoices`)
- **Télécharger la facture Pro Forma / Définitive PDF** : `GET /invoices/:reservationId?type=PRO_FORMA`
- **Déclencher le paiement Mobile Money (Wave, Orange, Free)** :  
  `POST /payments/initiate` avec payload `{ reservationId, amountCfa, method: "MOBILE_MONEY_WAVE", customerPhone }`
- **Vérifier le statut du paiement** : `GET /payments/status/:transactionRef`

### Écran 6 : Espace Admin SeminairePro (`/admin`)
- **Liste des hôtels en attente de validation** : `GET /admin/pending-hotels`
- **Valider ou Rejeter la fiche d'un hôtel** : `POST /admin/hotels/:id/validate` avec `{ approve: true }`
- **Dashboard Global & Commissions** : `GET /admin/dashboard` & `GET /admin/commissions`
- **Journaux d'Audit de Sécurité** : `GET /admin/audit-logs`

---

## 5. Recommandations Clés pour le Frontend (Zéro Erreur)

1. **Stockage du Token** : Enregistrez le jeton JWT (`token`) lors du login et réinjectez-le dans l'en-tête `Authorization: Bearer <token>` de toutes les requêtes HTTP (via un intercepteur Axios ou Fetch wrapper).
2. **Gestion des Rôles (RBAC)** : Adaptez l'affichage selon le rôle de l'utilisateur (`ORG_ADMIN`, `ORG_REQUESTER`, `ORG_FINANCE`, `HOTEL_COMMERCIAL`, `SUPER_ADMIN`).
3. **Formulaires & Validations** : Respectez les formats requis (les dates doivent être au format ISO 8601 ex: `2026-10-15T08:00:00.000Z`).
4. **Erreurs HTTP 401 & 403** : En cas de réponse `401 Unauthorized`, redirigez l'utilisateur vers l'écran de connexion `/login`.

---

**Le backend est 100 % opérationnel et vous attend ! Bon dev !**
