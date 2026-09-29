-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Food" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "calories" DECIMAL(10,2) NOT NULL,
    "protein" DECIMAL(10,2) NOT NULL,
    "carbs" DECIMAL(10,2) NOT NULL,
    "fat" DECIMAL(10,2) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Food_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Meal" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Meal_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MealItem" (
    "id" TEXT NOT NULL,
    "mealId" TEXT NOT NULL,
    "foodId" TEXT NOT NULL,
    "grams" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MealItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "FoodLog" (
    "id" TEXT NOT NULL,
    "mealId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "portions" DECIMAL(8,2) NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FoodLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "WaterLog" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "milliliters" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WaterLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "BowelMovement" (
    "id" TEXT NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BowelMovement_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ExerciseLog" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "activity" TEXT NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "distanceKilometers" DECIMAL(8,2),
    "caloriesBurned" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ExerciseLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "BasalRate" (
    "id" TEXT NOT NULL,
    "effectiveDate" DATE NOT NULL,
    "calories" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "BasalRate_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DailyGoals" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "calories" DECIMAL(10,2) NOT NULL DEFAULT 1265,
    "protein" DECIMAL(10,2) NOT NULL DEFAULT 132,
    "carbs" DECIMAL(10,2) NOT NULL DEFAULT 120,
    "fat" DECIMAL(10,2) NOT NULL DEFAULT 31,
    "waterMl" INTEGER NOT NULL DEFAULT 3100,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "DailyGoals_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AppSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "schemaVersion" INTEGER NOT NULL DEFAULT 1,
    "timezone" TEXT NOT NULL DEFAULT 'America/Sao_Paulo',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AppSettings_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "FoodLog_date_idx" ON "FoodLog"("date");
CREATE INDEX "WaterLog_date_idx" ON "WaterLog"("date");
CREATE INDEX "BowelMovement_occurredAt_idx" ON "BowelMovement"("occurredAt");
CREATE INDEX "ExerciseLog_date_idx" ON "ExerciseLog"("date");
CREATE UNIQUE INDEX "BasalRate_effectiveDate_key" ON "BasalRate"("effectiveDate");

ALTER TABLE "MealItem" ADD CONSTRAINT "MealItem_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MealItem" ADD CONSTRAINT "MealItem_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "FoodLog" ADD CONSTRAINT "FoodLog_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
