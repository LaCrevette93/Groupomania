-- MySQL dump 10.13  Distrib 8.0.21, for Win64 (x86_64)
--
-- Host: localhost    Database: groupomania
-- ------------------------------------------------------
-- Server version	8.0.21

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `commentaires`
--

DROP TABLE IF EXISTS `commentaires`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `commentaires` (
  `id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `message` longtext NOT NULL,
  `publication_id` smallint unsigned NOT NULL,
  `auteur` varchar(60) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `commentaires_key` (`publication_id`),
  CONSTRAINT `commentaires_key` FOREIGN KEY (`publication_id`) REFERENCES `publication` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `commentaires`
--

LOCK TABLES `commentaires` WRITE;
/*!40000 ALTER TABLE `commentaires` DISABLE KEYS */;
INSERT INTO `commentaires` VALUES (4,'2020-08-31','C\'est chouette',7,'RGltaXRyaSBMQVVCUk9O');
/*!40000 ALTER TABLE `commentaires` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes` (
  `id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `publication_id` smallint unsigned NOT NULL,
  `user_id` smallint unsigned NOT NULL,
  `type` smallint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `likes_key` (`publication_id`),
  CONSTRAINT `likes_key` FOREIGN KEY (`publication_id`) REFERENCES `publication` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
INSERT INTO `likes` VALUES (8,7,1,-1);
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `publication`
--

DROP TABLE IF EXISTS `publication`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `publication` (
  `id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `nom_id` smallint unsigned NOT NULL,
  `titre` varchar(100) NOT NULL,
  `thematique` varchar(100) NOT NULL,
  `description` varchar(3500) NOT NULL,
  `type` varchar(30) NOT NULL,
  `date_emission` date NOT NULL,
  `media_path` varchar(255) DEFAULT NULL,
  `userId_positif_reaction` text NOT NULL,
  `userId_negatif_reaction` text NOT NULL,
  `nb_negatif_reaction` int NOT NULL,
  `nb_positif_reaction` int NOT NULL,
  `auteur` varchar(60) NOT NULL,
  `fond_publication_path` varchar(255) NOT NULL,
  `statut` varchar(8) DEFAULT 'no-check',
  PRIMARY KEY (`id`),
  KEY `publication_key` (`nom_id`),
  CONSTRAINT `publication_key` FOREIGN KEY (`nom_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `publication`
--

LOCK TABLES `publication` WRITE;
/*!40000 ALTER TABLE `publication` DISABLE KEYS */;
INSERT INTO `publication` VALUES (7,4,'Le brochet','Formation','kjdlkjglj jlgjgrjj j l avec','texte','2020-08-31','http://localhost:3000/medias/Sans_titre1598858234885.jpeg','No-likes ','No-likes 1',1,0,'VkVSREk= RGltaXRyaQ==','http://localhost:3000/medias/logo_forum_texte.png','check'),(8,4,'Le brochet','Animaux','jlkjlkj ljbjrjljl','video','2020-08-31','http://localhost:3000/medias/Compilation,_grosse_attaque_de_brochet_a_vue1598858277978.mp4','No-likes','No-likes',0,0,'VkVSREk= RGltaXRyaQ==','http://localhost:3000/medias/logo_forum_video.png','check');
/*!40000 ALTER TABLE `publication` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `date_inscription` date NOT NULL,
  `imageUrl` text NOT NULL,
  `motDePasse` varchar(255) NOT NULL,
  `nb_publications` int DEFAULT '0',
  `nb_commentaires` int DEFAULT '0',
  `popularite` int DEFAULT '0',
  `role` varchar(5) DEFAULT 'user',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'TEFVQlJPTg==','RGltaXRyaQ==','c25pZmZpbmdAaG90bWFpbC5mcg==','2020-08-30','http://localhost:3000/medias/unknown-user.jpg','$2b$10$aN2IQgothScs2htECm2ReewgzYQzPzIsfLYBen2nzC5DVOtXISjaK',2,2,0,'admin'),(4,'VkVSREk=','RGltaXRyaQ==','ZW1wbG9pbGF1YnJvbkBob3RtYWlsLmZy','2020-08-31','http://localhost:3000/medias/unknown-user.jpg','$2b$10$vqfnnAkDBj67DC3Zri8GjO816F3pc5D8L/bdtUNuuHbyDwryjeb1i',2,0,0,'user');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-08-31 10:55:18
