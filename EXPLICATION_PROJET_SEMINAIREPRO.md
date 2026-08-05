# GUIDE D'EXPLICATION & FONCTIONNEMENT DU PROJET SEMINAIREPRO

**Bienvenue dans le projet SeminairePro !**  
Ce document a pour but de vous expliquer simplement et clairement la vision du projet, le fonctionnement complet de la plateforme et la manière dont toutes les briques techniques s'articulent.

---

## 1. Qu'est-ce que SeminairePro ?

**SeminairePro** est une plateforme web numérique B2B (Marketplace) spécialisée dans la réservation d'hôtels, de salles de conférence, de chambres et de services logistiques (restauration, équipements audiovisuels, navettes) pour les **événements professionnels** (séminaires, ateliers, formations, conférences, retraites).

### Les 3 acteurs clés de la plateforme :
1. **Les Organisations Clients** (ONG, Entreprises, Senelec, Ministères, Cabinets) : Elles cherchent et réservent les meilleurs cadres pour leurs événements.
2. **Les Établissements Partenaires** (Hôtels, Résidences hôtelières, Centres de conférence) : Ils publient leurs salles, chambres et forfaits pour recevoir des demandes.
3. **L'Équipe SeminairePro (Administration)** : Elle valide les hôtels, contrôle la qualité, perçoit des commissions automatiques et supervise l'activité.

---

## 2. Comment l'application fonctionne concrètement (Étape par Étape)

Voici le scénario réel de bout en bout d'un séminaire sur la plateforme :

```
[1. Organisation & Hôtel ] ──► [2. Demande de Devis ] ──► [3. Réponses Devis ]
       S'inscrivent                  Émise (RFQ)                  Par les Hôtels
            │                                                           │
            ▼                                                           ▼
[6. Paiement & Facture   ] ◄── [5. Validation & Option] ◄── [4. Matrice Comparative]
 Wave / Orange Money / FCFA        Anti-Double Réservation          Générée Auto
            │
            ▼
[7. Séminaire Réalisé    ] ──► [8. Avis Client Vérifié]
   & Commission Plateforme
```

### Étape 1 : Inscription & Validation des Comptes
- Une **organisation** (ex: *Senelec*) crée son compte institutionnel. Son administrateur peut inviter des collaborateurs (demandeurs, responsables financiers, approbateurs).
- Un **hôtel** (ex: *Terrou-Bi Dakar* ou *Hôtel Rhino Saly*) crée sa fiche, renseigne ses salles, ses stocks de chambres et ses tarifs.
- **Sécurité** : L'hôtel reste en attente de validation administrative jusqu'à ce que l'Admin SeminairePro vérifie ses documents (NINEA, Registre de commerce).

### Étape 2 : Expression du Besoin (Demande de Devis - RFQ)
- Le chargé de logistique de l'organisation crée une demande (`RFQ-2026-0012`) :
  - *Exemple* : Séminaire de 50 personnes du 15 au 17 octobre à Saly, besoin d'une salle en disposition U, 20 chambres simples, pauses-café et déjeuners buffets.
- La demande est automatiquement transmise aux hôtels sélectionnés.

### Étape 3 : Soumission des Devis par les Hôtels
- Les hôtels ciblés reçoivent la notification et établissent un **devis chiffré officiel** (`DEV-2026-0045`) avec le détail des coûts (salle + chambres + pauses-café - remises).

### Étape 4 : Matrice Comparative Automatique
- L'organisation clique sur **"Comparer les offres"**. Le backend génère automatiquement un tableau comparatif mettant côte à côte le prix total, le coût par participant, les équipements inclus et le standing des établissements.

### Étape 5 : Circuit de Validation & Option Temporaire
- L'organisation pose une **option temporaire (48h)** sur l'offre choisie.
- **Règle Anti-Double Réservation** : La salle sélectionnée est instantanément verrouillée en base de données pour empêcher tout autre client de la réserver aux mêmes dates.
- Le circuit de validation interne de l'organisation s'active (Niveau 1 Logistique -> Niveau 2 Finance -> Niveau 3 Direction).

### Étape 6 : Paiement & Génération des Factures
- Une **Facture Pro Forma** (`PRO-2026-XXXX`) est générée avec le détail HT, la TVA 18 % FCFA et le TTC.
- L'organisation effectue le paiement (Acompte 30 % ou Totalité) via **Mobile Money (Wave, Orange Money, Free Money)** ou Virement bancaire.
- Le Webhook enregistre le paiement (`FULLY_PAID`), génère la **Facture Définitive** (`FAC-2026-XXXX`) et calcule automatiquement la **commission SeminairePro** (ex: 8 % pour l'hôtel).

### Étape 7 : Réalisation de l'Événement & Avis Client Vérifié
- L'événement se déroule à l'hôtel.
- Une fois terminé, l'organisation dépose une évaluation vérifiée (Accueil, Restauration, WiFi, Salle, Rapport qualité-prix) qui s'affiche sur la fiche de l'hôtel après modération.

---

## 3. L'Architecture Backend Réalisée (Sous le Capot)

Le backend a été construit selon une **Clean Architecture** stricte en Node.js, Express, TypeScript et PostgreSQL avec Prisma ORM.

### Les 8 Modules Fonctionnels :
1. **`src/routes/auth.routes.ts`** : Connexion, Inscriptions, Hashage Argon2id, Tokens JWT, Password Reset, 2FA.
2. **`src/routes/organization.routes.ts`** : Gestion des organisations, collaborateurs et workflows d'approbation.
3. **`src/routes/establishment.routes.ts`** : Recherche multicritère & **Carte GPS par rayon km (Formule Haversine)**, gestion de l'inventaire des salles et chambres.
4. **`src/routes/eventRequest.routes.ts`** : RFQs, relances automatiques, messagerie interne et matrice comparative.
5. **`src/routes/quote.routes.ts`** : Devis hôteliers, acceptations, rejets et dépréciation d'offres concurrentes.
6. **`src/routes/reservation.routes.ts`** : Options, **Verrous transactionnels anti-double réservation** et signatures d'approbation.
7. **`src/routes/payment.routes.ts`** : Factures Pro Forma/Définitives (TVA 18%), Webhooks Mobile Money et calcul des commissions.
8. **`src/routes/admin.routes.ts`** : Validation des hôtels, dashboards analytiques globaux et journaux d'audit de sécurité (`AuditLog`).

---

## 4. Vos Documents de Référence dans le Projet

Vous disposez de l'ensemble des documentations techniques créées au fil des phases :

- 📘 [cahier_des_charges.md](file:///c:/Users/Moi/Desktop/SEMINAIREE_PRO/cahier_des_charges.md) — Le cahier des charges fonctionnel initial.
- 📘 [DOCUMENTATION_PHASE1.md](file:///c:/Users/Moi/Desktop/SEMINAIREE_PRO/DOCUMENTATION_PHASE1.md) — Dictionnaire de données & Modèle BDD Prisma.
- 📘 [DOCUMENTATION_PHASE2.md](file:///c:/Users/Moi/Desktop/SEMINAIREE_PRO/DOCUMENTATION_PHASE2.md) — Contrats d'APIs RESTful & DTOs Zod.
- 📘 [DOCUMENTATION_PHASE3.md](file:///c:/Users/Moi/Desktop/SEMINAIREE_PRO/DOCUMENTATION_PHASE3.md) — Implémentation Métier & Clean Architecture.
- 📘 [DOCUMENTATION_PHASE4.md](file:///c:/Users/Moi/Desktop/SEMINAIREE_PRO/DOCUMENTATION_PHASE4.md) — Sécurité OWASP, Rate Limiting & Erreurs.
- 📕 [GUIDE_DEPLOIEMENT_PRODUCTION.md](file:///c:/Users/Moi/Desktop/SEMINAIREE_PRO/GUIDE_DEPLOIEMENT_PRODUCTION.md) — Guide d'installation et checklist de mise en ligne.

---

## 5. Comment lancer le serveur dès maintenant

### En mode Développement local :
```bash
npm run dev
```
> Le serveur démarrera sur `http://localhost:5000/api/v1/health`

### Exécuter la suite de tests automatisés :
```bash
npm test
```
> Valide les 21 tests d'intégration sur l'ensemble des 8 modules API.

### Compiler pour la Production :
```bash
npm run build
```
> Génère le code compilé prêt dans le dossier `dist/`.

---

**Ce fichier récapitule l'intégralité du projet SeminairePro !**
