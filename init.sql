-- Création de la base de données
DROP DATABASE IF EXISTS benevolat;
CREATE DATABASE benevolat;
USE benevolat;


-- Création des tables
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(999) NOT NULL,
    creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    type ENUM("volunteer", "association") NOT NULL DEFAULT "volunteer",
    description MEDIUMTEXT DEFAULT NULL
);

CREATE TABLE missions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description MEDIUMTEXT DEFAULT NULL,
    duration INT NOT NULL,
    status ENUM("pending", "closed") DEFAULT "pending",
    id_association INT,
    FOREIGN KEY (id_association) REFERENCES users(id)
);

CREATE TABLE applications (
    id_user INT,
    id_mission INT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    state ENUM("pending", "accepted", "rejected") DEFAULT "pending",
    FOREIGN KEY (id_user) REFERENCES users(id),
    FOREIGN KEY (id_mission) REFERENCES missions(id)
);



-- Insertions des données de test
INSERT INTO users (name, email, password, type, description) VALUES
('Alice Dupont', 'AliceDupont@gmail.com', 'password', 'volunteer', 'Étudiante motivée à aider.'),
('Jean Martin', 'JeanMartin@gmail.com', 'password', 'volunteer', 'Disponible les week-ends.'),
('Sophie Bernard', 'SophieBernard@gmail.com', 'password', 'volunteer', 'Intéressée par l’aide aux personnes âgées.'),
('Lucas Petit', 'LucasPetit@gmail.com', 'password', 'volunteer', 'Passionné par l’environnement.'),
('Emma Leroy', 'EmmaLeroy@gmail.com', 'password', 'volunteer', 'Aime travailler en équipe.'),
('Tom Moreau', 'TomMoreau@gmail.com', 'password', 'volunteer', 'Expérience en animation.'),
('Julie Robert', 'JulieRobert@gmail.com', 'password', 'volunteer', 'Disponible en soirée.'),
('Association Soleil', 'AssociationSoleil@gmail.com', 'password', 'association', 'Aide aux enfants défavorisés.'),
('Association Nature', 'AssociationNature@gmail.com', 'password', 'association', 'Protection de la nature.');

INSERT INTO missions (name, description, duration, status, id_association) VALUES
('Aide aux devoirs', 'Aider les enfants avec leurs devoirs après l\'école.', 2, 'pending', 8),
('Collecte de vêtements', 'Organiser une collecte de vêtements pour les personnes dans le besoin.', 3, 'pending', 8),
('Visites aux personnes âgées', 'Rendre visite aux personnes âgées dans les maisons de retraite.', 1, 'pending', 8),
('Nettoyage de parcs', 'Participer à des sessions de nettoyage dans les parcs locaux.', 4, 'pending', 9),
('Plantation d\'arbres', 'Aider à planter des arbres dans les zones urbaines.', 5, 'pending', 9);

INSERT INTO applications (id_user, id_mission, state) VALUES
(1, 1, 'pending'),
(2, 1, 'accepted'),
(3, 2, 'rejected'),
(4, 3, 'pending'),
(5, 4, 'accepted'),
(6, 5, 'pending');

