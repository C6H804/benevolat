# Gestion des missions et des candidatures

## Description :
Ce projet permet de gérer les missions proposées par une organisation ainsi que les candidatures des bénévoles. Il permet aux associations de créer des missions, accépter les candidatures et les bénévoles peuvent voir les missions et postuler


## Installation :
1. Clonez le dépôt :
    ```bash
    git clone https://github.com/C6H804/benevolat.git
    cd ccp2-benevolat
    ```

2. Installez les dépendances :
    ```bash
    npm install
    ```
        Modules installés automatiquement via `npm install` :
        
            - `express` : Framework web pour Node.js
            - `mysql2` : Connecteur MySQL pour Node.js
            - `dotenv` : Gestion des variables d'environnement
            - `jsonwebtoken` : Gestion des tokens JWT pour l'authentification
            - `cors` : Middleware pour gérer les requêtes cross-origin
            - `bcrypt` : Hashage des mots de passe
        

3.  Créez un fichier `.env` à la racine du projet et ajoutez-y les variables suivantes et complétez les :

    ```env
    PORT=
    
    DB_HOST=
    DB_USER=
    DB_PASSWORD=
    DB_DATABASE=

    TOKEN_SECRET=
    TOKEN_EXPIRATION=
    ```

    Remplissez les valeurs selon votre configuration.

Démarrez le serveur :

```bash
npm start
```

Le serveur sera accessible selon le port défini dans votre fichier `.env`.


## Utilisation

### Accès à l'application

Une fois le serveur démarré, accédez à l'application via l'URL :  
```
http://localhost:<PORT>
```
Remplacez `<PORT>` par le numéro de port défini dans votre fichier `.env`.

### Fonctionnalités principales

- **Gestion utilisateur :**
    - Création de compte (associations ou bénévole)
    - Connexion au compte

- **Associations :**
    - Créer une mission
    - Voir ses missions
    - Voir les candidatures pour les missions
    - Accépter une candidature pour une mission 

- **Bénévole :**
    - Voir les missions
    - Voir une seule mission
    - Poser une candidature pour une mission

    ## Structure du projet

    ```plaintext
    BENEVOLAT/
    │
    ├── server/
    │   ├── dao/
    │   │   ├── applications.dao.js
    │   │   ├── missions.dao.js
    │   │   └── users.dao.js
    │   ├── db/
    │   │   └── db.js
    │   ├── middleware/
    │   │   └── auth.js
    │   ├── routes/
    │   │   ├── apply.route.js
    │   │   ├── auth.route.js
    │   │   ├── connexion.route.js
    │   │   ├── missions.route.js
    │   │   └── register.route.js
    │   ├── utils/
    │   │   ├── createToken.js
    │   │   ├── hash.js
    │   │   ├── readToken.js
    │   │   └── verifyHash.js
    │   └── app.js
    ├── .env
    ├── .gitattributes
    ├── .gitignore
    ├── init.sql
    ├── package-lock.json
    ├── package.json
    └── README.md   
    ```

## Routes



### Authentification

- `POST /register`  
    Crée un nouveau compte utilisateur (association ou bénévole).
    **Body attendu :**
    ```json
    {
      "name": "string",
      "email": "string",
      "password": "string",
      "description": "string (optionnel)",
      "type": "volunteer" | "association" (optionnel)
    }
    ```
    **Accès :** Public (pas de JWT requis)

- `POST /login`  
    Authentifie un utilisateur et retourne un token JWT.
    **Body attendu :**
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```
    **Accès :** Public (pas de JWT requis)

### Missions

- `GET /missions`  
    Récupère la liste de toutes les missions disponibles.
    **Accès :** Associations et bénévoles (JWT requis)

- `GET /missions/:id`  
    Récupère les détails d'une mission spécifique.
    **Accès :** Associations et bénévoles (JWT requis)

- `POST /missions/create`  
    Crée une nouvelle mission.
    **Body attendu :**
    ```json
    {
      "name": "string",
      "description": "string (optionnel)",
      "duration": "number"
    }
    ```
    **Accès :** Associations uniquement (JWT requis)

- `POST /missions/list`  
    Récupère les missions créées par une association spécifique.
    **Accès :** Associations uniquement (JWT requis)

### Candidatures

- `POST /apply/:id`  
    Permet à un bénévole de postuler à une mission.
    **Body attendu :**
    ```json
    {}
    ```
    (Aucun champ requis, l'utilisateur est identifié par le token)
    **Accès :** Bénévoles uniquement (JWT requis)

- `GET /applications/mission/:missionId`  
    Récupère toutes les candidatures pour une mission donnée.
    **Accès :** Associations uniquement (JWT requis)

- `POST /application/accept/:id`  
    Accepte une candidature pour une mission.
    **Body attendu :**
    ```json
    {
      "userId": "number"
    }
    ```
    **Accès :** Associations uniquement (JWT requis)

### Utilisateurs

- `GET /users/:id`  
    Récupère les informations d'un utilisateur.
    **Accès :** Associations et bénévoles (JWT requis)

- `GET /users`  
    Récupère la liste de tous les utilisateurs.
    **Accès :** Associations et bénévoles (JWT requis)

### Connexion

- `POST /connexion`  
    Permet la connexion d'un utilisateur (équivalent à `/login`).
    **Body attendu :**
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```
    **Accès :** Public (pas de JWT requis)

---

**Remarque :**  
Certaines routes nécessitent une authentification via JWT et des droits spécifiques (association ou bénévole).