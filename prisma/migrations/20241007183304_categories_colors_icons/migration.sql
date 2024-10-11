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

UPDATE `categories` SET `icon`='😂' 
    WHERE title = 'Humor';
UPDATE `categories` SET `icon`='🐶' 
    WHERE title = 'Animals';
UPDATE `categories` SET `icon`='✨' 
    WHERE title = 'Creativity';
UPDATE `categories` SET `icon`='🫂' 
    WHERE title = 'Family';
UPDATE `categories` SET `icon`='🚴‍♀️' 
    WHERE title = 'Sports';
UPDATE `categories` SET `icon`='👩‍💻' 
    WHERE title = 'Technology';
UPDATE `categories` SET `icon`='🔍' 
    WHERE title = 'Culture';
UPDATE `categories` SET `icon`='💼' 
    WHERE title = 'Business';
UPDATE `categories` SET `icon`='🍔' 
    WHERE title = 'Food';

UPDATE `categories` SET `icon`='🍔' 
    WHERE title = 'Food';
UPDATE `categories` SET `icon`='🎧' 
    WHERE title = 'Music';
UPDATE `categories` SET `icon`='✈️' 
    WHERE title = 'Travel';
UPDATE `categories` SET `icon`='🫀' 
    WHERE title = 'Health';
UPDATE `categories` SET `icon`='🌷' 
    WHERE title = 'Beauty';
UPDATE `categories` SET `icon`='💃' 
    WHERE title = 'Dance';
UPDATE `categories` SET `icon`='🎓' 
    WHERE title = 'Education';

UPDATE `categories` SET `icon`='🧩' 
    WHERE title = 'Entertainment';
UPDATE `categories` SET `icon`='🎬' 
    WHERE title = 'Movies';
UPDATE `categories` SET `icon`='🎮' 
    WHERE title = 'Videogames';
UPDATE `categories` SET `icon`='💄' 
    WHERE title = 'Fashion';
UPDATE `categories` SET `icon`='🚗' 
    WHERE title = 'Cars';
UPDATE `categories` SET `icon`='🔭' 
    WHERE title = 'Science';

ALTER TABLE `categories` CHANGE `color` `color` VARCHAR(191) NOT NULL;
ALTER TABLE `categories` CHANGE `icon` `icon` VARCHAR(191) NOT NULL;
