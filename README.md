# 🏰 Mock Battle Simulator for Map Game Warfare System ⚔️

This project is a comprehensive HTML/CSS/JavaScript application designed to help users create, simulate, and manage mock battles for a custom map game warfare system. It follows the detailed warfare tutorial by John, Princeps Corvinus {Lex}.

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
├── index.html          # Main application file
├── battle.js           # Battle simulation logic
├── background-music.mp3 # Combat music
├── README.md           # This file
└── images/             # Unit artwork
    ├── cav.jpg
    ├── heavy.jpg
    ├── light.jpg
    ├── ranged.jpg
    ├── support.png
    ├── general1.png
    └── general2.png
```

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

