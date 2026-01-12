/*
  Warnings:

  - You are about to drop the `AvatarItemHasAvatar` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `bodyItemId` to the `Avatar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `feetItemId` to the `Avatar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hairColorId` to the `Avatar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `legsItemId` to the `Avatar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `skinColorId` to the `Avatar` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AvatarItemHasAvatar";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Avatar" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hairColorId" INTEGER NOT NULL,
    "bodyItemId" INTEGER NOT NULL,
    "legsItemId" INTEGER NOT NULL,
    "feetItemId" INTEGER NOT NULL,
    "skinColorId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    CONSTRAINT "Avatar_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Avatar_hairColorId_fkey" FOREIGN KEY ("hairColorId") REFERENCES "AvatarItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Avatar_bodyItemId_fkey" FOREIGN KEY ("bodyItemId") REFERENCES "AvatarItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Avatar_legsItemId_fkey" FOREIGN KEY ("legsItemId") REFERENCES "AvatarItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Avatar_feetItemId_fkey" FOREIGN KEY ("feetItemId") REFERENCES "AvatarItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Avatar_skinColorId_fkey" FOREIGN KEY ("skinColorId") REFERENCES "AvatarItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Avatar" ("createdAt", "id", "studentId") SELECT "createdAt", "id", "studentId" FROM "Avatar";
DROP TABLE "Avatar";
ALTER TABLE "new_Avatar" RENAME TO "Avatar";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
