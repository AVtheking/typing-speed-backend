-- CreateEnum
CREATE TYPE "Language" AS ENUM ('English', 'Hindi', 'Spanish', 'Frendh');

-- CreateEnum
CREATE TYPE "TimeZones" AS ENUM ('IST', 'EST', 'CST', 'PST', 'UTC');

-- CreateTable
CREATE TABLE "admin_settings" (
    "id" TEXT NOT NULL,
    "siteTitle" TEXT NOT NULL,
    "metaDescription" TEXT NOT NULL,
    "logoImage" TEXT,
    "defaultLanguage" "Language" NOT NULL,
    "defaultTimeZone" "TimeZones" NOT NULL,
    "useSEOfriendlyurl" BOOLEAN NOT NULL,
    "discourageSearchEngine" BOOLEAN NOT NULL,
    "maintainenceMode" BOOLEAN NOT NULL,
    "maintainenceMessage" TEXT,
    "euCookieNotification" BOOLEAN NOT NULL,
    "analyticsTrackingCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "admin_settings_id_idx" ON "admin_settings"("id");
