-- CreateTable
CREATE TABLE "Avatar" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "studentId" INTEGER NOT NULL,
    "hairColor" TEXT,
    "skinColor" TEXT,
    "shirtColor" TEXT,
    "pantsColor" TEXT,
    "shoeColor" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Avatar_studentId_key" ON "Avatar"("studentId");
