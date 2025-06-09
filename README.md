# Mock Battle Simulator for Map Game Warfare System

This project is a Single Page Application (SPA) designed to help users create, simulate, and manage mock battles for a custom map game warfare system. The tool is built with React and Material-UI for a modern, user-friendly experience, and is designed to be easily hosted on GitHub Pages.

## Features
- **Unit & Army Builder:** Create and customize brigades, assign enhancements, and group them under generals to form armies.
- **Battle Simulator:** Step through each stage of battle (Skirmish, Pitch, Rally, Action Report) with dice rolls, modifiers, and clear outcome logs.
- **Resource & Cap Management:** Track brigade caps, general caps, war college levels, and resources.
- **Aftermath Handling:** Manage retreat, scatter, and aftermath logic for battles.
- **Modern UI:** Built with React and Material-UI for a responsive and intuitive interface.
- **GitHub Pages Ready:** Easily deploy your app for public or private use.

## Updated Features

- **Enhanced Tutorial:** The tutorial now includes graphics for better visual appeal, making it easier to understand the rules and mechanics.
- **Dynamic Calendar:** Displays the current day and its corresponding phase (Rest Day or Organization/Movement/Battle Day).
- **Improved Battle Logs:** Detailed logs with tables and visuals for each stage of the battle.
- **Sample Armies:** Pre-built armies for quick testing and simulation.
- **Save/Load Functionality:** Save your custom armies and load them later using localStorage.

### Graphics
Graphics have been added to the tutorial sections to visually represent:
- Basics of the warfare system
- Brigade types and enhancements
- General traits and levels
- Action cycle phases
- Battle mechanics stages

### Deployment
To deploy the application:
1. Build the project:
   ```powershell
   npm run build
   ```
2. Deploy to GitHub Pages or your preferred hosting platform.

### Hosting on GitHub Pages
To host the application on GitHub Pages:

1. Ensure your repository is pushed to GitHub.
2. Install the `gh-pages` package as a dev dependency:
   ```powershell
   npm install gh-pages --save-dev
   ```
3. Add the following scripts to your `package.json` file:
   ```json
   "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
   }
   ```
4. Deploy the application:
   ```powershell
   npm run deploy
   ```
5. Your application will be hosted at `https://<your-username>.github.io/<your-repo-name>`.

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
   npm install
   ```
3. Start the development server:
   ```powershell
   npm start
   ```

## License
MIT

---

This project is inspired by the custom warfare system designed by John, Princeps Corvinus {Lex} or gottfriedlex.

