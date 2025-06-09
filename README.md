# Mock Battle Simulator for Map Game Warfare System

This project is a Single Page Application (SPA) designed to help users create, simulate, and manage mock battles for a custom map game warfare system. The tool is built with React and Material-UI for a modern, user-friendly experience, and is designed to be easily hosted on GitHub Pages.

## Features
- **Unit & Army Builder:** Create and customize brigades, assign enhancements, and group them under generals to form armies.
- **Battle Simulator:** Step through each stage of battle (Skirmish, Pitch, Rally, Action Report) with dice rolls, modifiers, and clear outcome logs.
- **Resource & Cap Management:** Track brigade caps, general caps, war college levels, and resources.
- **Aftermath Handling:** Manage retreat, scatter, and aftermath logic for battles.
- **Modern UI:** Built with React and Material-UI for a responsive and intuitive interface.
- **GitHub Pages Ready:** Easily deploy your app for public or private use.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (includes npm and npx)

### Installation
1. Clone this repository:
   ```powershell
   git clone <your-repo-url>
   cd mapgamestuff
   ```
2. Install dependencies:
   ```powershell
   cd mock-battle-sim
   npm install
   ```
3. Start the development server:
   ```powershell
   npm start
   ```

### Deployment
To deploy to GitHub Pages:
1. Add the following to your `package.json`:
   ```json
   "homepage": "https://<your-github-username>.github.io/<your-repo-name>"
   ```
2. Install the GitHub Pages package:
   ```powershell
   npm install --save gh-pages
   ```
3. Add these scripts to your `package.json`:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d build"
   ```
4. Deploy:
   ```powershell
   npm run deploy
   ```

## License
MIT

---

This project is inspired by the custom warfare system designed by John, Princeps Corvinus {Lex}.

