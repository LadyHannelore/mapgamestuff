/**
 * Battle Simulator - Professional Edition
 * Implements a comprehensive warfare simulation system based on tutorial mechanics
 * @author Mock Battle Simulator
 * @version 2.0
 */

'use strict';

console.log('Battle.js loading...');

/**
 * Unit statistics configuration matching tutorial specifications
 * @type {Object.<string, {skirmish: number, pitch: number, defense: number, rally: number, move: number}>}
 */
const UNIT_STATS = {
    cav: { skirmish: 1, pitch: 1, defense: 0, rally: 0, move: 5 },
    heavy: { skirmish: 0, pitch: 1, defense: 2, rally: 1, move: 3 },
    light: { skirmish: 2, pitch: 0, defense: 0, rally: 1, move: 4 },
    ranged: { skirmish: 0, pitch: 1, defense: 2, rally: 0, move: 4 },
    support: { skirmish: 0, pitch: 0, defense: 2, rally: 1, move: 4 }
};

/**
 * Enhancement effects configuration
 * @type {Object.<string, {skirmish?: number, pitch?: number, defense?: number, rally?: number, move?: number, special?: string}>}
 */
const ENHANCEMENTS = {
    // Cavalry enhancements
    'Life Guard': { rally: 2, special: 'general_reroll' },
    'Lancers': { skirmish: 2, special: 'rout_destruction' },
    'Dragoons': { defense: 2, pitch: 1, rally: 1 },
    
    // Heavy enhancements  
    'Artillery Team': { defense: 1, pitch: 1, special: 'garrison_pitch_bonus' },
    'Grenadiers': { skirmish: 2, pitch: 2 },
    'Stormtroopers': { pitch: 1, rally: 1, move: 1, special: 'ignore_trenches' },
    
    // Light enhancements
    'Rangers': { skirmish: 2, pitch: 1 },
    'Assault Team': { skirmish: 1, special: 'select_target' },
    'Commando': { defense: 2, pitch: 1, special: 'invisible_to_sentry' },
    
    // Ranged enhancements
    'Sharpshooters': { defense: 2, special: 'garrison_pitch_bonus_counter_skirmish' },
    'Mobile Platforms': { skirmish: 1, defense: 2, move: 1 },
    'Mortar Team': { pitch: 1, rally: 1, special: 'negate_garrison' },
    
    // Support enhancements
    'Field Hospital': { special: 'reroll_destruction' },
    'Combat Engineers': { special: 'build_structures_negate_trenches_reduce_siege' },
    'Officer Corps': { rally: 2, special: 'general_promotion_bonus_choose_retreat' },
    
    // Universal enhancements
    'Sentry Team': { defense: 3, special: 'extended_sight' },
    'Marines': { special: 'immediate_siege_sea_movement' }
};

/**
 * General trait effects configuration
 * @type {Object.<string, Object>}
 */
const GENERAL_TRAITS = {
    'Ambitious': { promotionBonus: -1 },
    'Bold': { skirmishBonus: 'half_level' },
    'Brilliant': { pitchMultiplier: 2 },
    'Brutal': { pillageBonus: true, razeBonus: true },
    'Cautious': { skipSkirmish: true },
    'Chivalrous': { siegeBonus: true },
    'Confident': { defense: 2, rally: 1 },
    'Defiant': { rally: 2 },
    'Disciplined': { pitch: 1, rally: 1 },
    'Dogged': { assistBattle: true },
    'Heroic': { rally: 1, sacrifice: true },
    'Inspiring': { rallyReroll: true, celebrateBonus: true },
    'Lucky': { promotionReroll: true },
    'Mariner': { seaMovement: 1, seaSiege: true },
    'Merciless': { destructionBonus: true },
    'Prodigious': { levelBonus: 2 },
    'Relentless': { landMovement: 1, pursuit: true },
    'Resolute': { defense: 3 },
    'Wary': { sightBonus: 1, alertness: true },
    'Zealous': { rally: 1, holyWarBonus: true }
};

// City garrison defenders by tier (matches tutorial)
const cityGarrisons = {
    1: { heavy: 1, ranged: 2 },
    2: { heavy: 2, ranged: 3 },
    3: { heavy: 3, ranged: 4 }
};

// Armies - make them global so they can be accessed from HTML
window.armyA = [];
window.armyB = [];

// DOM Elements - wait for DOM to be ready
let unitTypeA, unitCountA, addUnitA, armyAList, enhancementA;
let unitTypeB, unitCountB, addUnitB, armyBList, enhancementB;

// Initialize DOM elements when ready
document.addEventListener('DOMContentLoaded', function() {
    unitTypeA = document.getElementById('unitTypeA');
    unitCountA = document.getElementById('unitCountA');
    addUnitA = document.getElementById('addUnitA');
    armyAList = document.getElementById('armyAList');
    enhancementA = document.getElementById('enhancementA');

    unitTypeB = document.getElementById('unitTypeB');
    unitCountB = document.getElementById('unitCountB');
    addUnitB = document.getElementById('addUnitB');
    armyBList = document.getElementById('armyBList');
    enhancementB = document.getElementById('enhancementB');

    // Set up event listeners for adding units
    if (addUnitA) {
        addUnitA.addEventListener('click', () => {
            const count = parseInt(unitCountA.value);
            addUnits(window.armyA, armyAList, unitTypeA.value, count, enhancementA.value);
        });
    }
    if (addUnitB) {
        addUnitB.addEventListener('click', () => {
            const count = parseInt(unitCountB.value);
            addUnits(window.armyB, armyBList, unitTypeB.value, count, enhancementB.value);
        });
    }
});

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Unit type to image mapping
 * @type {Object.<string, string>}
 */
const UNIT_IMAGE_MAP = {
    light: 'images/light.jpg',
    heavy: 'images/heavy.jpg',
    ranged: 'images/ranged.jpg',
    cav: 'images/cav.jpg',
    support: 'images/support.png'
};

/**
 * Add units to an army and update the display
 * @param {Array} army - Army array to add units to
 * @param {HTMLElement} listEl - DOM element to render the army list
 * @param {string} type - Unit type
 * @param {number} count - Number of units to add
 * @param {string} enhancement - Enhancement name
 */
function addUnits(army, listEl, type, count, enhancement) {
    for (let i = 0; i < count; i++) {
        army.push({ type, enhancement });
    }
    renderArmy(listEl, army);
}

/**
 * Render army units in the specified list element
 * @param {HTMLElement} listEl - DOM element to render the army list
 * @param {Array} army - Army array to render
 */
function renderArmy(listEl, army) {
    listEl.innerHTML = '';
    const armyId = listEl.id.includes('armyA') ? 'A' : 'B';
    const opponentArmyId = armyId === 'A' ? 'B' : 'A';
    const opponentArmy = window[`army${opponentArmyId}`];

    army.forEach((unit, index) => {
        const tr = document.createElement('tr');
        tr.className = 'border-b';

        // Unit type column
        const tdUnit = document.createElement('td');
        tdUnit.className = 'p-3';
        tdUnit.textContent = unit.type;

        // Enhancement column
        const tdEnhancement = document.createElement('td');
        tdEnhancement.className = 'p-3';
        tdEnhancement.textContent = unit.enhancement || 'None';

        // Skirmisher column with checkbox
        const tdSkirmisher = document.createElement('td');
        tdSkirmisher.className = 'p-3 text-center';
        const skCheckbox = document.createElement('input');
        skCheckbox.type = 'checkbox';
        skCheckbox.className = 'h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500';
        skCheckbox.checked = unit.isSkirmisher || false;
        skCheckbox.addEventListener('change', (e) => {
            const armyUnits = window[`army${armyId}`];
            const count = armyUnits.filter(u => u.isSkirmisher).length;
            if (e.target.checked && count >= 2) {
                e.target.checked = false;
                alert('Only 2 skirmishers allowed per army.');
                return;
            }
            unit.isSkirmisher = e.target.checked;
            if (!unit.isSkirmisher) delete unit.target;
            renderArmy(document.getElementById('armyAList'), window.armyA);
            renderArmy(document.getElementById('armyBList'), window.armyB);
        });
        tdSkirmisher.appendChild(skCheckbox);

        // Assault Team target selection
        if (unit.isSkirmisher && unit.enhancement === 'Assault Team') {
            const targetSelect = document.createElement('select');
            targetSelect.className = 'ml-2 p-1 border rounded';

            const defaultOpt = document.createElement('option');
            defaultOpt.value = -1;
            defaultOpt.textContent = 'Select Target';
            targetSelect.appendChild(defaultOpt);

            opponentArmy.forEach((opp, oppIndex) => {
                const opt = document.createElement('option');
                opt.value = oppIndex;
                opt.textContent = `${opp.type} (${opp.enhancement || 'None'})`;
                if (unit.target === oppIndex) opt.selected = true;
                targetSelect.appendChild(opt);
            });
            targetSelect.addEventListener('change', (e) => {
                const val = parseInt(e.target.value);
                if (val >= 0) unit.target = val;
                else delete unit.target;
            });
            tdSkirmisher.appendChild(targetSelect);
        }

        // Actions column
        const tdActions = document.createElement('td');
        tdActions.className = 'p-3 text-center';
        const removeBtn = document.createElement('button');
        removeBtn.innerHTML = '<i class="fas fa-times text-red-500"></i>';
        removeBtn.className = 'px-2 py-1 rounded hover:bg-red-100';
        removeBtn.onclick = () => {
            army.splice(index, 1);
            renderArmy(listEl, army);
        };
        tdActions.appendChild(removeBtn);

        tr.appendChild(tdUnit);
        tr.appendChild(tdEnhancement);
        tr.appendChild(tdSkirmisher);
        tr.appendChild(tdActions);
        listEl.appendChild(tr);
    });
}

// Make renderArmy available globally
window.renderArmy = renderArmy;

// Helper function to remove units from army
function removeUnits(army, listEl, type, enhancement, count) {
    let removed = 0;
    for (let i = army.length - 1; i >= 0 && removed < count; i--) {
        const unit = army[i];
        if (unit.type === type && 
            ((enhancement && unit.enhancement === enhancement) || 
             (!enhancement && (!unit.enhancement || unit.enhancement === 'None')))) {
            army.splice(i, 1);
            removed++;
        }
    }
    renderArmy(listEl, army);
}

// Roll a single d6
function rollDie() {
    return Math.floor(Math.random() * 6) + 1;
}

// Generate city garrison defenders for siege by tier (matches tutorial)
function generateDefenders(tier) {
    const garrison = cityGarrisons[tier];
    const defs = [];
    
    // Add heavy brigades
    for (let i = 0; i < garrison.heavy; i++) {
        defs.push({ type: 'heavy', enhancement: 'None', garrison: true });
    }
    
    // Add ranged brigades  
    for (let i = 0; i < garrison.ranged; i++) {
        defs.push({ type: 'ranged', enhancement: 'None', garrison: true });
    }
    
    return defs;
}

// Calculate unit stats including enhancements and garrison bonuses
/**
 * Calculate unit statistics including base stats and enhancements
 * @param {Object} unit - Unit object with type and enhancement
 * @param {boolean} isGarrison - Whether unit is in garrison (affects bonuses)
 * @returns {Object} Complete unit statistics
 */
function getUnitStats(unit, isGarrison = false) {
    const baseStats = UNIT_STATS[unit.type];
    const enhancement = ENHANCEMENTS[unit.enhancement] || {};
    
    let stats = {
        skirmish: (baseStats.skirmish || 0) + (enhancement.skirmish || 0),
        pitch: (baseStats.pitch || 0) + (enhancement.pitch || 0),
        defense: (baseStats.defense || 0) + (enhancement.defense || 0),
        rally: (baseStats.rally || 0) + (enhancement.rally || 0),
        move: (baseStats.move || 0) + (enhancement.move || 0)
    };
    
    // Apply garrison bonuses (+2 defense, +2 rally)
    if (isGarrison || unit.garrison) {
        stats.defense += 2;
        stats.rally += 2;
    }
    
    return stats;
}

/**
 * Apply general trait bonuses to army units
 * @param {Array} units - Array of unit objects
 * @param {Object} general - General object with trait and level
 * @returns {Array} Modified units with trait bonuses applied
 */
function applyGeneralTraits(units, general) {
    if (!general || !general.trait || general.trait === 'None') {
        return units;
    }
    
    const trait = GENERAL_TRAITS[general.trait];
    if (!trait) {
        return units;
    }
    
    return units.map(unit => {
        const modifiedUnit = { ...unit };
        
        // Apply stat bonuses from general traits
        if (trait.defense) {
            modifiedUnit.traitDefenseBonus = trait.defense;
        }
        if (trait.rally) {
            modifiedUnit.traitRallyBonus = trait.rally;
        }
        if (trait.pitch) {
            modifiedUnit.traitPitchBonus = trait.pitch;
        }
        
        return modifiedUnit;
    });
}

// Global variables to store battle data for reporting
window.battleData = {
    rounds: [],
    finalResult: null,
    armies: { A: null, B: null },
    generals: { A: null, B: null }
};

// Helper function to delay execution
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Helper function to calculate destruction dice
function destructionDice(units, handler) {
    const base = Math.min(units.length, 2); // Max 2 units destroyed per round
    // Merciless: destroys on 1-3 instead of 1-2
    if (handler && handler.destructionOn1to3) {
        return Math.min(base, 3);
    }
    return Math.min(base, 2);
}

// Helper function to update battle result display with enhanced formatting
function updateBattleDisplay(content, append = false, newBattle = false) {
    const battleResultDiv = document.getElementById('battleResult');
    if (battleResultDiv) {
        if (newBattle) {
            // For new battles, add a separator and append
            if (battleResultDiv.innerHTML.trim() && !battleResultDiv.innerHTML.includes('Set up your armies')) {
                battleResultDiv.innerHTML += '<div class="battle-separator"></div>';
            }
            battleResultDiv.innerHTML += formatBattleContent(content);
        } else if (append) {
            battleResultDiv.innerHTML += formatBattleContent(content);
        } else {
            battleResultDiv.innerHTML = formatBattleContent(content);
        }
        // Scroll to bottom to show latest content
        battleResultDiv.scrollTop = battleResultDiv.scrollHeight;
    }
}

// Enhanced formatting function to convert plain text to styled HTML
function formatBattleContent(content) {
    if (!content) return '';
    
    // Convert content to HTML with enhanced styling
    let html = content
        // Battle headers
        .replace(/⚔️ Battle at (.+): (.+) vs (.+)/g, 
            '<div class="battle-header">⚔️ <span class="battle-title">Battle at $1</span><br><span class="army-names">$2 <span class="vs">VS</span> $3</span></div>')
        
        // General information
        .replace(/- (.+) \(Lvl (\d+), (.+)\) vs (.+) \(Lvl (\d+), (.+)\)/g,
            '<div class="generals-info"><div class="general-a">🎖️ $1 (Level $2) <span class="trait">$3</span></div><div class="general-b">🎖️ $4 (Level $5) <span class="trait">$6</span></div></div>')
        
        // Army sizes
        .replace(/- Army Sizes: (\d+) vs (\d+)/g,
            '<div class="army-sizes">🛡️ Army Sizes: <span class="army-a-size">$1</span> vs <span class="army-b-size">$2</span></div>')
        
        // Round headers
        .replace(/--- Round (\d+) ---/g,
            '<div class="round-header">🔄 <span class="round-number">Round $1</span></div>')
        
        // Phase headers with icons and styling
        .replace(/• Skirmish phase begins/g,
            '<div class="phase-header skirmish">⚔️ <span class="phase-name">Skirmish Phase</span></div>')
        .replace(/• Pitch phase begins/g,
            '<div class="phase-header pitch">🎯 <span class="phase-name">Pitch Phase</span></div>')
        .replace(/• Rally phase begins/g,
            '<div class="phase-header rally">🚩 <span class="phase-name">Rally Phase</span></div>')
        .replace(/• Routed Unit Recovery Phase/g,
            '<div class="phase-header recovery">🔄 <span class="phase-name">Routed Unit Recovery</span></div>')
        .replace(/• Action Report: Brigade Destruction Phase/g,
            '<div class="phase-header destruction">💀 <span class="phase-name">Destruction Phase</span></div>')
        
        // Enhanced skirmish matchups
        .replace(/=== Skirmish Matchup (\d+) ===/g,
            '<div class="skirmish-matchup">⚔️ <span class="matchup-title">Skirmish Matchup $1</span></div>')
        
        // Army calculations sections
        .replace(/=== (.+) (Skirmish|Pitch|Rally|Routed Unit Recovery) (Calculation|===)/g,
            '<div class="army-calculation $2"><span class="army-name">$1</span> <span class="calc-type">$2 $3</span></div>')
          // Enhanced dice rolls and calculations with better formatting
        .replace(/(\w+) \((.+?)\): Roll\((\d+)\) \+ (.+?) = (\d+)/g,
            '<div class="unit-roll"><span class="unit-type">$1</span> <span class="enhancement">($2)</span>: <span class="dice-roll">🎲 $3</span> + <span class="modifiers">$4</span> = <span class="total">$5</span></div>')
        
        // Enhanced army totals with more details
        .replace(/(.+) Total (Skirmish): (\d+)/g,
            '<div class="army-total skirmish-total"><span class="army-name">$1</span> Total <span class="phase-name">$2</span>: <span class="total-value">$3</span></div>')
          // General bonuses with enhanced styling
        .replace(/General (.+) \(Lvl (\d+)\): \+(\d+)/g,
            '<div class="general-bonus">🎖️ <span class="general-name">General $1</span> <span class="general-level">(Level $2)</span>: <span class="bonus">+$3</span></div>')
        
        // Enhanced trait bonuses with better categorization
        .replace(/(.+) Trait: \+(\d+) \((.+)\)/g,
            '<div class="trait-bonus">✨ <span class="trait-name">$1 Trait</span>: <span class="bonus">+$2</span> <span class="trait-desc">($3)</span></div>')
        
        // Improved army totals with phase-specific styling
        .replace(/(.+) Total (Pitch|Rally): (\d+)/g,
            '<div class="army-total $2-total"><span class="army-name">$1</span> Total <span class="phase-name">$2</span>: <span class="total-value">$3</span></div>')
        
        // Enhanced skirmish totals
        .replace(/(.+) Total (Skirmish): (\d+)/g,
            '<div class="army-total skirmish-total"><span class="army-name">$1</span> Total <span class="phase-name">$2</span>: <span class="total-value">$3</span></div>')
        
        // Improved matchup results with better visibility
        .replace(/Skirmish Results: (.+) \((\d+)\) vs (.+) \((\d+)\)/g,
            '<div class="skirmish-result">⚔️ <span class="result-title">Skirmish Results</span>: <span class="army-a">$1 ($2)</span> <span class="vs-divider">VS</span> <span class="army-b">$3 ($4)</span></div>')
        
        // Enhanced casualties display
        .replace(/(.+) takes (\d+) casualties/g,
            '<div class="casualty-result">💀 <span class="army-name">$1</span> takes <span class="casualty-count">$2</span> casualties</div>')
        
        // Better routed unit tracking
        .replace(/(\d+) units routed/g,
            '<div class="rout-count">🏃 <span class="routed-number">$1</span> units routed</div>')
        
        // Phase comparisons
        .replace(/(Pitch|Rally) Comparison: (.+)\((\d+)\) vs (.+)\((\d+)\)/g,
            '<div class="phase-comparison"><span class="phase-name">$1 Comparison</span>: <span class="army-a">$2 ($3)</span> vs <span class="army-b">$4 ($5)</span></div>')
        .replace(/(.+) wins (pitch|rally) phase by (\d+)/g,
            '<div class="phase-winner">🏆 <span class="winner">$1</span> wins <span class="phase">$2 phase</span> by <span class="margin">$3</span></div>')
        
        // Results with visual indicators
        .replace(/Result: (.+) wins by (\d+)/g,
            '<div class="battle-result win">🏆 Result: <span class="winner">$1</span> wins by <span class="margin">$2</span></div>')
        .replace(/Result: Tied at (\d+) - no casualties/g,
            '<div class="battle-result tie">🤝 Result: Tied at <span class="tie-score">$1</span> - no casualties</div>')
        
        // Special abilities
        .replace(/Lancer Special: (.+)/g,
            '<div class="special-ability lancer">🐎 <span class="ability-name">Lancer Special</span>: <span class="ability-desc">$1</span></div>')
        .replace(/(.+) destruction roll: (\d+) \(destroyed on (.+)\)/g,
            '<div class="destruction-roll">💀 <span class="unit">$1</span> destruction roll: <span class="roll">🎲 $2</span> <span class="threshold">(destroyed on $3)</span></div>')
        
        // Unit status changes with enhanced formatting
        .replace(/(\w+) \((.+?)\): Rolled (\d+) ✓ RALLIED \(need 4\+\)/g,
            '<div class="unit-status rallied">✅ <span class="unit">$1 ($2)</span>: <span class="roll">🎲 $3</span> - <span class="status">RALLIED</span></div>')
        .replace(/(\w+) \((.+?)\): Rolled (\d+) ✗ Still routed \(need 4\+\)/g,
            '<div class="unit-status routed">❌ <span class="unit">$1 ($2)</span>: <span class="roll">🎲 $3</span> - <span class="status">Still routed</span></div>')
        .replace(/(\w+) \((.+?)\): Rolled (\d+) ✓ SURVIVES \(destroyed on 1-(.)\)/g,
            '<div class="unit-status survived">✅ <span class="unit">$1 ($2)</span>: <span class="roll">🎲 $3</span> - <span class="status">SURVIVES</span></div>')
        .replace(/(\w+) \((.+?)\): Rolled (\d+) 💀 DESTROYED \(destroyed on 1-(.)\)/g,
            '<div class="unit-status destroyed">💀 <span class="unit">$1 ($2)</span>: <span class="roll">🎲 $3</span> - <span class="status">DESTROYED</span></div>')
        
        // Army status summaries
        .replace(/(.+) rally results: (\d+) active, (\d+) still routed/g,
            '<div class="army-status">📊 <span class="army-name">$1</span> status: <span class="active">$2 active</span>, <span class="routed">$3 routed</span></div>')
        .replace(/(.+) losses: (\d+) brigades destroyed/g,
            '<div class="army-losses">💀 <span class="army-name">$1</span> losses: <span class="loss-count">$2</span> brigades destroyed</div>')
        
        // Round endings
        .replace(/End of Round: (.+) has (\d+) brigades active \((\d+) routed\), (.+) has (\d+) brigades active \((\d+) routed\)/g,
            '<div class="round-summary">🔚 <span class="summary-title">Round Summary</span><br><span class="army-a">$1: <span class="active">$2 active</span> (<span class="routed">$3 routed</span>)</span><br><span class="army-b">$4: <span class="active">$5 active</span> (<span class="routed">$6 routed</span>)</span></div>')
        
        // Battle end
        .replace(/--- Battle End ---/g,
            '<div class="battle-end-header">🏁 <span class="end-title">Battle End</span></div>')
        .replace(/🏆 Final Survivors: (.+): (\d+) \| (.+): (\d+)/g,
            '<div class="final-survivors">🏆 <span class="survivors-title">Final Survivors</span><br><span class="army-a">$1: <span class="count">$2</span></span> | <span class="army-b">$3: <span class="count">$4</span></span></div>')
        .replace(/(.+) WINS!/g,
            '<div class="victory-announcement">🎉 <span class="winner-name">$1</span> <span class="wins-text">WINS!</span> 🎉</div>')
        .replace(/The battle is a bloody DRAW\./g,
            '<div class="draw-announcement">🤝 <span class="draw-text">The battle is a bloody DRAW!</span> 🤝</div>')
        
        // Action report sections
        .replace(/=== POST-BATTLE ACTION REPORT ===/g,
            '<div class="action-report-header">📋 <span class="report-title">Post-Battle Action Report</span></div>')
        .replace(/--- (.+) Final Brigade Casualty Rolls ---/g,
            '<div class="casualty-section">💀 <span class="section-title">$1 Final Casualties</span></div>')
        .replace(/--- (.+) Victory Rerolls ---/g,
            '<div class="reroll-section">🎲 <span class="section-title">$1 Victory Rerolls</span></div>')
        .replace(/--- General Fate Rolls ---/g,
            '<div class="general-fate-section">🎖️ <span class="section-title">General Fate Rolls</span></div>')
        .replace(/--- FINAL BATTLE SUMMARY ---/g,
            '<div class="final-summary-header">📊 <span class="summary-title">Final Battle Summary</span></div>')
        
        // Remove extra line breaks and structure content
        .replace(/\n\s*\n/g, '</div><div class="content-break"></div><div class="content-section">')
        .replace(/\n/g, '<br>');
    
    // Wrap in container with better structure
    return `<div class="battle-content">
        <div class="content-section">${html}</div>
    </div>`;
}

// Name generation arrays
const armyNames = [
    "Iron Eagles", "Crimson Lions", "Steel Wolves", "Golden Hawks", "Thunder Bears",
    "Storm Ravens", "Fire Dragons", "Shadow Panthers", "Silver Stags", "Bronze Titans",
    "Marble Guards", "Obsidian Legion", "Crystal Warriors", "Emerald Company", "Ruby Battalion"
];

const generalNames = [
    "Marcus Aurelius", "Helena Victrix", "Gaius Maximus", "Livia Fortuna", "Brutus Rex",
    "Valeria Steel", "Octavius Storm", "Claudia Bold", "Titus Iron", "Aurelia Swift",
    "Cassius Brave", "Diana Sharp", "Lucius Wise", "Portia Strong", "Felix Lucky"
];

const battleLocations = [
    "Crimson Fields", "Ironwood Valley", "Serpent's Ridge", "Golden Plains", "Shadowmere",
    "Dragonspine Hills", "Thornwall Pass", "Stormbreak Plateau", "Blackstone Mesa", "Silverbrook",
    "Ravenshollow", "Wolfsbane Crossing", "Eagle's Perch", "Lionheart Grove", "Titanfall Gorge"
];

const unitNicknames = {
    cav: ["Thunderhooves", "Swiftwind", "Ironhorse", "Stormriders", "Goldmane"],
    heavy: ["Ironwall", "Steelbreaker", "Shieldguard", "Hammerfall", "Fortress"],
    light: ["Quickstrike", "Shadowstep", "Swiftblade", "Ghostwalker", "Windrunner"],
    ranged: ["Truearrow", "Longshot", "Deadeye", "Stormbow", "Sharpeye"],
    support: ["Lifeguard", "Steadfast", "Ironheart", "Healer's Hand", "Backbone"]
};

// Name generation functions
function getRandomName(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generateArmyName() {
    return getRandomName(armyNames);
}

function generateGeneralName() {
    return getRandomName(generalNames);
}

function generateBattleLocation() {
    return getRandomName(battleLocations);
}

function generateUnitNickname(unitType) {
    return getRandomName(unitNicknames[unitType]);
}

// Make simulateBattle function global so it can be called from HTML
/**
 * Main battle simulation function
 * @param {Array} army1 - Army A units array
 * @param {Array} army2 - Army B units array
 * @param {Object} genA - General A configuration
 * @param {Object} genB - General B configuration
 * @param {string} battleType - Type of battle ('open' or 'siege')
 * @param {number} cityTier - City tier for siege battles
 * @param {Object} customNames - Custom names for armies, generals, and location
 * @returns {Promise<string>} Battle result summary
 */
window.simulateBattle = async function(army1, army2, genA, genB, battleType, cityTier, customNames = {}) {
    console.log('simulateBattle called with', { army1, army2, genA, genB, battleType, cityTier });    try {
        updateBattleDisplay('', false, true); // Clear previous results and add separator
        
        let aUnits = JSON.parse(JSON.stringify(army1));
        let bUnits = battleType === 'siege' 
            ? generateDefenders(cityTier) 
            : JSON.parse(JSON.stringify(army2));
        
        // Track routed units (temporarily out of battle)
        let aRoutedUnits = [];
        let bRoutedUnits = [];
        
        const log = [];

        const handlerA = TRAIT_HANDLERS[genA.trait] || {};
        const handlerB = TRAIT_HANDLERS[genB.trait] || {};

        const armyAName = customNames.armyAName || generateArmyName();
        const armyBName = customNames.armyBName || generateArmyName();
        const generalAName = customNames.generalAName || generateGeneralName();
        const generalBName = customNames.generalBName || generateGeneralName();
        const battleLocation = customNames.battleLocation || generateBattleLocation();

        log.push(`⚔️ Battle at ${battleLocation}: ${armyAName} vs ${armyBName}`);
        log.push(`- ${generalAName} (Lvl ${genA.level}, ${genA.trait}) vs ${generalBName} (Lvl ${genB.level}, ${genB.trait})`);        log.push(`- Army Sizes: ${aUnits.length} vs ${bUnits.length}`);
        updateBattleDisplay(log.join('\n'));
        
        // Store initial battle data for reporting
        window.battleData = {
            rounds: [],
            finalResult: null,
            armies: { 
                A: { 
                    name: armyAName, 
                    initialSize: aUnits.length,
                    units: aUnits.map(u => ({ type: u.type, enhancement: u.enhancement }))
                }, 
                B: { 
                    name: armyBName, 
                    initialSize: bUnits.length,
                    units: bUnits.map(u => ({ type: u.type, enhancement: u.enhancement }))
                } 
            },
            generals: { 
                A: { name: generalAName, level: genA.level, trait: genA.trait }, 
                B: { name: generalBName, level: genB.level, trait: genB.trait } 
            },
            battleLocation: battleLocation
        };
          let round = 1;
        const MAX_ROUNDS = 50; // Safety limit
          console.log('Starting battle loop with conditions:', {
            aUnitsLength: aUnits.length,
            bUnitsLength: bUnits.length,
            round: round,
            maxRounds: MAX_ROUNDS
        });
        
        try {            while (aUnits.length > 0 && bUnits.length > 0 && round <= MAX_ROUNDS) {
                console.log(`=== BEGINNING ROUND ${round} ===`);
                const roundLog = [];
                roundLog.push(`\n--- Round ${round} ---`);
                  // Initialize loss counters for the round
                let aLosses = 0;
                let bLosses = 0;
                
                // Initialize routed units tracking for this round
                let aRoutedThisRound = [];
                let bRoutedThisRound = [];
                
                // SKIRMISH PHASE
            if (handlerA.skipSkirmish || handlerB.skipSkirmish) {
                roundLog.push('• Skirmish phase skipped by cautious general.');
            } else {
                roundLog.push('• Skirmish phase begins');
                // Determine manual skirmishers if selected
                const aSelected = aUnits.filter(u => u.isSkirmisher);
                const bSelected = bUnits.filter(u => u.isSkirmisher);
                const fallbackCount = 2;
                // Fallback: top skirmish values
                function topSkirmishers(units, count) {
                    return [...units].sort((u1, u2) => {
                        const s1 = (UNIT_STATS[u1.type].skirmish || 0) + ((ENHANCEMENTS[u1.enhancement]||{}).skirmish||0);
                        const s2 = (UNIT_STATS[u2.type].skirmish || 0) + ((ENHANCEMENTS[u2.enhancement]||{}).skirmish||0);
                        return s2 - s1;
                    }).slice(0, count);
                }
                const aSkirmishers = aSelected.length > 0 ? aSelected : topSkirmishers(aUnits, fallbackCount);
                const bSkirmishers = bSelected.length > 0 ? bSelected : topSkirmishers(bUnits, fallbackCount);
                const maxSkirmishes = Math.min(aSkirmishers.length, bSkirmishers.length, fallbackCount);
                roundLog.push(`  ${maxSkirmishes} skirmish matchup(s) will occur.`);
                for (let i = 0; i < maxSkirmishes; i++) {
                    const aSk = aSkirmishers[i];
                    let bSk = bSkirmishers[i];
                    // Handle Assault Team target override
                    if (aSk.enhancement === 'Assault Team' && aSk.target != null && bUnits[aSk.target]) {
                        bSk = bUnits[aSk.target];
                    }
                    // Log pairing
                    roundLog.push(`\n  === Skirmish Matchup ${i + 1} ===`);
                    roundLog.push(`  ${armyAName}'s ${aSk.type} (${aSk.enhancement || 'None'}) vs ${armyBName}'s ${bSk.type} (${bSk.enhancement || 'None'})`);
                    // Compute base and enhancement
                    const aBase = UNIT_STATS[aSk.type].skirmish || 0;
                    const aEnh = (ENHANCEMENTS[aSk.enhancement]||{}).skirmish||0;
                    roundLog.push(`  ${armyAName} Skirmish: Base(${aBase}) + Enhancement(${aEnh}) = ${aBase + aEnh}`);
                    const bBase = UNIT_STATS[bSk.type].skirmish || 0;
                    const bEnh = (ENHANCEMENTS[bSk.enhancement]||{}).skirmish||0;
                    roundLog.push(`  ${armyBName} Skirmish: Base(${bBase}) + Enhancement(${bEnh}) = ${bBase + bEnh}`);
                    // Apply Bold trait bonus if applicable
                    if (handlerA.applySkirmishBonus && i === 0) {
                        const bonus = Math.ceil(genA.level/2);
                        roundLog.push(`  ${armyAName} Bold Trait Bonus: +${bonus} (General Level ${genA.level}/2 rounded up)`);
                        roundLog.push(`  ${armyAName} Final Skirmish: ${aBase + aEnh} + ${bonus} = ${aBase + aEnh + bonus}`);
                    }
                    if (handlerB.applySkirmishBonus && i === 0) {
                        const bonus = Math.ceil(genB.level/2);
                        roundLog.push(`  ${armyBName} Bold Trait Bonus: +${bonus} (General Level ${genB.level}/2 rounded up)`);
                        roundLog.push(`  ${armyBName} Final Skirmish: ${bBase + bEnh} + ${bonus} = ${bBase + bEnh + bonus}`);
                    }
                    // Rolls
                    const aRoll = rollDie();
                    const bRoll = rollDie();
                    const aTotal = aRoll + aBase + aEnh + ((handlerA.applySkirmishBonus && i===0)?Math.ceil(genA.level/2):0);
                    const bTotal = bRoll + bBase + bEnh + ((handlerB.applySkirmishBonus && i===0)?Math.ceil(genB.level/2):0);
                    roundLog.push(`\n  Dice Rolls:`);
                    roundLog.push(`  ${armyAName}: Roll(${aRoll}) + Skirmish(${aTotal - aRoll}) = ${aTotal}`);
                    roundLog.push(`  ${armyBName}: Roll(${bRoll}) + Skirmish(${bTotal - bRoll}) = ${bTotal}`);
                    // Determine result
                    if (aTotal > bTotal) {
                        const diff = aTotal - bTotal;
                        roundLog.push(`\n  Result: ${armyAName} wins by ${diff}`);
                        bLosses += 1;
                    } else {
                        const diff = bTotal - aTotal;
                        roundLog.push(`\n  Result: ${armyBName} wins by ${diff}`);
                        aLosses += 1;
                    }
                    // Remove routed units
                    if (bLosses) {
                        const idx = bUnits.indexOf(bSk);
                        if (idx > -1) bUnits.splice(idx, 1);
                    }
                    if (aLosses) {
                        const idx2 = aUnits.indexOf(aSk);
                        if (idx2 > -1) aUnits.splice(idx2, 1);
                    }
                }
            }            // PITCH PHASE
            roundLog.push('\n• Pitch phase begins');
            roundLog.push(`  Army compositions: ${armyAName} (${aUnits.length} units), ${armyBName} (${bUnits.length} units)`);
            
            // Calculate detailed pitch breakdown for Army A
            let aPitchBreakdown = [];
            let aPitchTotal = 0;
            
            roundLog.push(`\n  === ${armyAName} Pitch Calculation ===`);
            aUnits.forEach((unit, index) => {
                const stats = getUnitStats(unit);
                const basePitch = UNIT_STATS[unit.type].pitch || 0;
                const enhancementPitch = unit.enhancement && ENHANCEMENTS[unit.enhancement] ? (ENHANCEMENTS[unit.enhancement].pitch || 0) : 0;
                const roll = rollDie();
                const unitTotal = roll + stats.pitch;
                
                aPitchBreakdown.push({
                    unit: `${unit.type} (${unit.enhancement || 'None'})`,
                    roll: roll,
                    base: basePitch,
                    enhancement: enhancementPitch,
                    total: unitTotal
                });
                aPitchTotal += unitTotal;
                
                roundLog.push(`    ${unit.type} (${unit.enhancement || 'None'}): Roll(${roll}) + Base(${basePitch}) + Enhancement(${enhancementPitch}) = ${unitTotal}`);
            });
            
            // Add general level bonus
            const aGeneralBonus = genA.level;
            aPitchTotal += aGeneralBonus;
            roundLog.push(`    General ${generalAName} (Lvl ${genA.level}): +${aGeneralBonus}`);
            
            // Apply Brilliant trait (double general level)
            let aFinalPitch = aPitchTotal;
            if (handlerA.adjustPitchTotal) {
                const brilliantBonus = genA.level; // Brilliant adds another general level
                aFinalPitch = handlerA.adjustPitchTotal(aPitchTotal, genA.level);
                roundLog.push(`    Brilliant Trait: +${brilliantBonus} (double general level)`);
            }
            roundLog.push(`  ${armyAName} Total Pitch: ${aFinalPitch}`);
            
            // Calculate detailed pitch breakdown for Army B
            let bPitchBreakdown = [];
            let bPitchTotal = 0;
            
            roundLog.push(`\n  === ${armyBName} Pitch Calculation ===`);
            bUnits.forEach((unit, index) => {
                const stats = getUnitStats(unit);
                const basePitch = UNIT_STATS[unit.type].pitch || 0;
                const enhancementPitch = unit.enhancement && ENHANCEMENTS[unit.enhancement] ? (ENHANCEMENTS[unit.enhancement].pitch || 0) : 0;
                const roll = rollDie();
                const unitTotal = roll + stats.pitch;
                
                bPitchBreakdown.push({
                    unit: `${unit.type} (${unit.enhancement || 'None'})`,
                    roll: roll,
                    base: basePitch,
                    enhancement: enhancementPitch,
                    total: unitTotal
                });
                bPitchTotal += unitTotal;
                
                roundLog.push(`    ${unit.type} (${unit.enhancement || 'None'}): Roll(${roll}) + Base(${basePitch}) + Enhancement(${enhancementPitch}) = ${unitTotal}`);
            });
            
            // Add general level bonus
            const bGeneralBonus = genB.level;
            bPitchTotal += bGeneralBonus;
            roundLog.push(`    General ${generalBName} (Lvl ${genB.level}): +${bGeneralBonus}`);
            
            // Apply Brilliant trait (double general level)
            let bFinalPitch = bPitchTotal;
            if (handlerB.adjustPitchTotal) {
                const brilliantBonus = genB.level;
                bFinalPitch = handlerB.adjustPitchTotal(bPitchTotal, genB.level);
                roundLog.push(`    Brilliant Trait: +${brilliantBonus} (double general level)`);
            }
            roundLog.push(`  ${armyBName} Total Pitch: ${bFinalPitch}`);
            
            // Show pitch comparison
            const pitchDifference = aFinalPitch - bFinalPitch;
            roundLog.push(`\n  Pitch Comparison: ${armyAName}(${aFinalPitch}) vs ${armyBName}(${bFinalPitch})`);
            if (pitchDifference > 0) {
                roundLog.push(`  ${armyAName} wins pitch phase by ${pitchDifference}`);
            } else if (pitchDifference < 0) {
                roundLog.push(`  ${armyBName} wins pitch phase by ${Math.abs(pitchDifference)}`);
            } else {
                roundLog.push(`  Pitch phase is tied at ${aFinalPitch}`);
            }            // RALLY PHASE
            roundLog.push('\n• Rally phase begins');
            
            // Calculate detailed rally for Army A
            roundLog.push(`\n  === ${armyAName} Rally Calculation ===`);
            let aRallyTotal = 0;
            const aRallyBreakdown = [];
            
            aUnits.forEach((unit, index) => {
                const stats = getUnitStats(unit);
                const baseRally = UNIT_STATS[unit.type].rally || 0;
                const enhancementRally = unit.enhancement && ENHANCEMENTS[unit.enhancement] ? (ENHANCEMENTS[unit.enhancement].rally || 0) : 0;
                const garrisonBonus = unit.garrison ? 2 : 0;
                let traitBonus = 0;
                
                // Apply general trait rally bonuses
                if (handlerA.rallyBonus) {
                    traitBonus = handlerA.rallyBonus;
                }
                
                const roll = rollDie();
                const unitTotal = roll + stats.rally + traitBonus;
                
                aRallyBreakdown.push({
                    unit: `${unit.type} (${unit.enhancement || 'None'})`,
                    roll: roll,
                    base: baseRally,
                    enhancement: enhancementRally,
                    garrison: garrisonBonus,
                    trait: traitBonus,
                    total: unitTotal
                });
                aRallyTotal += unitTotal;
                
                roundLog.push(`    ${unit.type} (${unit.enhancement || 'None'}): Roll(${roll}) + Base(${baseRally}) + Enhancement(${enhancementRally}) + Garrison(${garrisonBonus}) + Trait(${traitBonus}) = ${unitTotal}`);
            });
            
            // Apply Inspiring trait reroll (simplified)
            if (handlerA.enableRallyReroll) {
                const rerollBonus = 2; // Simplified bonus
                aRallyTotal += rerollBonus;
                roundLog.push(`    Inspiring Trait: +${rerollBonus} (rally reroll bonus)`);
            }
            
            roundLog.push(`  ${armyAName} Total Rally: ${aRallyTotal}`);
            
            // Calculate detailed rally for Army B
            roundLog.push(`\n  === ${armyBName} Rally Calculation ===`);
            let bRallyTotal = 0;
            const bRallyBreakdown = [];
            
            bUnits.forEach((unit, index) => {
                const stats = getUnitStats(unit);
                const baseRally = UNIT_STATS[unit.type].rally || 0;
                const enhancementRally = unit.enhancement && ENHANCEMENTS[unit.enhancement] ? (ENHANCEMENTS[unit.enhancement].rally || 0) : 0;
                const garrisonBonus = unit.garrison ? 2 : 0;
                let traitBonus = 0;
                
                // Apply general trait rally bonuses
                if (handlerB.rallyBonus) {
                    traitBonus = handlerB.rallyBonus;
                }
                
                const roll = rollDie();
                const unitTotal = roll + stats.rally + traitBonus;
                
                bRallyBreakdown.push({
                    unit: `${unit.type} (${unit.enhancement || 'None'})`,
                    roll: roll,
                    base: baseRally,
                    enhancement: enhancementRally,
                    garrison: garrisonBonus,
                    trait: traitBonus,
                    total: unitTotal
                });
                bRallyTotal += unitTotal;
                
                roundLog.push(`    ${unit.type} (${unit.enhancement || 'None'}): Roll(${roll}) + Base(${baseRally}) + Enhancement(${enhancementRally}) + Garrison(${garrisonBonus}) + Trait(${traitBonus}) = ${unitTotal}`);
            });
            
            // Apply Inspiring trait reroll (simplified)
            if (handlerB.enableRallyReroll) {
                const rerollBonus = 2; // Simplified bonus
                bRallyTotal += rerollBonus;
                roundLog.push(`    Inspiring Trait: +${rerollBonus} (rally reroll bonus)`);
            }
            
            roundLog.push(`  ${armyBName} Total Rally: ${bRallyTotal}`);
            
            // Show rally comparison
            const rallyDifference = aRallyTotal - bRallyTotal;
            roundLog.push(`\n  Rally Comparison: ${armyAName}(${aRallyTotal}) vs ${armyBName}(${bRallyTotal})`);
            if (rallyDifference > 0) {
                roundLog.push(`  ${armyAName} wins rally phase by ${rallyDifference}`);
            } else if (rallyDifference < 0) {
                roundLog.push(`  ${armyBName} wins rally phase by ${Math.abs(rallyDifference)}`);
            } else {
                roundLog.push(`  Rally phase is tied at ${aRallyTotal}`);
            }
              // ROUTED UNIT RECOVERY
            if (aRoutedUnits.length > 0 || bRoutedUnits.length > 0) {
                roundLog.push('\n• Routed Unit Recovery Phase');
                roundLog.push('  Units need to roll 4+ on a d6 to rally back into battle');
                
                // Army A routed unit recovery
                if (aRoutedUnits.length > 0) {
                    roundLog.push(`\n  === ${armyAName} Routed Unit Recovery ===`);
                    roundLog.push(`  Attempting to rally ${aRoutedUnits.length} routed unit(s):`);
                    for (let i = aRoutedUnits.length - 1; i >= 0; i--) {
                        const routedUnit = aRoutedUnits[i];
                        const rallyRoll = rollDie();
                        const rallied = rallyRoll >= 4;
                        
                        roundLog.push(`    ${routedUnit.type} (${routedUnit.enhancement || 'None'}): Rolled ${rallyRoll} ${rallied ? '✓ RALLIED' : '✗ Still routed'} (need 4+)`);
                        
                        if (rallied) {
                            aUnits.push(routedUnit);
                            aRoutedUnits.splice(i, 1);
                        }
                    }
                    roundLog.push(`  ${armyAName} rally results: ${aUnits.length} active, ${aRoutedUnits.length} still routed`);
                }
                
                // Army B routed unit recovery
                if (bRoutedUnits.length > 0) {
                    roundLog.push(`\n  === ${armyBName} Routed Unit Recovery ===`);
                    roundLog.push(`  Attempting to rally ${bRoutedUnits.length} routed unit(s):`);
                    for (let i = bRoutedUnits.length - 1; i >= 0; i--) {
                        const routedUnit = bRoutedUnits[i];
                        const rallyRoll = rollDie();
                        const rallied = rallyRoll >= 4;
                        
                        roundLog.push(`    ${routedUnit.type} (${routedUnit.enhancement || 'None'}): Rolled ${rallyRoll} ${rallied ? '✓ RALLIED' : '✗ Still routed'} (need 4+)`);
                        
                        if (rallied) {
                            bUnits.push(routedUnit);
                            bRoutedUnits.splice(i, 1);
                        }
                    }
                    roundLog.push(`  ${armyBName} rally results: ${bUnits.length} active, ${bRoutedUnits.length} still routed`);
                }
            }            // ACTION REPORT (DESTRUCTION)
            roundLog.push('\n• Action Report: Brigade Destruction Phase');
            roundLog.push('  Each surviving brigade rolls d6 - destroyed on 1-2, survives on 3-6');
            
            // Show modifiers
            if (handlerA.destructionOn1to3 || handlerB.destructionOn1to3) {
                roundLog.push('  Merciless trait active: destroys on 1-3 instead of 1-2');
            }
            
            // Army A destruction rolls
            roundLog.push(`\n  === ${armyAName} Brigade Destruction Rolls ===`);
            let aDestructionCount = 0;
            for (let i = aUnits.length - 1; i >= 0; i--) {
                const unit = aUnits[i];
                const roll = rollDie();
                const thresholdOpp = handlerB.destructionOn1to3 ? 3 : 2;
                const destroyed = roll <= thresholdOpp;
                
                roundLog.push(`    ${unit.type} (${unit.enhancement || 'None'}): Rolled ${roll} ${destroyed ? '💀 DESTROYED' : '✓ Survives'} (destroyed on 1-${thresholdOpp})`);
                
                if (destroyed) {
                    aUnits.splice(i, 1);
                    aDestructionCount++;
                }
            }
            roundLog.push(`  ${armyAName} losses: ${aDestructionCount} brigades destroyed`);
            
            // Army B destruction rolls
            roundLog.push(`\n  === ${armyBName} Brigade Destruction Rolls ===`);
            let bDestructionCount = 0;
            for (let i = bUnits.length - 1; i >= 0; i--) {
                const unit = bUnits[i];
                const roll = rollDie();
                const thresholdOpp = handlerA.destructionOn1to3 ? 3 : 2;
                const destroyed = roll <= thresholdOpp;
                
                roundLog.push(`    ${unit.type} (${unit.enhancement || 'None'}): Rolled ${roll} ${destroyed ? '💀 DESTROYED' : '✓ Survives'} (destroyed on 1-${thresholdOpp})`);
                
                if (destroyed) {
                    bUnits.splice(i, 1);
                    bDestructionCount++;
                }
            }
            roundLog.push(`  ${armyBName} losses: ${bDestructionCount} brigades destroyed`);
            roundLog.push(`  End of Round: ${armyAName} has ${aUnits.length} brigades active (${aRoutedUnits.length} routed), ${armyBName} has ${bUnits.length} brigades active (${bRoutedUnits.length} routed).`);
            updateBattleDisplay(roundLog.join('\n'), true);            // Store round data for chart generation with all phase details
            const roundData = {
                round: round,
                armyAUnits: aUnits.length,
                armyBUnits: bUnits.length,
                armyARouted: aRoutedUnits.length,
                armyBRouted: bRoutedUnits.length,
                skirmishResult: `${aLosses || 0} vs ${bLosses || 0}`,
                details: roundLog.join('\n'),
                phaseBreakdown: {
                    skirmish: `${aLosses || 0} vs ${bLosses || 0} (destroyed)`,
                    destruction: `${aDestructionCount || 0} vs ${bDestructionCount || 0} (destroyed)`
                }
            };
            
            // Add pitch and rally data if they were calculated
            if (typeof aFinalPitch !== 'undefined' && typeof bFinalPitch !== 'undefined') {
                roundData.pitchResults = {
                    armyA: aFinalPitch,
                    armyB: bFinalPitch
                };
                roundData.phaseBreakdown.pitch = `${aFinalPitch} vs ${bFinalPitch}`;
            }
            
            if (typeof aRallyTotal !== 'undefined' && typeof bRallyTotal !== 'undefined') {
                roundData.rallyResults = {
                    armyA: aRallyTotal,
                    armyB: bRallyTotal
                };
                roundData.phaseBreakdown.rally = `${aRallyTotal} vs ${bRallyTotal}`;
            }
            
            if (typeof aDestructionCount !== 'undefined' && typeof bDestructionCount !== 'undefined') {
                roundData.destructionResults = {
                    armyA: aDestructionCount,
                    armyB: bDestructionCount
                };
            }
            
            window.battleData.rounds.push(roundData);
            
            round++;
            console.log(`Round ${round - 1} completed, checking loop condition:`, {
                aUnitsLength: aUnits.length,
                bUnitsLength: bUnits.length,
                round: round,
                maxRounds: MAX_ROUNDS,
                shouldContinue: aUnits.length > 0 && bUnits.length > 0 && round <= MAX_ROUNDS
            });
            
            // Add a small delay between phases within the round
            await delay(1000); // 1 second delay for readability
              // Check if battle should continue and log it
            if (aUnits.length > 0 && bUnits.length > 0 && round <= MAX_ROUNDS) {
                console.log(`Starting Round ${round}...`);
                await delay(2000); // Additional 2 second delay before next round
            } else {
                console.log('Battle ending conditions met:', {
                    aUnitsLength: aUnits.length,
                    bUnitsLength: bUnits.length,
                    round: round,
                    maxRounds: MAX_ROUNDS
                });
                break; // Explicitly break the loop
            }        }
        
        console.log('=== BATTLE LOOP ENDED ===');
        
        } catch (loopError) {
            console.error('Error in battle loop:', loopError);
            updateBattleDisplay(`\nBattle loop error: ${loopError.message}`, true);
        }

        // FINAL SCORING
        const finalLog = ['\n--- Battle End ---'];
        const survivorsA = aUnits.length;
        const survivorsB = bUnits.length;
        finalLog.push(`🏆 Final Survivors: ${armyAName}: ${survivorsA} | ${armyBName}: ${survivorsB}`);
        
        let victor = null;
        if (survivorsA > survivorsB) {
            finalLog.push(`${armyAName} WINS!`);
            victor = 'A';
        } else if (survivorsB > survivorsA) {
            finalLog.push(`${armyBName} WINS!`);
            victor = 'B';
        } else {
            finalLog.push('The battle is a bloody DRAW.');
        }
        
        if (round > MAX_ROUNDS) {
            finalLog.push('Battle reached maximum rounds and has been halted.');
        }

        updateBattleDisplay(finalLog.join('\n'), true);
        await delay(3000);        // ACTION REPORT PHASE (Post-Battle)
        const actionLog = ['\n=== POST-BATTLE ACTION REPORT ==='];
        actionLog.push('All surviving brigades and generals roll for final casualties and promotions.');
        actionLog.push('Brigade survival: Destroyed on 1-2, survives on 3-6');
        actionLog.push('General fate: Captured on 1, promoted on 5-6, no effect on 2-4');
        
        // Brigade casualty rolls for Army A
        actionLog.push(`\n--- ${armyAName} Final Brigade Casualty Rolls ---`);
        const aInitialCount = aUnits.length;
        const aDestroyedBrigades = [];
        
        for (let i = aUnits.length - 1; i >= 0; i--) {
            const roll = rollDie();
            const isDestroyed = roll <= 2;
            const unit = aUnits[i];
            actionLog.push(`${unit.type} (${unit.enhancement || 'None'}): Rolled ${roll} ${isDestroyed ? '💀 DESTROYED' : '✓ SURVIVES'} (destroyed on 1-2)`);
            
            if (isDestroyed) {
                aDestroyedBrigades.push(unit);
                aUnits.splice(i, 1);
            }
        }
        actionLog.push(`${armyAName} post-battle casualties: ${aDestroyedBrigades.length}/${aInitialCount} brigades destroyed`);
        
        // Victor rerolls for Army A
        if (victor === 'A' && aDestroyedBrigades.length > 0) {
            actionLog.push(`\n--- ${armyAName} Victory Rerolls ---`);
            actionLog.push(`As the victor, ${armyAName} may reroll destroyed brigades:`);
            let saved = 0;
            
            aDestroyedBrigades.forEach((unit, index) => {
                const reroll = rollDie();
                const survives = reroll > 2;
                actionLog.push(`  ${unit.type} (${unit.enhancement || 'None'}): Reroll ${reroll} ${survives ? '✓ SAVED' : '✗ Still destroyed'} (survives on 3+)`);
                
                if (survives) {
                    aUnits.push(unit);
                    saved++;
                }
            });
            actionLog.push(`Victory rerolls saved ${saved}/${aDestroyedBrigades.length} brigades`);
        }

        // Brigade casualty rolls for Army B
        actionLog.push(`\n--- ${armyBName} Final Brigade Casualty Rolls ---`);
        const bInitialCount = bUnits.length;
        const bDestroyedBrigades = [];
        
        for (let i = bUnits.length - 1; i >= 0; i--) {
            const roll = rollDie();
            const isDestroyed = roll <= 2;
            const unit = bUnits[i];
            actionLog.push(`${unit.type} (${unit.enhancement || 'None'}): Rolled ${roll} ${isDestroyed ? '💀 DESTROYED' : '✓ SURVIVES'} (destroyed on 1-2)`);
            
            if (isDestroyed) {
                bDestroyedBrigades.push(unit);
                bUnits.splice(i, 1);
            }
        }
        actionLog.push(`${armyBName} post-battle casualties: ${bDestroyedBrigades.length}/${bInitialCount} brigades destroyed`);

        // Victor rerolls for Army B
        if (victor === 'B' && bDestroyedBrigades.length > 0) {
            actionLog.push(`\n--- ${armyBName} Victory Rerolls ---`);
            actionLog.push(`As the victor, ${armyBName} may reroll destroyed brigades:`);
            let saved = 0;
            
            bDestroyedBrigades.forEach((unit, index) => {
                const reroll = rollDie();
                const survives = reroll > 2;
                actionLog.push(`  ${unit.type} (${unit.enhancement || 'None'}): Reroll ${reroll} ${survives ? '✓ SAVED' : '✗ Still destroyed'} (survives on 3+)`);
                
                if (survives) {
                    bUnits.push(unit);
                    saved++;
                }
            });
            actionLog.push(`Victory rerolls saved ${saved}/${bDestroyedBrigades.length} brigades`);
        }

        // General casualty/promotion rolls
        actionLog.push(`\n--- General Fate Rolls ---`);
        
        // General A roll
        const genARoll = rollDie();
        let genAFate = 'No effect';
        if (genARoll === 1) {
            genAFate = 'CAPTURED';
        } else if (genARoll >= 5) {
            genAFate = 'PROMOTED';
            genA.level++;
        }
        actionLog.push(`${generalAName} (${genA.trait}, Lvl ${genA.level - (genAFate === 'PROMOTED' ? 1 : 0)}): Rolled ${genARoll} → ${genAFate}`);
        if (genAFate === 'PROMOTED') {
            actionLog.push(`  ${generalAName} is now Level ${genA.level}`);
        }

        // General B roll
        const genBRoll = rollDie();
        let genBFate = 'No effect';
        if (genBRoll === 1) {
            genBFate = 'CAPTURED';
        } else if (genBRoll >= 5) {
            genBFate = 'PROMOTED';
            genB.level++;
        }
        actionLog.push(`${generalBName} (${genB.trait}, Lvl ${genB.level - (genBFate === 'PROMOTED' ? 1 : 0)}): Rolled ${genBRoll} → ${genBFate}`);
        if (genBFate === 'PROMOTED') {
            actionLog.push(`  ${generalBName} is now Level ${genB.level}`);
        }

        // Victor general reroll
        if (victor === 'A' && genAFate !== 'PROMOTED') {
            const reroll = rollDie();
            let rerollFate = 'No effect';
            if (reroll === 1) {
                rerollFate = 'CAPTURED';
            } else if (reroll >= 5) {
                rerollFate = 'PROMOTED';
                genA.level++;
            }
            actionLog.push(`${generalAName} (Victor) rerolls: ${reroll} → ${rerollFate}`);
            if (rerollFate === 'PROMOTED') {
                actionLog.push(`  ${generalAName} is now Level ${genA.level}`);
            }
        }

        if (victor === 'B' && genBFate !== 'PROMOTED') {
            const reroll = rollDie();
            let rerollFate = 'No effect';
            if (reroll === 1) {
                rerollFate = 'CAPTURED';
            } else if (reroll >= 5) {
                rerollFate = 'PROMOTED';
                genB.level++;
            }
            actionLog.push(`${generalBName} (Victor) rerolls: ${reroll} → ${rerollFate}`);
            if (rerollFate === 'PROMOTED') {
                actionLog.push(`  ${generalBName} is now Level ${genB.level}`);
            }
        }

        // Final summary
        actionLog.push(`\n--- FINAL BATTLE SUMMARY ---`);
        actionLog.push(`Victor: ${victor === 'A' ? armyAName : victor === 'B' ? armyBName : 'DRAW'}`);
        actionLog.push(`${armyAName}: ${aUnits.length} brigades remaining`);
        actionLog.push(`${armyBName}: ${bUnits.length} brigades remaining`);
        actionLog.push(`${generalAName}: Level ${genA.level}`);
        actionLog.push(`${generalBName}: Level ${genB.level}`);

        updateBattleDisplay(actionLog.join('\n'), true);
          // Store final battle result
        window.battleData.finalResult = {
            winner: victor,
            armyA: {
                totalUnits: aUnits.length,
                unitsLost: window.battleData.armies.A.initialSize - aUnits.length,
                generalStatus: genA.captured ? 'Captured' : genA.promoted ? 'Promoted' : 'Survived'
            },
            armyB: {
                totalUnits: bUnits.length,
                unitsLost: window.battleData.armies.B.initialSize - bUnits.length,
                generalStatus: genB.captured ? 'Captured' : genB.promoted ? 'Promoted' : 'Survived'
            },
            totalRounds: round - 1,
            battleLocation: window.battleData.battleLocation
        };
        
        // Show the generate report button
        const generateBtn = document.getElementById('generateReport');
        if (generateBtn) {
            generateBtn.classList.remove('hidden');
        }

        return 'Battle complete.';
    } catch (e) {
        console.error("Battle simulation error:", e);
        return 'Error: ' + e.message;
    } finally {
        // Optional: Add any cleanup code here that needs to run regardless of success or failure
    }
};

// =============================================================================
// MODULE INITIALIZATION
// =============================================================================

console.log('Battle.js loaded successfully. simulateBattle function defined.');

// =============================================================================
// SAMPLE ARMY CONFIGURATIONS
// =============================================================================
window.SAMPLE_ARMIES = [
    {
        name: "Army 1: The Swift Raiders",
        general: { trait: 'Merciless', level: 2 },
        units: [
            { type: 'cav', enhancement: 'Lancers' },
            { type: 'ranged', enhancement: 'Sharpshooters' },
            { type: 'support', enhancement: 'Field Hospital' }
        ]
    },
    {
        name: "Army 2: The Siegebreakers",
        general: { trait: 'Relentless', level: 3 },
        units: [
            { type: 'heavy', enhancement: 'Artillery Team' },
            { type: 'light', enhancement: 'Rangers' },
            { type: 'ranged', enhancement: 'Mortar Team' },
            { type: 'support', enhancement: 'Combat Engineers' },
            { type: 'cav', enhancement: 'Dragoons' }
        ]
    },
    {
        name: "Army 3: The Iron Wall",
        general: { trait: 'Resolute', level: 5 },
        units: [
            { type: 'heavy', enhancement: 'Stormtroopers' }, { type: 'heavy', enhancement: 'Grenadiers' }, { type: 'heavy', enhancement: 'None' },
            { type: 'support', enhancement: 'Field Hospital' }, { type: 'support', enhancement: 'Officer Corps' },
            { type: 'ranged', enhancement: 'Mobile Platforms' }, { type: 'ranged', enhancement: 'Mobile Platforms' }
        ]
    },
    {
        name: "Army 4: The Vanguard",
        general: { trait: 'Prodigious', level: 4 },
        units: [
            { type: 'cav', enhancement: 'Life Guard' }, { type: 'cav', enhancement: 'Lancers' }, { type: 'cav', enhancement: 'Dragoons' }, { type: 'cav', enhancement: 'None' },
            { type: 'heavy', enhancement: 'Artillery Team' }, { type: 'heavy', enhancement: 'Grenadiers' },
            { type: 'support', enhancement: 'Officer Corps' },
            { type: 'ranged', enhancement: 'Sharpshooters' },
            { type: 'light', enhancement: 'Commando' }
        ]
    },
    {
        name: "Army 5: The Guerrilla Strike",
        general: { trait: 'Inspiring', level: 3 },
        units: [
            { type: 'light', enhancement: 'Assault Team' }, { type: 'light', enhancement: 'Commando' }, { type: 'light', enhancement: 'None' },
            { type: 'support', enhancement: 'Field Hospital' }, { type: 'support', enhancement: 'Officer Corps' }
        ]
    },
    {
        name: "Army 6: The Artillery Barrage",
        general: { trait: 'Brilliant', level: 6 },
        units: [
            { type: 'heavy', enhancement: 'Artillery Team' }, { type: 'heavy', enhancement: 'Grenadiers' }, { type: 'heavy', enhancement: 'Stormtroopers' }, { type: 'heavy', enhancement: 'None' },
            { type: 'ranged', enhancement: 'Mortar Team' }, { type: 'ranged', enhancement: 'Sharpshooters' },
            { type: 'support', enhancement: 'Field Hospital' }
        ]
    },
    {
        name: "Army 7: The Sky Pirates",
        general: { trait: 'Mariner', level: 2 },
        units: [
            { type: 'cav', enhancement: 'Marines' }, { type: 'cav', enhancement: 'Marines' },
            { type: 'support', enhancement: 'Combat Engineers' }
        ]
    },
    {
        name: "Army 8: The Holy Avengers",
        general: { trait: 'Zealous', level: 7 },
        units: [
            { type: 'support', enhancement: 'Officer Corps' }, { type: 'support', enhancement: 'Field Hospital' }, { type: 'support', enhancement: 'Combat Engineers' }, { type: 'support', enhancement: 'Sentry Team' },
            { type: 'ranged', enhancement: 'Sharpshooters' }, { type: 'ranged', enhancement: 'Mortar Team' },
            { type: 'light', enhancement: 'Assault Team' },
            { type: 'heavy', enhancement: 'Artillery Team' }, { type: 'heavy', enhancement: 'Stormtroopers' }
        ]
    },
    {
        name: "Army 9: The Trench Busters",
        general: { trait: 'Brutal', level: 4 },
        units: [
            { type: 'cav', enhancement: 'Lancers' }, { type: 'cav', enhancement: 'Dragoons' },
            { type: 'heavy', enhancement: 'Artillery Team' }, { type: 'heavy', enhancement: 'Grenadiers' },
            { type: 'support', enhancement: 'Combat Engineers' }
        ]
    },
    {
        name: "Army 10: The Unyielding Charge",
        general: { trait: 'Heroic', level: 5 },
        units: [
            { type: 'cav', enhancement: 'Dragoons' }, { type: 'cav', enhancement: 'Life Guard' }, { type: 'cav', enhancement: 'None' },
            { type: 'heavy', enhancement: 'Stormtroopers' }, { type: 'heavy', enhancement: 'Grenadiers' },
            { type: 'support', enhancement: 'Officer Corps' }, { type: 'support', enhancement: 'Combat Engineers' }
        ]
    }
];

// =============================================================================
// TRAIT EFFECTS HANDLER
// =============================================================================
/**
 * Defines handlers for each general trait to modify battle phases.
 */
const TRAIT_HANDLERS = {
  Ambitious: {
    // -1 to promotion threshold
    adjustPromotionThreshold: (threshold) => threshold - 1
  },
  Bold: {
    // add half general level (rounded up) to one skirmisher
    applySkirmishBonus: (units, level) => {
      const bonus = Math.ceil(level / 2);
      // give bonus to first unit in skirmish
      if (units.length) units[0].skirmish += bonus;
    }
  },
  Brilliant: {
    // double general level during pitch
    adjustPitchTotal: (total, level) => total + level // will add level again for doubling
  },
  Brutal: {
    // pillage success on 5-6 (set flag)
    enableBrutalPillage: true,
    // raze counts as sack
    enableBrutalRaze: true
  },
  Cautious: {
    // skip entire skirmish phase
    skipSkirmish: true
  },
  Chivalrous: {
    // If defending in a siege and attacker fails a roll, offer a reroll
    async offerReroll(attackerName) {
        return await showModal(
            `${attackerName}, the chivalrous defender offers you a chance to reroll your failed attack. Do you accept?`,
            ['Yes, accept the offer', 'No, decline']
        );
    }
},
  Confident: {
    defenseBonus: 2,
    rallyBonus: 1
  },
  Defiant: {
    rallyBonus: 2
  },
  Disciplined: {
    pitchBonus: 1,
    rallyBonus: 1
  },
  Dogged: {
    // If losing, choose 2 brigades to assist
    async getAssistingBrigades(army, generalName) {
        const choices = army.map((unit, i) => ({ text: `${unit.type} (${unit.enhancement || 'None'})`, value: i }));
        return await showModal(
            `${generalName} is Dogged! Their army is losing. Choose 2 brigades to send as reinforcements.`,
            choices,
            2 // User must select 2 units
        );
    }
},
  Heroic: {
    rallyBonus: 1,
    // On loss, sacrifice general to save one brigade
    async offerSacrifice(generalName) {
        return await showModal(
            `${generalName} is Heroic! Their army faces annihilation. Do you want to sacrifice the general to save one brigade?`,
            ['Yes, sacrifice the general', 'No, accept defeat']
        );
    }
},
  Inspiring: {
    enableRallyReroll: true,
    celebrateBonus: 2
  },
  Lucky: {
    enablePromotionReroll: true
  },
  Mariner: {
    seaMovementBonus: 1,
    enableSeaSiege: true
  },
  Merciless: {
    destructionOn1to3: true
  },
  Prodigious: {
    extraLevels: 2,
    // lost on reroll: ignore here
  },
  Relentless: {
    landMoveBonus: 1,
    enablePursuit: true
  },
  Resolute: {
    defenseBonus: 3
  },
  Wary: {
    enableExtendedSight: true,
    enableRevealGenerals: true
  },
  Zealous: {
    rallyBonus: 1,
    rallyBonusInHolyWar: 2,
    pitchBonusInHolyWar: 1
  }
};

/**
 * Show a modal for interactive prompts and return user's choice
 * @param {string} message - The message to display in the modal
 * @param {Array<string|Object>} choices - Array of choices (strings or {text, value})
 * @param {number} requiredSelections - Number of selections required
 * @returns {Promise<any>} Promise that resolves with the user's selection
 */
function showModal(message, choices, requiredSelections = 1) {
    return new Promise((resolve) => {
        const modal = document.getElementById('interactiveModal');
        const title = document.getElementById('modalTitle');
        const msg = document.getElementById('modalMessage');
        const choiceContainer = document.getElementById('modalChoices');

        title.textContent = 'Player Decision Required';
        msg.textContent = message;
        choiceContainer.innerHTML = '';

        let selections = [];

        choices.forEach(choice => {
            const button = document.createElement('button');
            button.className = 'bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors';
            
            if (typeof choice === 'object') {
                button.textContent = choice.text;
                button.dataset.value = choice.value;
            } else {
                button.textContent = choice;
                button.dataset.value = choice;
            }

            button.addEventListener('click', () => {
                if (requiredSelections > 1) {
                    // Handle multiple selections
                    const index = selections.indexOf(button.dataset.value);
                    if (index > -1) {
                        selections.splice(index, 1);
                        button.classList.remove('bg-green-500'); // Deselect
                    } else {
                        selections.push(button.dataset.value);
                        button.classList.add('bg-green-500'); // Select
                    }

                    if (selections.length === requiredSelections) {
                        modal.classList.add('hidden');
                        resolve(selections);
                    }
                } else {
                    // Handle single selection
                    modal.classList.add('hidden');
                    resolve(button.dataset.value);
                }
            });
            choiceContainer.appendChild(button);
        });

        modal.classList.remove('hidden');
    });
}

/**
 * Generate a visual battle report as a downloadable image
 * Creates charts showing round-by-round data and final battle results
 */
function generateBattleReport() {
    const canvas = document.getElementById('battleCanvas');
    if (!canvas || !window.battleData || !window.battleData.finalResult) {
        console.error('Cannot generate report: missing canvas or battle data');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#f8fafc');
    gradient.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Add border
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, width - 20, height - 20);
    
    // Title
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('BATTLE REPORT', width / 2, 60);
      // Battle info
    const finalResult = window.battleData.finalResult;
    const armies = window.battleData.armies;
    const generals = window.battleData.generals;
    const battleLocation = window.battleData.battleLocation;
    
    ctx.font = '20px Arial';
    ctx.fillStyle = '#475569';
    
    const armyAName = armies.A ? armies.A.name || 'Army A' : 'Army A';
    const armyBName = armies.B ? armies.B.name || 'Army B' : 'Army B';
    const generalAName = generals.A ? generals.A.name || 'General A' : 'General A';
    const generalBName = generals.B ? generals.B.name || 'General B' : 'General B';
    
    ctx.fillText(`${armyAName} vs ${armyBName}`, width / 2, 100);
    ctx.fillText(`${generalAName} vs ${generalBName}`, width / 2, 130);
    if (battleLocation) {
        ctx.font = '16px Arial';
        ctx.fillText(`Location: ${battleLocation}`, width / 2, 155);
    }
      // Battle outcome
    ctx.font = 'bold 28px Arial';
    ctx.fillStyle = finalResult.winner === 'A' ? '#059669' : '#dc2626';
    const winnerName = finalResult.winner === 'A' ? armyAName : armyBName;
    ctx.fillText(`🏆 VICTORY: ${winnerName} 🏆`, width / 2, 190);
    
    // Battle summary stats
    ctx.font = '16px Arial';
    ctx.fillStyle = '#374151';
    ctx.textAlign = 'left';
    
    const leftCol = 50;
    const rightCol = width / 2 + 50;
    let yPos = 230;
    
    // Army A Stats
    ctx.fillStyle = '#7c3aed';
    ctx.font = 'bold 18px Arial';
    ctx.fillText(`${armyAName} Final Status:`, leftCol, yPos);
    ctx.font = '16px Arial';
    ctx.fillStyle = '#374151';
    yPos += 25;
      if (finalResult.armyA) {
        ctx.fillText(`Units Remaining: ${finalResult.armyA.totalUnits}`, leftCol, yPos);
        yPos += 20;
        ctx.fillText(`Units Lost: ${finalResult.armyA.unitsLost || 0}`, leftCol, yPos);
        yPos += 20;
        ctx.fillText(`General Status: ${finalResult.armyA.generalStatus}`, leftCol, yPos);
        yPos += 25;
        ctx.fillText(`Battle Duration: ${finalResult.totalRounds} rounds`, leftCol, yPos);
        yPos += 20;
    }
      // Army B Stats
    yPos = 230;
    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 18px Arial';
    ctx.fillText(`${armyBName} Final Status:`, rightCol, yPos);
    ctx.font = '16px Arial';
    ctx.fillStyle = '#374151';
    yPos += 25;
    
    if (finalResult.armyB) {
        ctx.fillText(`Units Remaining: ${finalResult.armyB.totalUnits}`, rightCol, yPos);
        yPos += 20;
        ctx.fillText(`Units Lost: ${finalResult.armyB.unitsLost || 0}`, rightCol, yPos);
        yPos += 20;
        ctx.fillText(`General Status: ${finalResult.armyB.generalStatus}`, rightCol, yPos);
        yPos += 20;
    }
      // Round-by-round chart
    if (window.battleData.rounds && window.battleData.rounds.length > 0) {
        drawRoundChart(ctx, window.battleData.rounds, 50, 370, width - 100, 220);
    }
      // Phase details chart (new)
    if (window.battleData.rounds && window.battleData.rounds.length > 0) {
        drawPhaseDetailsChart(ctx, window.battleData.rounds, 50, 620, width - 100, 300);
    }
    
    // Round-by-round summary text
    if (window.battleData.rounds && window.battleData.rounds.length > 0) {
        drawRoundSummaryText(ctx, window.battleData.rounds, 50, 950, width - 100, 200);
    }

    // Unit composition chart (moved down to accommodate new charts)
    if (armies.A && armies.B) {
        drawUnitCompositionChart(ctx, armies.A, armies.B, 50, 1180, width - 100, 180);
    }
    
    // Add timestamp
    ctx.font = '12px Arial';
    ctx.fillStyle = '#6b7280';
    ctx.textAlign = 'right';
    ctx.fillText(`Generated: ${new Date().toLocaleString()}`, width - 30, height - 20);
    
    // Convert to downloadable image
    const link = document.createElement('a');
    link.download = `battle_report_${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
}

/**
 * Draw round-by-round chart showing army strength over time
 */
function drawRoundChart(ctx, rounds, x, y, width, height) {
    ctx.save();
    
    // Chart background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);
    
    // Chart title
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Army Strength by Round', x + width / 2, y - 10);
    
    if (rounds.length === 0) {
        ctx.fillStyle = '#6b7280';
        ctx.font = '14px Arial';
        ctx.fillText('No round data available', x + width / 2, y + height / 2);
        ctx.restore();
        return;
    }
    
    // Chart margins
    const margin = 30;
    const chartX = x + margin;
    const chartY = y + margin;
    const chartWidth = width - margin * 2;
    const chartHeight = height - margin * 2;
    
    // Find max values for scaling
    const maxUnits = Math.max(
        ...rounds.map(r => Math.max(r.armyAUnits || 0, r.armyBUnits || 0))
    );
    
    if (maxUnits === 0) {
        ctx.fillStyle = '#6b7280';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('No unit data available', x + width / 2, y + height / 2);
        ctx.restore();
        return;
    }
    
    // Draw grid lines
    ctx.strokeStyle = '#f3f4f6';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const gridY = chartY + (chartHeight * i / 5);
        ctx.beginPath();
        ctx.moveTo(chartX, gridY);
        ctx.lineTo(chartX + chartWidth, gridY);
        ctx.stroke();
    }
    
    // Draw axes
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(chartX, chartY);
    ctx.lineTo(chartX, chartY + chartHeight);
    ctx.lineTo(chartX + chartWidth, chartY + chartHeight);
    ctx.stroke();
    
    // Draw data lines
    const stepX = chartWidth / Math.max(rounds.length - 1, 1);
    
    // Army A line (purple)
    ctx.strokeStyle = '#7c3aed';
    ctx.lineWidth = 3;
    ctx.beginPath();
    rounds.forEach((round, index) => {
        const x_pos = chartX + index * stepX;
        const y_pos = chartY + chartHeight - ((round.armyAUnits || 0) / maxUnits) * chartHeight;
        if (index === 0) {
            ctx.moveTo(x_pos, y_pos);
        } else {
            ctx.lineTo(x_pos, y_pos);
        }
    });
    ctx.stroke();
    
    // Army B line (red)
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 3;
    ctx.beginPath();
    rounds.forEach((round, index) => {
        const x_pos = chartX + index * stepX;
        const y_pos = chartY + chartHeight - ((round.armyBUnits || 0) / maxUnits) * chartHeight;
        if (index === 0) {
            ctx.moveTo(x_pos, y_pos);
        } else {
            ctx.lineTo(x_pos, y_pos);
        }
    });
    ctx.stroke();
      // Add data points with phase information
    rounds.forEach((round, index) => {
        const x_pos = chartX + index * stepX;
        
        // Army A points
        const y_posA = chartY + chartHeight - ((round.armyAUnits || 0) / maxUnits) * chartHeight;
        ctx.fillStyle = '#7c3aed';
        ctx.beginPath();
        ctx.arc(x_pos, y_posA, 4, 0, 2 * Math.PI);
        ctx.fill();
        
        // Army B points
        const y_posB = chartY + chartHeight - ((round.armyBUnits || 0) / maxUnits) * chartHeight;
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(x_pos, y_posB, 4, 0, 2 * Math.PI);
        ctx.fill();
        
        // Add unit count labels on hover points
        ctx.fillStyle = '#374151';
        ctx.font = '9px Arial';
        ctx.textAlign = 'center';
        
        // Army A unit count
        if (round.armyAUnits > 0) {
            ctx.fillStyle = '#7c3aed';
            ctx.fillText(round.armyAUnits.toString(), x_pos, y_posA - 8);
        }
        
        // Army B unit count  
        if (round.armyBUnits > 0) {
            ctx.fillStyle = '#dc2626';
            ctx.fillText(round.armyBUnits.toString(), x_pos, y_posB + 15);
        }
        
        // Add routed unit indicators if available
        if (round.armyARouted > 0) {
            ctx.fillStyle = '#a855f7';
            ctx.font = '8px Arial';
            ctx.fillText(`+${round.armyARouted}r`, x_pos + 12, y_posA - 8);
        }
        
        if (round.armyBRouted > 0) {
            ctx.fillStyle = '#f87171';
            ctx.font = '8px Arial';
            ctx.fillText(`+${round.armyBRouted}r`, x_pos + 12, y_posB + 15);
        }
    });
    
    // Y-axis labels
    ctx.fillStyle = '#374151';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
        const value = Math.round((maxUnits * (5 - i)) / 5);
        const labelY = chartY + (chartHeight * i / 5) + 4;
        ctx.fillText(value.toString(), chartX - 5, labelY);
    }
    
    // X-axis labels (round numbers)
    ctx.textAlign = 'center';
    rounds.forEach((round, index) => {
        const x_pos = chartX + index * stepX;
        ctx.fillText(`R${index + 1}`, x_pos, chartY + chartHeight + 15);
    });
    
    // Legend
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    
    // Army A legend
    ctx.fillStyle = '#7c3aed';
    ctx.fillRect(chartX + chartWidth - 150, chartY + 10, 15, 15);
    ctx.fillText('Army A', chartX + chartWidth - 130, chartY + 22);
    
    // Army B legend
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(chartX + chartWidth - 150, chartY + 30, 15, 15);
    ctx.fillText('Army B', chartX + chartWidth - 130, chartY + 42);
    
    ctx.restore();
}

/**
 * Draw detailed phase analysis chart showing phase results for each round
 */
function drawPhaseDetailsChart(ctx, rounds, x, y, width, height) {
    ctx.save();
    
    // Chart background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);
    
    // Chart title
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Battle Phase Analysis by Round', x + width / 2, y - 10);
    
    if (rounds.length === 0) {
        ctx.fillStyle = '#6b7280';
        ctx.font = '14px Arial';
        ctx.fillText('No phase data available', x + width / 2, y + height / 2);
        ctx.restore();
        return;
    }
    
    // Chart margins
    const margin = 40;
    const chartX = x + margin;
    const chartY = y + margin;
    const chartWidth = width - margin * 2;
    const chartHeight = height - margin * 2;
    
    // Calculate dimensions for phase sections
    const headerHeight = 30;
    const phaseHeight = (chartHeight - headerHeight) / 4; // 4 phases: Skirmish, Pitch, Rally, Destruction
    const roundWidth = chartWidth / Math.max(rounds.length, 1);
    
    // Phase labels
    const phases = ['Skirmish', 'Pitch', 'Rally', 'Destruction'];
    const phaseColors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b'];
    
    // Draw phase section headers
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    
    phases.forEach((phase, index) => {
        const phaseY = chartY + headerHeight + index * phaseHeight;
        
        // Phase background
        ctx.fillStyle = phaseColors[index];
        ctx.globalAlpha = 0.1;
        ctx.fillRect(chartX, phaseY, chartWidth, phaseHeight);
        ctx.globalAlpha = 1;
        
        // Phase label
        ctx.fillStyle = phaseColors[index];
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.save();
        ctx.translate(chartX - 20, phaseY + phaseHeight / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(phase, 0, 0);
        ctx.restore();
        
        // Separator lines
        if (index > 0) {
            ctx.strokeStyle = '#d1d5db';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(chartX, phaseY);
            ctx.lineTo(chartX + chartWidth, phaseY);
            ctx.stroke();
        }
    });
    
    // Draw round separators
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 1; i < rounds.length; i++) {
        const roundX = chartX + i * roundWidth;
        ctx.beginPath();
        ctx.moveTo(roundX, chartY + headerHeight);
        ctx.lineTo(roundX, chartY + chartHeight);
        ctx.stroke();
    }
    
    // Draw round data
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    
    rounds.forEach((round, roundIndex) => {
        const roundX = chartX + roundIndex * roundWidth + roundWidth / 2;
        
        // Round header
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(`R${roundIndex + 1}`, roundX, chartY + 20);
        
        // Phase data
        phases.forEach((phase, phaseIndex) => {
            const phaseY = chartY + headerHeight + phaseIndex * phaseHeight + phaseHeight / 2;
            
            ctx.fillStyle = '#374151';
            ctx.font = '9px Arial';
            
            let displayText = '';
            let armyAValue = '';
            let armyBValue = '';
            
            switch(phase) {
                case 'Skirmish':
                    if (round.phaseBreakdown && round.phaseBreakdown.skirmish) {
                        displayText = round.phaseBreakdown.skirmish;
                        const skirmishParts = displayText.split(' vs ');
                        armyAValue = skirmishParts[0] || '0';
                        armyBValue = (skirmishParts[1] || '0').replace(' (destroyed)', '');
                    }
                    break;
                case 'Pitch':
                    if (round.pitchResults) {
                        armyAValue = round.pitchResults.armyA.toString();
                        armyBValue = round.pitchResults.armyB.toString();
                        displayText = `${armyAValue} vs ${armyBValue}`;
                    } else if (round.phaseBreakdown && round.phaseBreakdown.pitch) {
                        displayText = round.phaseBreakdown.pitch;
                        const pitchParts = displayText.split(' vs ');
                        armyAValue = pitchParts[0] || '0';
                        armyBValue = pitchParts[1] || '0';
                    }
                    break;
                case 'Rally':
                    if (round.rallyResults) {
                        armyAValue = round.rallyResults.armyA.toString();
                        armyBValue = round.rallyResults.armyB.toString();
                        displayText = `${armyAValue} vs ${armyBValue}`;
                    } else if (round.phaseBreakdown && round.phaseBreakdown.rally) {
                        displayText = round.phaseBreakdown.rally;
                        const rallyParts = displayText.split(' vs ');
                        armyAValue = rallyParts[0] || '0';
                        armyBValue = rallyParts[1] || '0';
                    }
                    break;
                case 'Destruction':
                    if (round.destructionResults) {
                        armyAValue = round.destructionResults.armyA.toString();
                        armyBValue = round.destructionResults.armyB.toString();
                        displayText = `${armyAValue} vs ${armyBValue}`;
                    } else if (round.phaseBreakdown && round.phaseBreakdown.destruction) {
                        displayText = round.phaseBreakdown.destruction;
                        const destructParts = displayText.split(' vs ');
                        armyAValue = destructParts[0] || '0';
                        armyBValue = (destructParts[1] || '0').replace(' (destroyed)', '');
                    }
                    break;
            }
            
            // Display Army A value (purple)
            ctx.fillStyle = '#7c3aed';
            ctx.fillText(armyAValue, roundX - 15, phaseY - 3);
            
            // Display vs
            ctx.fillStyle = '#6b7280';
            ctx.fillText('vs', roundX, phaseY - 3);
            
            // Display Army B value (red)
            ctx.fillStyle = '#dc2626';
            ctx.fillText(armyBValue, roundX + 15, phaseY - 3);
            
            // Show army status (active/routed units)
            if (phase === 'Skirmish' && round.armyARouted !== undefined && round.armyBRouted !== undefined) {
                ctx.fillStyle = '#6b7280';
                ctx.font = '8px Arial';
                const routedText = `(${round.armyAUnits}+${round.armyARouted} vs ${round.armyBUnits}+${round.armyBRouted})`;
                ctx.fillText(routedText, roundX, phaseY + 8);
            }
        });
        
        // Show round outcome summary
        const summaryY = chartY + chartHeight - 15;
        ctx.fillStyle = '#374151';
        ctx.font = '9px Arial';
        const armyAUnits = round.armyAUnits || 0;
        const armyBUnits = round.armyBUnits || 0;
        const survivor = armyAUnits > armyBUnits ? 'A' : armyBUnits > armyAUnits ? 'B' : 'Tie';
        ctx.fillStyle = survivor === 'A' ? '#7c3aed' : survivor === 'B' ? '#dc2626' : '#6b7280';
        ctx.fillText(`${armyAUnits}|${armyBUnits}`, roundX, summaryY);
    });
    
    // Legend
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    
    // Army A legend
    ctx.fillStyle = '#7c3aed';
    ctx.fillRect(chartX + chartWidth - 200, chartY + 10, 15, 10);
    ctx.fillText('Army A', chartX + chartWidth - 180, chartY + 20);
    
    // Army B legend
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(chartX + chartWidth - 200, chartY + 25, 15, 10);
    ctx.fillText('Army B', chartX + chartWidth - 180, chartY + 35);
    
    // Explanation
    ctx.fillStyle = '#6b7280';
    ctx.font = '10px Arial';
    ctx.fillText('Values show phase results, bottom shows surviving units', chartX + chartWidth - 200, chartY + 50);
    ctx.fillText('Format: Army A vs Army B', chartX + chartWidth - 200, chartY + 62);
    
    ctx.restore();
}

/**
 * Draw round-by-round text summary showing key phase results
 */
function drawRoundSummaryText(ctx, rounds, x, y, width, height) {
    ctx.save();
    
    // Chart background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);
    
    // Chart title
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Round-by-Round Phase Summary', x + width / 2, y - 10);
    
    if (rounds.length === 0) {
        ctx.fillStyle = '#6b7280';
        ctx.font = '14px Arial';
        ctx.fillText('No round data available', x + width / 2, y + height / 2);
        ctx.restore();
        return;
    }
    
    // Calculate layout
    const margin = 20;
    const textX = x + margin;
    const textY = y + margin;
    const textWidth = width - margin * 2;
    const textHeight = height - margin * 2;
    
    const lineHeight = 16;
    const roundsPerColumn = Math.floor(textHeight / (lineHeight * 3)); // 3 lines per round
    const columnWidth = textWidth / Math.ceil(rounds.length / roundsPerColumn);
    
    ctx.font = '11px Arial';
    ctx.textAlign = 'left';
    
    rounds.forEach((round, index) => {
        const column = Math.floor(index / roundsPerColumn);
        const row = index % roundsPerColumn;
        
        const startX = textX + column * columnWidth;
        const startY = textY + row * lineHeight * 3;
        
        // Round header
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(`Round ${round.round}:`, startX, startY);
        
        // Army status
        ctx.fillStyle = '#374151';
        ctx.font = '10px Arial';
        const armyStatus = `Active: ${round.armyAUnits || 0} vs ${round.armyBUnits || 0}`;
        const routedStatus = round.armyARouted !== undefined ? 
            ` | Routed: ${round.armyARouted} vs ${round.armyBRouted}` : '';
        ctx.fillText(armyStatus + routedStatus, startX + 5, startY + 12);
        
        // Phase results summary
        let phaseText = '';
        if (round.phaseBreakdown) {
            const phases = [];
            if (round.phaseBreakdown.skirmish) phases.push(`S:${round.phaseBreakdown.skirmish}`);
            if (round.phaseBreakdown.pitch) phases.push(`P:${round.phaseBreakdown.pitch}`);
            if (round.phaseBreakdown.rally) phases.push(`R:${round.phaseBreakdown.rally}`);
            if (round.phaseBreakdown.destruction) phases.push(`D:${round.phaseBreakdown.destruction}`);
            phaseText = phases.join(' | ');
        }
        
        ctx.fillStyle = '#6b7280';
        ctx.font = '9px Arial';
        // Truncate text if too long
        if (phaseText.length > columnWidth / 4) {
            phaseText = phaseText.substring(0, columnWidth / 4) + '...';
        }
        ctx.fillText(phaseText, startX + 5, startY + 24);
    });
    
    // Legend
    ctx.fillStyle = '#6b7280';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('S=Skirmish, P=Pitch, R=Rally, D=Destruction | Format: Army A vs Army B', x + width / 2, y + height - 5);
    
    ctx.restore();
}
