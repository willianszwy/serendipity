# Serendipity PWA

A personal tracking Progressive Web App (PWA) for meaningful daily moments built with React and TypeScript.

## Features

- Track daily moments across 4 categories: Gratitude, Serendipity, Manifestation, and New Desires
- Daily, monthly, and yearly statistics
- Offline functionality with service worker
- Local storage for data persistence
- Mobile-first responsive design
- Installable as a mobile app

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Building for Production

```bash
npm run build
```

The build folder will contain the production-ready files optimized for deployment.

## PWA Features

- **Offline Support**: The app works offline thanks to the service worker
- **Installable**: Can be installed on mobile devices and desktop
- **App-like Experience**: Full-screen standalone display mode

## Project Structure

```
src/
  ├── App.tsx          # Main application component
  ├── index.tsx        # React DOM entry point
  └── index.css        # Global styles
public/
  ├── manifest.json    # PWA manifest
  ├── sw.js           # Service worker
  └── index.html      # HTML template
```

## Technologies Used

- React 18 with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Service Worker for offline functionality
- Local Storage for data persistence