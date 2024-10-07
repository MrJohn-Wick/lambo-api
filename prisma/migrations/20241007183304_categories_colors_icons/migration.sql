/*
  Warnings:

  - Added the required column `color` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `icon` to the `categories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `categories` ADD COLUMN `color` VARCHAR(191) NULL,
    ADD COLUMN `icon` VARCHAR(191) NULL;

UPDATE `categories` SET `color`='#3CB9FC' 
    WHERE title in ('Humor','Animals','Creativity','Family','Sports','Technology','Culture','Business'); 

UPDATE `categories` SET `color`='#C528ED'
    WHERE title in ('Food','Music','Travel','Health','Beauty','Dance','Education'); 

UPDATE `categories` SET `color`='#5B0F96'
    WHERE title in ('Entertainment','Movies','Videogames','Fashion','Cars','Science');
