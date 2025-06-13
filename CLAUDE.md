# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Taiwanese leave management system ("請假系統") built with Next.js 15, Material-UI, and TypeScript. The application allows users to submit leave applications and view application records. All UI text and content are in Traditional Chinese.

## Key Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production version
- `npm run lint` - Run ESLint
- `npm start` - Start production server

Development server runs on http://localhost:3000

## Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **UI Library**: Material-UI (MUI) v7 with Chinese locale (zhTW)
- **Styling**: Tailwind CSS v4 + MUI styled components
- **Language**: TypeScript with strict mode
- **Fonts**: Geist Sans and Geist Mono

### Project Structure
- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - Reusable React components
- `src/app/api/leave-applications/` - REST API endpoints for leave applications
- Path alias `@/*` maps to `./src/*`

### Data Storage
Currently uses in-memory storage for leave applications (see `src/app/api/leave-applications/route.ts:4`). In production, this should be replaced with a database.

### Key Components
- `ThemeProvider` - MUI theme wrapper with Chinese locale support
- `Navbar` - Main navigation with styled Material-UI components
- Leave application forms and listing pages use MUI components

### API Structure
- `POST /api/leave-applications` - Submit new leave application
- `GET /api/leave-applications` - Retrieve all applications

### Language and Locale
- All UI text is in Traditional Chinese (zh-TW)
- HTML lang attribute set to "zh-TW"
- MUI configured with zhTW locale