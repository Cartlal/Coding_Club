# Coding Club Website - Frontend

A modern, responsive website for the Coding Club at KLE, built with React and Vite.

## Tech Stack

- **React** (^18.3.1) - UI library
- **Vite** (^5.4.0) - Build tool and dev server
- **Tailwind CSS** (^3.4.1) - Utility-first CSS framework
- **React Router** (^6.26.0) - Client-side routing
- **ESLint** (^9.9.0) - Code quality and linting

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Development

Start the development server:
```bash
npm run dev
```

The application will open automatically at `http://localhost:3000`

## Building

Build for production:
```bash
npm run build
```

Preview production build locally:
```bash
npm run preview
```

## Code Quality

Run ESLint to check code quality:
```bash
npm run lint
```

## Project Structure

```
src/
├── assets/           # Static assets (images, icons, fonts)
│   ├── images/      # Image files
│   └── icons/       # Icon files and favicon
├── components/       # Reusable React components
│   ├── navbar/      # Navigation components
│   ├── footer/      # Footer components
│   ├── ui/          # UI primitives (buttons, cards, inputs)
│   ├── event/       # Event-specific components
│   ├── member/      # Member-specific components
│   └── leaderboard/ # Leaderboard-specific components
├── pages/            # Page-level components for routing
│   ├── Home.jsx
│   ├── Events.jsx
│   ├── Members.jsx
│   ├── Leaderboard.jsx
│   ├── Login.jsx
│   └── NotFound.jsx
├── context/          # React Context providers
│   └── ThemeContext.jsx
├── styles/           # Global styles
│   └── index.css
├── utils/            # Utility functions and helpers
├── App.jsx           # Root component with routing
└── main.jsx          # Application entry point
public/               # Static files served at root
```

## Features

- ✨ Responsive design with Tailwind CSS
- 🌓 Dark mode support (to be implemented)
- 🎯 Clean, modular component architecture
- 📱 Mobile-first approach
- ⚡ Fast development with Vite HMR
- 🔍 Code quality with ESLint

## Contributing

[Contribution guidelines to be added]

## License

[License information to be added]
# Coding_Club
