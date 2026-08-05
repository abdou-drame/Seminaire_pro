# CHECKLIST DES ACTIONS MANUELLES — VERSION MINIMALE VIABLE (MVP)

**Projet** : SeminairePro — Plateforme B2B de réservation d'hôtels et d'espaces professionnels  
**Référence** : Section 19 du Cahier des Charges (Les 13 Exigences du MVP)  
**Objectif** : Liste exacte des seules actions manuelles indispensables pour faire fonctionner la version minimale du cahier des charges.

---

## 📋 Les 13 Exigences du MVP & Actions Manuelles Associées

Voici la correspondance exacte entre le cahier des charges et les seules actions manuelles à réaliser :

| # | Exigence MVP (Cahier des Charges) | Partie Codée (Automatique) | Action Manuelle Nécessaire |
| :---: | :--- | :--- | :--- |
| **1** | **Inscription des Organisations** | Formulaire API `POST /auth/register/organization`, création du compte admin client & hashage mot de passe. | **Créer les comptes clients** (L'organisation s'inscrit en ligne avec son NINEA). |
| **2** | **Inscription & Validation des Hôtels** | Formulaire API `POST /auth/register/hotel` (mis en `PENDING_VALIDATION`) + API `POST /admin/hotels/:id/validate`. | **Valider les hôtels** (L'Admin SeminairePro clique sur "Valider" après vérification du NINEA/RCCM pour rendre l'hôtel visible). |
| **3** | **Publication des Salles, Chambres & Forfaits** | API d'inventaire `POST /establishments/meeting-rooms` & `POST /establishments/bedrooms`. | **Saisie du catalogue hôtel** (L'hôtel partenaire ajoute la liste de ses salles, dispositions et chambres depuis son espace). |
| **4** | **Calendrier des Disponibilités** | API `GET /establishments/calendar` & blocage manuel de dates `POST /establishments/unavailabilities`. | **Mise à jour des indisponibilités** (L'hôtel bloque manuellement ses dates réservées hors plateforme si besoin). |
| **5** | **Recherche Multicritère** | Moteur de recherche filtré par ville, standing, capacité & **rayon GPS Haversine** (`GET /establishments/search`). | *Aucune (100 % Automatique)*. |
| **6** | **Fiches Détaillées des Établissements** | API `GET /establishments/:id` (Photos, équipements, tarifs, dispositions, avis). | **Remplissage des fiches** (L'hôtel ajoute ses photos et sa description). |
| **7** | **Demande & Réponse de Devis (RFQ)** | Création RFQ multi-hôtels (`POST /event-requests`) + Soumission de devis chiffré par l'hôtel (`POST /quotes`). | **Réponse aux devis** (L'hôtel remplit son offre commerciale chiffrée quand il reçoit une demande). |
| **8** | **Comparaison des Offres** | Moteur de **Matrice Comparative automatique** (`POST /event-requests/:id/compare`). | **Génération en 1 clic** (L'organisation clique sur "Comparer les offres" pour afficher le tableau). |
| **9** | **Réservation & Suivi des Statuts** | Option 48h (`POST /reservations/hold-option`), **Verrou anti-double réservation** & Valideurs 3 niveaux. | **Signature interne** (Les valideurs logistique/finance de l'organisation approuvent la demande). |
| **10** | **Génération de Devis & Factures** | Génération auto des factures Pro Forma (`PRO-XXXX`) & Définitives (`FAC-XXXX`) avec calcul TVA 18 % FCFA. | *Aucune (100 % Automatique par le code)*. |
| **11** | **Notifications Courriel & In-App** | Centre de notifications in-app (`GET /notifications`) + Logger d'envoi d'emails. | **Renseigner les clés SMTP** (Inscrire l'adresse email d'envoi dans le fichier `.env`). |
| **12** | **Tableaux de Bord Essentiels** | Dashboards spécifiques Organisation (`GET /organizations/dashboard`) et Hôtel (`GET /establishments/dashboard`). | *Aucune (100 % Automatique)*. |
| **13** | **Administration Générale** | Modération des avis, validation des hôtels, suivi des commissions & journaux d'audit (`GET /admin/dashboard`). | **Supervision Admin** (L'équipe SeminairePro consulte le tableau de bord global et valide les avis). |

---

## ⚙️ Les Seules 3 Clés de Configuration à Renseigner dans le Fichier `.env`

Pour faire tourner le MVP strict du cahier des charges, seules ces 3 configurations sont requises :

1. **Clé JWT** (Securité des sessions) : `JWT_SECRET=ma_cle_secrete_jwt`
2. **Clés Paiement Mobile Money** (Wave / Orange Money) : `WAVE_API_KEY` et `ORANGE_MONEY_CLIENT_ID` (Pour recevoir les acomptes des réservations).
3. **Clé d'envoi Email** (Niveau 11) : `SMTP_PASS` (Pour expédier les emails automatiques).

---

**Ce fichier se concentre exclusivement sur les 13 exigences du MVP décrites dans votre cahier des charges.**
