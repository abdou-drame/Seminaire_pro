# SEMINAIREPRO
## Plateforme de réservation d’hôtels et d’espaces pour les événements professionnels
### CAHIER DES CHARGES FONCTIONNEL
**Version 1.0 — Juillet 2026**  
*Slogan : « Trouvez et réservez le cadre idéal pour vos événements professionnels. »*

---

## Fiche signalétique du projet

### Informations générales
- **Nom de la solution** : SeminairePro
- **Nature** : Plateforme web responsive, évolutive vers des applications Android et iOS
- **Cibles principales** : ONG, projets, entreprises, administrations, collectivités, cabinets et organisateurs d’événements
- **Partenaires fournisseurs** : Hôtels, résidences hôtelières, centres de conférence et espaces événementiels agréés
- **Finalité** : Centraliser les disponibilités, demandes de devis, comparaisons, réservations, paiements et évaluations
- **Zone de lancement** : Sénégal, avec possibilité d’extension sous-régionale
- **Langue initiale** : Français

---

## Sommaire
1. Présentation du projet
2. Contexte et justification
3. Objectifs
4. Périmètre fonctionnel
5. Utilisateurs et rôles
6. Parcours des organisations
7. Parcours des hôtels
8. Administration de la plateforme
9. Communication et notifications
10. Évaluation des prestations
11. Géolocalisation
12. Paiement, facturation et documents
13. Modèle économique
14. Règles de gestion
15. Exigences techniques
16. Sécurité et protection des données
17. Performance et disponibilité
18. Rapports et statistiques
19. Version minimale viable (MVP)
20. Évolutions futures
21. Identité visuelle
22. Livrables attendus
23. Phases de réalisation
24. Critères de validation
25. Indicateurs de performance
26. Risques et mesures de maîtrise
27. Gouvernance du projet
28. Conclusion

---

## 1. Présentation du projet
SeminairePro est une plateforme numérique destinée à faciliter la recherche, la comparaison et la réservation d’hôtels, de salles de réunion, de chambres et de services complémentaires pour l’organisation d’événements professionnels.

La plateforme mettra en relation les organisations qui préparent des séminaires, ateliers, formations, conférences ou retraites professionnelles avec des établissements disposant de salles, de chambres et de services adaptés.

Elle devra couvrir l’ensemble du processus : expression du besoin, recherche d’établissements, consultation des disponibilités, demande de devis, comparaison des offres, validation interne, réservation, paiement, facturation, suivi de l’activité et évaluation de la prestation.

---

## 2. Contexte et justification
L’organisation d’un événement professionnel exige généralement de contacter plusieurs hôtels afin de vérifier les dates disponibles, les capacités d’accueil, les équipements, les formules de restauration, les tarifs et les conditions de paiement. Ce processus est souvent long, dispersé et difficile à documenter.

Les organisations ne disposent pas toujours d’une vision consolidée des offres disponibles. Les hôtels, de leur côté, reçoivent des demandes par téléphone, courrier électronique ou messagerie instantanée, sans outil centralisé pour gérer les devis et éviter les doubles réservations.

SeminairePro répond à ce besoin par la création d’un marché numérique spécialisé dans les événements professionnels, avec une traçabilité complète des échanges et des décisions.

---

## 3. Objectifs

### 3.1. Objectif général
Mettre en place une plateforme sécurisée permettant aux organisations de trouver, comparer et réserver facilement des hôtels et des espaces adaptés à leurs événements professionnels.

### 3.2. Objectifs spécifiques
- Centraliser les offres des hôtels et centres de conférence.
- Afficher les disponibilités des salles, chambres, équipements et services.
- Permettre une recherche multicritère en fonction du besoin et du budget.
- Digitaliser les demandes de devis et les réponses des établissements.
- Faciliter la comparaison objective des offres.
- Assurer la réservation, la facturation et le suivi des paiements.
- Améliorer la visibilité commerciale des établissements partenaires.
- Garantir la traçabilité des validations et des modifications.
- Produire des statistiques utiles aux organisations, aux hôtels et à SeminairePro.

---

## 4. Périmètre fonctionnel

### 4.1. Types d’activités couverts
- Séminaires et ateliers
- Formations et conférences
- Réunions et assemblées générales
- Retraites professionnelles
- Forums et rencontres institutionnelles
- Événements résidentiels et semi-résidentiels
- Lancements, présentations et rencontres d’affaires

### 4.2. Types d’établissements référencés
- Hôtels
- Résidences hôtelières
- Auberges professionnelles
- Centres de conférence
- Salles de réunion indépendantes
- Espaces événementiels agréés

### 4.3. Prestations réservables
- Location de salle
- Hébergement
- Pause-café et restauration
- Matériel audiovisuel
- Connexion Internet
- Transport et navettes
- Interprétation et traduction
- Décoration, impression et secrétariat
- Autres services complémentaires validés par SeminairePro

---

## 5. Utilisateurs et rôles

### 5.1. Organisation cliente
Une organisation pourra créer un compte institutionnel et y rattacher plusieurs utilisateurs. Les principaux profils seront :
- **Administrateur du compte**
- **Demandeur ou initiateur**
- **Responsable administratif et logistique**
- **Responsable financier**
- **Approbateur ou directeur**
- **Utilisateur en consultation**

### 5.2. Hôtel ou établissement partenaire
- **Administrateur de l’établissement**
- **Responsable commercial**
- **Responsable des réservations**
- **Responsable financier**
- **Réceptionniste ou agent opérationnel**

### 5.3. Administration SeminairePro
- **Super administrateur**
- **Administrateur fonctionnel**
- **Gestionnaire des partenaires**
- **Gestionnaire financier**
- **Agent de support et réclamation**
- **Modérateur des contenus et avis**

Chaque rôle devra être associé à des permissions précises (RBAC). Les utilisateurs ne pourront accéder qu’aux données et fonctions correspondant à leurs responsabilités.

---

## 6. Fonctionnalités destinées aux organisations

### 6.1. Création et gestion du compte
- Création du compte avec validation de l’adresse électronique ou du numéro de téléphone.
- Renseignement de la raison sociale, de l’adresse, des contacts et des références administratives.
- Ajout du logo et des documents utiles.
- Création de plusieurs utilisateurs et attribution des rôles.
- Paramétrage d’un circuit de validation interne.
- Modification, désactivation et récupération sécurisée du compte.

### 6.2. Recherche multicritère
- Pays, région, ville, commune ou zone
- Dates et horaires de l’activité
- Nombre de participants
- Nombre de chambres et de nuitées
- Capacité et disposition de la salle
- Type d’événement
- Budget total ou prix par participant
- Standing et catégorie de l’établissement
- Équipements et services disponibles
- Restauration, accessibilité, parking et géolocalisation
- Note et avis des clients

### 6.3. Fiche détaillée de l’établissement
- Présentation, logo, photos et vidéo
- Adresse, contacts et localisation cartographique
- Types de salles et capacités par disposition
- Types de chambres et tarifs
- Équipements disponibles
- Formules de restauration
- Conditions de réservation, paiement et annulation
- Disponibilités et promotions
- Notes et avis vérifiés

### 6.4. Configuration de l’événement
- Intitulé et type de l’événement
- Dates, horaires et durée
- Nombre de participants et facilitateurs
- Nombre de chambres et nuitées
- Disposition de la salle
- Restauration et pauses
- Matériel requis
- Transport, interprétation et besoins particuliers
- Budget prévisionnel et documents joints

### 6.5. Demande de devis
L’organisation pourra transmettre une même demande à un ou plusieurs établissements. Chaque demande recevra un numéro de référence unique et comprendra une date limite de réponse.
- Enregistrement en brouillon
- Envoi à un ou plusieurs hôtels
- Ajout de pièces jointes
- Relance automatique avant l’échéance
- Réception des réponses et variantes
- Archivage de l’ensemble des échanges

### 6.6. Comparaison des offres
- Prix total et prix par participant
- Coût de la salle, des chambres et de la restauration
- Équipements inclus et services additionnels
- Disponibilité réelle
- Conditions de paiement et d’annulation
- Notes, distance et délai de réponse
- Export de la comparaison en PDF ou Excel

### 6.7. Réservation et circuit de validation
L’organisation pourra poser une option, confirmer une réservation, demander une modification ou procéder à une annulation selon les conditions applicables.
- **Statuts possibles** : Brouillon, Demande envoyée, En attente de réponse, Devis reçu, En cours de validation, Option posée, Réservation confirmée, Acompte payé, Paiement complet, Activité réalisée, Annulée, Clôturée.
- Circuit de validation à plusieurs niveaux : demandeur, responsable administratif, responsable financier et autorité d’approbation. Each action horodatée.

### 6.8. Tableau de bord de l’organisation
- Demandes et devis en cours
- Réservations confirmées et prochaines activités
- Paiements en attente
- Dépenses par période, établissement et type d’événement
- Historique complet des réservations
- Alertes et tâches nécessitant une action

---

## 7. Fonctionnalités destinées aux hôtels

### 7.1. Inscription et validation
- Raison sociale, nom commercial et contacts
- Adresse et géolocalisation
- NINEA, registre de commerce ou documents équivalents
- Classement ou standing
- Coordonnées bancaires et moyens de paiement
- Documents d’autorisation
- Validation administrative avant publication

### 7.2. Gestion de la fiche établissement
- Présentation, logo, photos et vidéo
- Certifications, agréments et services
- Horaires d’arrivée et de départ
- Conditions de réservation et d’annulation
- Moyens de paiement acceptés
- Mise à jour autonome des informations

### 7.3. Gestion des salles
Pour chaque salle : nom, superficie, capacité, tarifs, équipements, photos et disponibilités selon les dispositions :
- Théâtre
- Salle de classe
- Disposition en U
- Conférence
- Conseil d’administration
- Banquet ou cocktail

### 7.4. Gestion des chambres
- Type et nombre de chambres
- Capacité et caractéristiques
- Tarif par nuitée
- Services inclus
- Photos et conditions
- Stock disponible par date

### 7.5. Équipements et restauration
- Vidéoprojecteur, écran et sonorisation
- Microphones, pupitre et paperboard
- Visioconférence et connexion Internet
- Climatisation et groupe électrogène
- Pause-café, déjeuner, dîner, buffet et cocktail
- Menus personnalisés et régimes alimentaires particuliers

### 7.6. Gestion des forfaits
- Location de salle uniquement
- Demi-journée / Journée complète
- Journée avec pause-café / déjeuner
- Formule semi-résidentielle / résidentielle
- Formule VIP ou personnalisée

### 7.7. Calendrier des disponibilités
- Déclaration des périodes disponibles
- Blocage manuel de dates
- Saisie des réservations externes
- Gestion des options
- Prévention des doubles réservations
- Tarification saisonnière
- Synchronisation future avec un logiciel hôtelier (PMS)

### 7.8. Réponse aux demandes et facturation
- Acceptation, refus ou demande de précisions
- Établissement d’un devis principal et de variantes
- Application d’une remise
- Définition d’une date de validité
- Génération de factures pro forma et définitives
- Suivi des acomptes et paiements
- Consultation des commissions dues à SeminairePro

### 7.9. Tableau de bord de l’hôtel
- Nouvelles demandes
- Devis à traiter
- Options et réservations
- Taux d’occupation des salles et chambres
- Chiffre d’affaires et paiements
- Annulations
- Évaluations des clients

---

## 8. Administration de la plateforme
- Validation, suspension et fermeture des comptes
- Gestion des rôles et permissions
- Contrôle des établissements et offres publiées
- Suivi global des demandes, réservations et paiements
- Paramétrage des commissions, abonnements et promotions
- Mise en avant de certains établissements
- Gestion des réclamations et litiges
- Modération des avis
- Publication d’annonces et contenus
- Journalisation des actions sensibles (Audit logs)
- Export des données et production de rapports

---

## 9. Communication et notifications
Messagerie interne sécurisée et notifications multi-canaux :
- Messagerie interne sécurisée avec pièces jointes et historique des échanges
- Notifications par courriel, SMS, in-app (et WhatsApp si API autorisée)
- **Événements déclencheurs** : Réception demande, réponse/précisions, expiration offre/option, validation/rejet interne, confirmation/modification réservation, échéance paiement, rappel pré-événement, demande d’évaluation post-activité.

---

## 10. Évaluation des prestations
- Accueil, conformité salle, qualité chambres, restauration, équipements & internet, respect horaires, rapport qualité-prix, satisfaction générale.
- Réservée uniquement aux organisations ayant effectivement réalisé une activité.
- Avis modérables avant mise en ligne.

---

## 11. Géolocalisation et cartographie
- Affichage des établissements sur une carte
- Recherche autour d’une adresse/lieu, calcul de distance, itinéraire
- Filtrage par zone, affichage des points d’intérêt à proximité

---

## 12. Paiement, facturation et documents

### 12.1. Moyens de paiement
- Mobile money (Wave, Orange Money, Free Money, etc.)
- Carte bancaire
- Virement bancaire
- Chèque / Paiement sur facture
- Acompte, paiement complet, ou échelonné

### 12.2. Documents générés ou archivés
- Demande de devis
- Devis et variantes
- Rapport comparatif
- Bon de réservation / Bon de commande / Contrat
- Facture pro forma / Facture définitive
- Reçu de paiement
- Attestation de service fait
- Historique des échanges et validations
*(Chaque document possède un numéro unique et une date de génération)*

---

## 13. Modèle économique

### 13.1. Sources de revenus
- Frais d’adhésion des hôtels
- Abonnements mensuels/annuels
- Commission sur réservations confirmées
- Mise en avant et publicités ciblées
- Accounts institutionnels avec fonctions avancées
- Services d'assistance événementielle

### 13.2. Formules d’abonnement
- **Gratuite** : Fiche de base, visibilité limitée, réponses restreintes.
- **Standard** : Gestion des offres, calendrier, devis et réservations.
- **Professionnelle** : Stats avancées, promotions, priorité résultats, utilisateurs additionnels.
- **Premium** : Accompagnement commercial, intégrations et visibilité renforcée.

---

## 14. Règles de gestion
1. Seuls les établissements validés peuvent publier des offres.
2. Une salle ou chambre ne peut pas être confirmée pour deux réservations incompatibles aux mêmes dates (Absence de surréservation).
3. Identifiant unique obligatoire pour toute demande, offre et réservation.
4. Traçabilité et historisation de toute modification importante.
5. Durée limitée des options avec expiration automatique.
6. Réservation définitive conditionnée par accord de l'hôtel et respect des paiements.
7. Tarifs incluant taxes, frais et services.
8. Acceptation préalable des conditions d'annulation.
9. Avis réservés aux événements réellement réalisés.
10. Calcul automatique des commissions selon contrat hôtel.
11. Isolation stricte des données entre organisations (Multi-tenancy).
12. Respect strict des rôles et autorisations (RBAC).

---

## 15. Exigences techniques

### 15.1. Supports
- Application web responsive (Desktop, tablette, smartphone)
- Optimisation pour connexions à débit limité
- Applications Android/iOS en phase ultérieure

### 15.2. Architecture fonctionnelle
- Portail public, Espace organisation, Espace établissement, Espace administrateur
- BDD sécurisée, API de services, Moteur de recherche, Module de réservation, Module de paiement, Module de notifications, Module de reporting

### 15.3. Principes technologiques
- Architecture modulaire et évolutive
- Code documenté et maintenable
- API REST/GraphQL sécurisée
- Base de données relationnelle
- Sauvegardes automatiques et journalisation technique

---

## 16. Sécurité et protection des données
- Connexion HTTPS / TLS
- Mots de passe chiffrés (Argon2 / bcrypt)
- Authentification à deux facteurs (2FA) pour profils sensibles
- RBAC strict
- Chiffrement des données sensibles
- Protection contre Top 10 OWASP (SQLi, XSS, CSRF, etc.)
- Journalisation des connexions et actions sensibles (Audit logging)
- Déconnexion automatique
- Conformité RGPD / Protection des données personnelles (Sénégal CDP)

---

## 17. Performance et disponibilité
- Haute disponibilité
- Temps de chargement optimisé pour réseaux mobiles
- Support d'utilisateurs simultanés
- Verrouillage transactionnel (Prévention des doubles réservations)
- Supervision et alerte en temps réel

---

## 18. Rapports et statistiques
- Statistiques administratives (Hôtels, organisations, devis, conversion, CA, commissions, satisfaction).
- Exportation filtrée au format PDF et Excel.

---

## 19. Version Minimale Viable (MVP)
1. Inscription des organisations
2. Inscription et validation des hôtels
3. Publication des salles, chambres et forfaits
4. Calendrier des disponibilités
5. Recherche multicritère
6. Fiches détaillées des établissements
7. Demande et réponse de devis
8. Comparaison des offres
9. Réservation et suivi des statuts
10. Génération de devis et factures
11. Notifications par courriel et in-app
12. Tableaux de bord essentiels
13. Administration générale

---

## 20. Évolutions futures
Apps mobiles natives, réservation instantanée, recommandation IA, assistant conversationnel, gestion des perdiems/badges/émargement, marketplace prestataires, intégration PMS/comptabilité.

---

## 21. Identité visuelle
- **Nom** : SeminairePro
- **Slogan** : « Trouvez et réservez le cadre idéal pour vos événements professionnels. »
- **Univers graphique** : Hospitalité, réservation, calendrier, salle de conférence, géolocalisation, validation.
- **Ton** : Professionnel, accessible, rassurant, orienté résultats.

---

## 22 à 28. Livrables, Phases, Validation, KPIs, Risques, Gouvernance & Conclusion
- **Cadre du projet** : Déploiement pilote initial au Sénégal puis extension sous-régionale.
- **Périmètre technique Backend** : APIs robustes, gestion multi-tenant, workflow de validation, moteur de devis/réservation, verrous de concurrence, génération de documents PDF, sécurité RBAC et traçabilité complète.
