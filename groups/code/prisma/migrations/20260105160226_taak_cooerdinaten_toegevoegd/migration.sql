/*
  Warnings:

  - You are about to drop the column `coordinates` on the `Task` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "date" DATETIME,
    "icon" TEXT,
    "xp" INTEGER,
    "x" REAL,
    "y" REAL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "teacherId" INTEGER NOT NULL,
    CONSTRAINT "Task_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Task" ("completed", "createdAt", "date", "description", "icon", "id", "name", "teacherId", "xp") SELECT "completed", "createdAt", "date", "description", "icon", "id", "name", "teacherId", "xp" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
