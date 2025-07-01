# 🏰 Mock Battle Simulator for Map Game Warfare System ⚔️

This project is a comprehensive HTML/CSS/JavaScript application designed to help users create, simulate, and manage mock battles for a custom map game warfare system. It follows the detailed warfare tutorial by John, Princeps Corvinus {Lex}.

## 🌍 Map Game Overview

**Welcome to the World of Hegemony** - a grand strategy roleplaying game set in the mystical world of **Aethel**. Players assume the role of nation leaders, guiding their civilizations through complex political landscapes, economic challenges, and military campaigns.

### Game Purpose & Mechanics
This map game combines strategic planning, diplomatic negotiation, and tactical warfare in an immersive roleplaying environment. Players must balance multiple aspects of leadership:

- **🗺️ Territorial Management**: Expand your nation's borders through strategic conquest and diplomatic annexation
- **⚔️ Military Command**: Build and deploy armies using a sophisticated unit system with enhancements and general traits
- **🤝 Diplomatic Relations**: Forge alliances, negotiate treaties, and manage complex international relationships
- **💰 Economic Development**: Generate silver through trade, resource management, and infrastructure development
- **🎭 Narrative Roleplay**: Participate in events, quests, and storylines that shape the world's history
- **⛪ Cultural Identity**: Choose religions and cultural enhancements that provide unique bonuses and abilities

### Gameplay Flow
The game operates through structured phases where players make decisions across multiple interconnected systems. Military actions are resolved through detailed battle simulations, diplomatic agreements are negotiated through roleplay, and economic growth is managed through infrastructure development. The battle simulator component of this application serves as a crucial tool for testing military strategies before committing to actual conflicts.

## ✨ Features

### 🛡️ **Army & Unit Management**
- **5 Brigade Types**: Cavalry, Heavy Infantry, Light Infantry, Ranged, and Support units
- **Unit Enhancements**: 15+ different enhancements with unique bonuses and special abilities
- **Visual Unit Display**: Images and detailed stats for each unit type
- **Add/Remove Units**: Easy controls to build and modify your armies
- **Unit Count Tracking**: Visual display of unit quantities

### ⚔️ **Battle Simulation System**
- **Authentic Battle Flow**: Follows the tutorial's 4-stage battle system:
  - **Skirmish Stage**: Best skirmishers from each side engage
  - **Pitch Stage**: Up to 3 rounds of main combat with 5-second delays between rounds
  - **Rally Stage**: Morale checks for surviving units
  - **Action Report**: Destruction rolls and general fate determination
- **Realistic Combat**: Proper stat calculations including garrison bonuses
- **Named Battles**: Custom army, general, and location names for immersive storytelling

### 🎭 **Customization Options**
- **Custom Names**: User-defined army names, general names, and battle locations
- **Battle Types**: Open field battles vs. siege warfare
- **City Sieges**: Tier 1-3 cities with appropriate garrison forces
- **General Traits**: All 20 general traits with proper mechanical effects
- **General Levels**: 1-10 level system affecting combat performance

### 🎨 **Modern UI/UX**
- **Glassmorphism Design**: Beautiful semi-transparent elements with backdrop blur
- **Gradient Backgrounds**: Purple-to-blue theme with animated effects
- **Interactive Elements**: Hover effects, animations, and smooth transitions
- **Responsive Layout**: Works on desktop and mobile devices
- **Battle History**: Multiple battles displayed with separators

### 🎵 **Audio Features**
- **Background Music**: Atmospheric combat music with toggle controls
- **Music Controls**: Play/pause button with visual feedback

## 🚀 Getting Started

### Prerequisites
- Any modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software installation required

### Installation
1. **Clone or Download** the repository to your local machine
2. **Open** the `index.html` file in your web browser
3. **Start Building** your armies and simulating battles!

### Quick Start Guide
1. **Set Up Battle Details** (optional):
   - Enter custom army names, general names, and battle location
   - If left blank, random names will be generated
2. **Build Army A**:
   - Select unit type from dropdown
   - Choose enhancement (if desired)
   - Set quantity and click "Add"
   - Use remove buttons (-1 or ❌) to modify units
3. **Build Army B** (same process as Army A)
4. **Configure Generals**:
   - Set general levels (1-10)
   - Choose general traits from dropdown
5. **Select Battle Type**:
   - Open Battle: Field combat between armies
   - Siege: Army A attacks a fortified city
6. **Simulate Battle**: Click the battle button and watch the action unfold!
7. **Run Multiple Battles**: Results stack up, use "New Battle" to clear

## 📋 Brigade Types & Stats

| Type | Skirmish | Pitch | Defense | Rally | Movement | Special Abilities |
|------|----------|-------|---------|-------|----------|-------------------|
| **Cavalry** | +1 | +1 | 0 | 0 | 5 | Fast movement, shock tactics |
| **Heavy Infantry** | 0 | +1 | +2 | +1 | 3 | Tank damage, strong defense |
| **Light Infantry** | +2 | 0 | 0 | +1 | 4 | Excellent skirmishers |
| **Ranged** | 0 | +1 | +2 | 0 | 4 | Defensive positioning |
| **Support** | 0 | 0 | +2 | +1 | 4 | Army support and healing |

## 🎯 Enhancement System

### Cavalry Enhancements
- **Life Guard**: +2 Rally, general reroll ability
- **Lancers**: +2 Skirmish, destruction on rout
- **Dragoons**: +2 Defense, +1 Pitch, +1 Rally

### Heavy Infantry Enhancements
- **Artillery Team**: +1 Defense, +1 Pitch, garrison bonus
- **Grenadiers**: +2 Skirmish, +2 Pitch
- **Stormtroopers**: +1 Pitch, +1 Rally, +1 Movement

### Light Infantry Enhancements
- **Rangers**: +2 Skirmish, +1 Pitch
- **Assault Team**: +1 Skirmish, target selection
- **Commando**: +2 Defense, +1 Pitch, stealth

### Ranged Enhancements
- **Sharpshooters**: +2 Defense, counter-skirmish
- **Mobile Platforms**: +1 Skirmish, +2 Defense, +1 Movement
- **Mortar Team**: +1 Pitch, +1 Rally, negate garrison

### Support Enhancements
- **Field Hospital**: Reroll destruction dice
- **Combat Engineers**: Build structures, reduce siege time
- **Officer Corps**: +2 Rally, promotion bonus

### Universal Enhancements
- **Sentry Team**: +3 Defense, extended sight
- **Marines**: Immediate siege, sea movement

## 👑 General Traits

The system includes all 20 general traits from the tutorial:
- **Ambitious**: Easier promotions
- **Bold**: Skirmish bonuses
- **Brilliant**: Double pitch contribution
- **Cautious**: Can skip skirmish phase
- **Confident**: Army-wide defense bonus
- **Heroic**: Sacrifice for army survival
- **Inspiring**: Rally rerolls and celebration bonus
- **Merciless**: Enhanced destruction rates
- And 12 more unique traits!

## 🏰 Siege Warfare

### City Garrison Composition
- **Tier 1**: 1 Heavy + 2 Ranged brigades
- **Tier 2**: 2 Heavy + 3 Ranged brigades  
- **Tier 3**: 3 Heavy + 4 Ranged brigades

### Garrison Bonuses
- +2 Defense (already applied in simulation)
- +2 Rally (already applied in simulation)
- Cannot be selected as skirmishers

## 🎮 Battle Mechanics

### Timing System
- **Initial Setup**: 2-second display
- **Skirmish Results**: 3-second delay
- **Between Pitch Rounds**: 5-second delays for drama
- **Rally Phase**: 2-second setup, 3-second results
- **Action Report**: Staggered reveals with 3-second delays

### Victory Conditions
- **Decisive Victory**: Pitch tally reaches ±20
- **Standard Victory**: More surviving brigades after destruction rolls
- **Draw**: Equal survivors remaining

## 🛠️ Technical Details

### File Structure
```
mapgamestuff/
├── .gitattributes              # Git version control attributes configuration
├── .gitignore                  # Files and directories to ignore in version control
├── README.md                   # Comprehensive project documentation
├── background-music.mp3        # Atmospheric combat music for battle simulator
├── battle-simulator.html       # Advanced battle simulation interface
├── battle.js                   # Core JavaScript logic for battle mechanics
├── boats.html                  # Naval management and fleet building interface
├── diplomacy.html              # Diplomatic relations and treaty management
├── enhancements.html           # Unit and cultural enhancement selection
├── index.html                  # Main application homepage and navigation hub
├── infrastructure.html         # Infrastructure development and city management
├── map.html                    # Interactive world map and territorial management
├── nav.html                    # Navigation component for consistent site structure
├── navy-battle-simulator.html  # Specialized naval combat simulation
├── religions.html              # Religious system and faith-based bonuses
├── roleplay.html               # Roleplay events, quests, and narrative content
├── silver.html                 # Economic system and silver resource management
├── style.css                   # Unified CSS styling for the entire application
├── warfare.html                # Military mechanics and warfare rules
└── images/                     # Visual assets and artwork directory
    ├── cav.jpg                 # Cavalry unit artwork
    ├── heavy.jpg               # Heavy infantry unit artwork
    ├── light.jpg               # Light infantry unit artwork
    ├── ranged.jpg              # Ranged unit artwork
    ├── support.png             # Support unit artwork
    ├── general1.png            # General portrait option 1
    └── general2.png            # General portrait option 2
```

### Root Directory Files Explained

- **`.gitattributes`**: Specifies Git attributes for proper line ending handling and file type recognition across different operating systems
- **`.gitignore`**: Defines files and directories that should be excluded from version control (build artifacts, temporary files, etc.)
- **`README.md`**: This comprehensive documentation file detailing the entire map game system and its components  
- **`background-music.mp3`**: Atmospheric medieval combat music that enhances the battle simulation experience
- **`battle-simulator.html`**: Advanced battle simulation interface with detailed unit management, general traits, and combat resolution
- **`battle.js`**: Core JavaScript engine containing all battle logic, statistical calculations, and combat mechanics
- **`boats.html`**: Naval management interface for building fleets, managing ships, and planning maritime operations
- **`diplomacy.html`**: Diplomatic interface for managing international relations, treaties, alliances, and political interactions
- **`enhancements.html`**: System for selecting and applying military unit enhancements and cultural bonuses to customize your nation
- **`images/`**: Directory containing all visual artwork including unit portraits, general images, and interface graphics
- **`index.html`**: Main application entry point providing navigation to all game systems and the central game overview
- **`infrastructure.html`**: Infrastructure development interface for managing cities, resources, trade routes, and economic growth
- **`map.html`**: Interactive world map interface for territorial management, expansion planning, and geographical strategy
- **`nav.html`**: Shared navigation component ensuring consistent interface structure across all game modules
- **`navy-battle-simulator.html`**: Specialized naval combat simulator with ship-to-ship battle mechanics and fleet engagement rules
- **`religions.html`**: Religious system interface for selecting faiths, managing religious bonuses, and spiritual development
- **`roleplay.html`**: Roleplay event management system for participating in narrative quests, storylines, and character development
- **`silver.html`**: Economic management interface for tracking silver resources, trade income, and financial planning
- **`style.css`**: Comprehensive CSS stylesheet providing consistent visual design, glassmorphism effects, and responsive layouts
- **`warfare.html`**: Military mechanics documentation and warfare rules reference for understanding combat systems

### Technologies Used
- **HTML5**: Semantic structure and accessibility
- **CSS3**: Modern styling with gradients, animations, and glassmorphism
- **Vanilla JavaScript**: ES6+ features, async/await, DOM manipulation
- **Tailwind CSS**: Utility-first CSS framework
- **Font Awesome**: Icon library for UI elements

## 🎨 Design Features

### Visual Theme
- **Fantasy Medieval**: Sword and shield iconography throughout
- **Purple Gradient**: Consistent color scheme across all elements
- **Glassmorphism**: Modern semi-transparent design trend
- **Smooth Animations**: Hover effects and transitions on all interactive elements

### Accessibility
- **Keyboard Navigation**: All buttons and inputs are keyboard accessible
- **Screen Reader Support**: Semantic HTML and ARIA labels
- **High Contrast**: Good color contrast ratios for readability
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 📈 Future Enhancements

Potential features for future development:
- **Campaign Mode**: Link multiple battles into a war campaign
- **Unit Experience**: Veterans gain bonuses from surviving battles
- **Terrain Effects**: Different battlefield types affecting combat
- **Naval Combat**: Ships and amphibious warfare
- **Multiplayer**: Real-time battles between human players
- **Save/Load**: Persistent army configurations
- **Statistics**: Battle history and win/loss tracking

## 📜 License

MIT License - Feel free to use, modify, and distribute this project.

## 🙏 Credits

- **Original Warfare System**: Designed by John, Princeps Corvinus {Lex} (gottfriedlex)
- **Implementation**: Mock Battle Simulator development team
- **Inspiration**: Classic tabletop wargaming and fantasy strategy games
- **Art Assets**: Various sources (ensure proper licensing for production use)

---

**Ready for Battle?** Load up your armies and may the best general win! ⚔️🏆

