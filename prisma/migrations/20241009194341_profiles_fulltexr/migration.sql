-- CreateIndex
CREATE FULLTEXT INDEX `profiles_username_idx` ON `profiles`(`username`);

-- CreateIndex
CREATE FULLTEXT INDEX `profiles_firstname_idx` ON `profiles`(`firstname`);

-- CreateIndex
CREATE FULLTEXT INDEX `profiles_lastname_idx` ON `profiles`(`lastname`);

-- CreateIndex
CREATE FULLTEXT INDEX `profiles_username_firstname_lastname_idx` ON `profiles`(`username`, `firstname`, `lastname`);
