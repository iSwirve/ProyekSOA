/*
SQLyog Ultimate v13.1.1 (64 bit)
MySQL - 10.4.14-MariaDB : Database - proyeksoa
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`proyeksoa` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;

USE `proyeksoa`;

/*Table structure for table `social_friend` */

DROP TABLE IF EXISTS `social_friend`;

CREATE TABLE `social_friend` (
  `email_first` varchar(255) DEFAULT NULL,
  `email_second` varchar(255) DEFAULT NULL,
  `status` int(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `social_friend` */

insert  into `social_friend`(`email_first`,`email_second`,`status`) values 
('kevin@gmail.com','john@gmail.com',4);

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `nama_user` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `no_telp` varchar(255) NOT NULL,
  `tanggal_daftar` varchar(255) NOT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `users` */

insert  into `users`(`email`,`username`,`nama_user`,`password`,`no_telp`,`tanggal_daftar`) values 
('john@gmail.com','john','john','1001','0999999912','05/31/2022'),
('kevin@gmail.com','kevin','kevin','123','08999953232','06/10/2022');

/*Table structure for table `wishlist` */

DROP TABLE IF EXISTS `wishlist`;

CREATE TABLE `wishlist` (
  `email_user` varchar(255) DEFAULT NULL,
  `game_id` varchar(255) DEFAULT NULL,
  KEY `email_user` (`email_user`),
  CONSTRAINT `wishlist_ibfk_1` FOREIGN KEY (`email_user`) REFERENCES `users` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `wishlist` */

insert  into `wishlist`(`email_user`,`game_id`) values 
('john@gmail.com','23');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
