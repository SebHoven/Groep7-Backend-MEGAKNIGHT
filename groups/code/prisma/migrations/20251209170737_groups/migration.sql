-- CreateTable
CREATE TABLE "Battlepass" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "BattlepassReward" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "level" INTEGER NOT NULL,
    "avatarItemId" INTEGER NOT NULL,
    "battlepassId" INTEGER NOT NULL,
    CONSTRAINT "BattlepassReward_avatarItemId_fkey" FOREIGN KEY ("avatarItemId") REFERENCES "AvatarItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BattlepassReward_battlepassId_fkey" FOREIGN KEY ("battlepassId") REFERENCES "Battlepass" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BattlepassProgress" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "xp" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,
    "battlepassId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    CONSTRAINT "BattlepassProgress_battlepassId_fkey" FOREIGN KEY ("battlepassId") REFERENCES "Battlepass" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BattlepassProgress_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
