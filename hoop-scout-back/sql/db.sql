CREATE TABLE "User"(
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" DATE NOT NULL
);
ALTER TABLE
    "User" ADD PRIMARY KEY("id");
ALTER TABLE
    "User" ADD CONSTRAINT "user_email_unique" UNIQUE("email");
CREATE TABLE "Athlete"(
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "height" TEXT NOT NULL,
    "weight" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "freeThrow" TEXT NOT NULL,
    "longShot" TEXT NOT NULL,
    "shortShot" TEXT NOT NULL,
    "assistsGame" INTEGER NOT NULL
);
ALTER TABLE
    "Athlete" ADD PRIMARY KEY("id");
ALTER TABLE
    "Athlete" ADD CONSTRAINT "athlete_userid_unique" UNIQUE("userId");
ALTER TABLE
    "Athlete" ADD CONSTRAINT "athlete_userid_foreign" FOREIGN KEY("userId") REFERENCES "User"("id");
ALTER TABLE "Athlete" 
    ADD COLUMN "coachId" INTEGER NOT NULL, 
    ADD COLUMN "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Athlete" 
    ADD CONSTRAINT fk_coach FOREIGN KEY ("coachId") REFERENCES "User"(id) ON DELETE SET NULL;