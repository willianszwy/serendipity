# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal tracking PWA called "Serendipity" built as a single React TSX component. The app allows users to track daily meaningful moments across four categories: Gratidão (Gratitude), Serendipity, Manifestação (Manifestation), and Novo desejo (New desires).

## Architecture

- **Single Component**: The entire application is contained in `serendipity-pwa (1).tsx` as a React functional component
- **State Management**: Uses React hooks (useState, useEffect) for local state management
- **Data Persistence**: Uses localStorage to persist entries across sessions
- **UI Framework**: Built with Tailwind CSS for styling and Lucide React for icons

## Key Components

- **SerendipityApp**: Main application component managing all state and views
- **EntryCard**: Component for displaying individual entries with edit/delete functionality
- **EntryForm**: Modal component for adding/editing entries

## Data Structure

Entries are stored as objects with the following structure:
- `id`: Timestamp-based unique identifier
- `category`: One of 'gratidao', 'serendipity', 'manifestacao', 'desejo', 'sonho'
- `description`: Text description of the event (max 500 characters)
- `date`: Entry date
- `time`: Optional time field
- `link1`, `link2`, `link3`: Optional URL fields
- `createdAt`: ISO timestamp of creation

## UI Color Scheme

- Background: `#e8dfe0` (light pink/beige)
- Primary text: `#52473d` (dark brown)
- Daily card: `#8a9ea7` (blue-gray)
- Monthly card: `#8d9b6a` (olive green)
- Yearly card: `#e9c770` (yellow)
- Accent: Pink colors for buttons and highlights

## Development Notes

Since this is a single-file React component, any modifications should:
1. Maintain the existing state management patterns
2. Preserve localStorage integration for data persistence
3. Keep the responsive design using Tailwind classes
4. Maintain the Portuguese language interface