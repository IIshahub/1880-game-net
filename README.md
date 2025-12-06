# Game Collection - Next.js + React + Three.js

A collection of fun games built with Next.js, React, and Three.js.

## Features

- 🎮 Multiple games in one collection
- 🎨 Theme selection system
- 🚀 Built with Next.js 14 (App Router)
- ⚛️ React 18
- 🎯 Three.js for 3D graphics
- 📱 Responsive design

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page (game menu)
│   ├── globals.css        # Global styles
│   └── game/
│       └── [gameId]/
│           └── page.tsx   # Dynamic game pages
├── src/
│   ├── components/        # React components
│   │   ├── RoadCrossingGame.tsx
│   │   ├── ThemeModal.tsx
│   │   └── ...            # Three.js game components
│   ├── hooks/             # React hooks
│   ├── games.js           # Game definitions
│   ├── gameManager.js     # Game management
│   ├── themes.js          # Theme definitions
│   └── themeManager.js    # Theme management
└── public/                # Static assets
```

## Available Games

- **Road Crossing** - Cross the road and avoid vehicles!

## Adding New Games

1. Add game definition to `src/games.js`:
```javascript
export const games = {
  // ... existing games
  newGame: {
    id: "newGame",
    name: "New Game",
    icon: "🎮",
    description: "Description of new game",
    color: "#ff6b6b",
  },
};
```

2. Create game component in `src/components/NewGame.tsx`

3. Add route in `app/game/[gameId]/page.tsx`:
```typescript
if (gameId === 'newGame') {
  return <NewGame />;
}
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Technologies

- **Next.js 14** - React framework
- **React 18** - UI library
- **Three.js** - 3D graphics
- **TypeScript** - Type safety

## License

MIT

