/*
  # Add Portfolio Table

  1. New Tables
    - `portfolios`
      - `id` (text, primary key)
      - `title` (text, required)
      - `description` (text, required)
      - `imageUrl` (text, optional)
      - `category` (text, required)
      - `projectUrl` (text, optional)
      - `isActive` (boolean, default true)
      - `order` (integer, default 0)
      - `createdAt` (timestamp, default now)
      - `updatedAt` (timestamp, auto-update)

  2. Security
    - No RLS needed for public portfolio display
    - Admin access controlled via API authentication

  3. Changes
    - Added portfolio table for project showcase
    - Supports categorization and ordering
    - Optional project URLs for external links
*/

-- CreateTable
CREATE TABLE IF NOT EXISTS "portfolios" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "category" TEXT NOT NULL,
    "projectUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portfolios_pkey" PRIMARY KEY ("id")
);