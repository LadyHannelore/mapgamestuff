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
    const imageMap = UNIT_IMAGE_MAP;
    const counts = army.reduce((acc, unit) => {
        let key = unit.type;
        if (unit.enhancement && unit.enhancement !== 'None' && unit.enhancement.trim() !== '') {
            key += ` (${unit.enhancement})`;
        }
        if (!acc[key]) acc[key] = { count: 0, type: unit.type, enhancement: unit.enhancement };
        acc[key].count++;
        return acc;
    }, {});
    
    for (const unitKey in counts) {
        const tr = document.createElement('tr');
        const tdImg = document.createElement('td');
        const tdUnit = document.createElement('td');
        const tdCount = document.createElement('td');
        const tdActions = document.createElement('td');
        
        const type = counts[unitKey].type;
        const enhancement = counts[unitKey].enhancement;
        
        // Image
        const img = document.createElement('img');
        img.src = imageMap[type] || '';
        img.alt = type;
        tdImg.appendChild(img);
        
        // Unit name
        tdUnit.textContent = unitKey;
        
        // Count
        tdCount.textContent = counts[unitKey].count;
        
        // Actions (Remove buttons)
        const removeOneBtn = document.createElement('button');
        removeOneBtn.textContent = '-1';
        removeOneBtn.className = 'bg-yellow-500 text-white px-2 py-1 rounded mr-1 text-xs hover:bg-yellow-600 transition-colors';
        removeOneBtn.onclick = () => removeUnits(army, listEl, type, enhancement, 1);
        
        const removeAllBtn = document.createElement('button');
        removeAllBtn.textContent = '❌';
        removeAllBtn.className = 'bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors';
        removeAllBtn.onclick = () => removeUnits(army, listEl, type, enhancement, counts[unitKey].count);
        
        tdActions.appendChild(removeOneBtn);
        tdActions.appendChild(removeAllBtn);
        
        // Apply classes
        tdImg.className = 'border px-2 py-1';
        tdUnit.className = 'border px-2 py-1';
        tdCount.className = 'border px-2 py-1';
        tdActions.className = 'border px-2 py-1';
        
        tr.appendChild(tdImg);
        tr.appendChild(tdUnit);
        tr.appendChild(tdCount);
        tr.appendChild(tdActions);
        listEl.appendChild(tr);
    }
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

// Helper function to update battle result display
function updateBattleDisplay(content, append = false, newBattle = false) {
    const battleResultDiv = document.getElementById('battleResult');
    if (battleResultDiv) {
        if (newBattle) {
            // For new battles, add a separator and append
            if (battleResultDiv.innerHTML.trim() && !battleResultDiv.innerHTML.includes('Set up your armies')) {
                battleResultDiv.innerHTML += '<hr class="my-4 border-gray-400">';
            }
            battleResultDiv.innerHTML += `<pre class="text-left whitespace-pre-wrap">${content}</pre>`;
        } else if (append) {
            battleResultDiv.innerHTML += `<pre class="text-left whitespace-pre-wrap">${content}</pre>`;
        } else {
            battleResultDiv.innerHTML = `<pre class="text-left whitespace-pre-wrap">${content}</pre>`;
        }
        // Scroll to bottom to show latest content
        battleResultDiv.scrollTop = battleResultDiv.scrollHeight;
    }
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
                  // Determine how many 1v1 skirmish matchups occur (max 2 per round)
                const maxSkirmishes = Math.min(aUnits.length, bUnits.length, 2);
                roundLog.push(`  ${maxSkirmishes} skirmish matchup(s) will occur.`);
                
                // Reset loss counters for this skirmish phase
                aLosses = 0;
                bLosses = 0;
                
                for (let i = 0; i < maxSkirmishes; i++) {
                    // Select random units for skirmish
                    const aSkirmisher = aUnits[Math.floor(Math.random() * aUnits.length)];
                    const bSkirmisher = bUnits[Math.floor(Math.random() * bUnits.length)];
                    
                    let aSkirmishValue = getUnitStats(aSkirmisher).skirmish;
                    let bSkirmishValue = getUnitStats(bSkirmisher).skirmish;
                    
                    // Apply Bold trait bonus to one skirmisher
                    if (handlerA.applySkirmishBonus && i === 0) {
                        const bonus = Math.ceil(genA.level / 2);
                        aSkirmishValue += bonus;
                        roundLog.push(`  ${aSkirmisher.type} gets +${bonus} from Bold trait.`);
                    }
                    if (handlerB.applySkirmishBonus && i === 0) {
                        const bonus = Math.ceil(genB.level / 2);
                        bSkirmishValue += bonus;
                        roundLog.push(`  ${bSkirmisher.type} gets +${bonus} from Bold trait.`);
                    }
                    
                    roundLog.push(`  Matchup ${i + 1}: ${aSkirmisher.type} (${aSkirmishValue}) vs ${bSkirmisher.type} (${bSkirmishValue})`);                    if (aSkirmishValue > bSkirmishValue) {
                        const difference = aSkirmishValue - bSkirmishValue;
                        const isLancer = aSkirmisher.type === 'cav' && (aSkirmisher.enhancement === 'Lancers' || aSkirmisher.enhancement === 'Lancer');
                        
                        if (isLancer && difference >= 3) {
                            // Lancer forces a destruction roll instead of routing
                            const destructionRoll = rollDie();
                            roundLog.push(`    ${armyAName}'s ${aSkirmisher.type} wins by ${difference} - ${armyBName}'s ${bSkirmisher.type} must roll for destruction: ${destructionRoll}`);
                            if (destructionRoll <= 2) {
                                roundLog.push(`      ${armyBName}'s ${bSkirmisher.type} DESTROYED by lancer charge!`);
                                bLosses++;
                            } else {
                                roundLog.push(`      ${armyBName}'s ${bSkirmisher.type} survives but is routed.`);
                                // Route the unit
                                const routedUnit = bUnits[Math.floor(Math.random() * bUnits.length)];
                                bRoutedThisRound.push(routedUnit);
                                const routedIndex = bUnits.indexOf(routedUnit);
                                if (routedIndex > -1) {
                                    bUnits.splice(routedIndex, 1);
                                    bRoutedUnits.push(routedUnit);
                                }
                            }
                        } else {
                            roundLog.push(`    ${armyAName}'s ${aSkirmisher.type} wins - ${armyBName}'s ${bSkirmisher.type} routed.`);
                            // Route the unit instead of destroying it
                            const routedUnit = bUnits[Math.floor(Math.random() * bUnits.length)];
                            bRoutedThisRound.push(routedUnit);
                            const routedIndex = bUnits.indexOf(routedUnit);
                            if (routedIndex > -1) {
                                bUnits.splice(routedIndex, 1);
                                bRoutedUnits.push(routedUnit);
                            }
                        }
                    } else if (bSkirmishValue > aSkirmishValue) {
                        const difference = bSkirmishValue - aSkirmishValue;
                        const isLancer = bSkirmisher.type === 'cav' && (bSkirmisher.enhancement === 'Lancers' || bSkirmisher.enhancement === 'Lancer');
                        
                        if (isLancer && difference >= 3) {
                            // Lancer forces a destruction roll instead of routing
                            const destructionRoll = rollDie();
                            roundLog.push(`    ${armyBName}'s ${bSkirmisher.type} wins by ${difference} - ${armyAName}'s ${aSkirmisher.type} must roll for destruction: ${destructionRoll}`);
                            if (destructionRoll <= 2) {
                                roundLog.push(`      ${armyAName}'s ${aSkirmisher.type} DESTROYED by lancer charge!`);
                                aLosses++;
                            } else {
                                roundLog.push(`      ${armyAName}'s ${aSkirmisher.type} survives but is routed.`);
                                // Route the unit
                                const routedUnit = aUnits[Math.floor(Math.random() * aUnits.length)];
                                aRoutedThisRound.push(routedUnit);
                                const routedIndex = aUnits.indexOf(routedUnit);
                                if (routedIndex > -1) {
                                    aUnits.splice(routedIndex, 1);
                                    aRoutedUnits.push(routedUnit);
                                }
                            }
                        } else {
                            roundLog.push(`    ${armyBName}'s ${bSkirmisher.type} wins - ${armyAName}'s ${aSkirmisher.type} routed.`);
                            // Route the unit instead of destroying it
                            const routedUnit = aUnits[Math.floor(Math.random() * aUnits.length)];
                            aRoutedThisRound.push(routedUnit);
                            const routedIndex = aUnits.indexOf(routedUnit);
                            if (routedIndex > -1) {
                                aUnits.splice(routedIndex, 1);
                                aRoutedUnits.push(routedUnit);
                            }
                        }
                    } else {
                        roundLog.push(`    Tied skirmish - no casualties.`);
                    }}
                
                // Remove only the actually destroyed units (by lancers)
                for (let i = 0; i < aLosses && aUnits.length > 0; i++) {
                    const randomIndex = Math.floor(Math.random() * aUnits.length);
                    aUnits.splice(randomIndex, 1);
                }
                for (let i = 0; i < bLosses && bUnits.length > 0; i++) {
                    const randomIndex = Math.floor(Math.random() * bUnits.length);
                    bUnits.splice(randomIndex, 1);
                }
                
                const totalALosses = aLosses + aRoutedThisRound.length;
                const totalBLosses = bLosses + bRoutedThisRound.length;
                roundLog.push(`  Skirmish results: ${armyAName} lost ${totalALosses} (${aLosses} destroyed, ${aRoutedThisRound.length} routed), ${armyBName} lost ${totalBLosses} (${bLosses} destroyed, ${bRoutedThisRound.length} routed).`);
            }

            // PITCH PHASE
            roundLog.push('• Pitch phase begins');
            const pitchRollA = aUnits.reduce((sum, u) => sum + getUnitStats(u).pitch, 0) + genA.level;
            const pitchRollB = bUnits.reduce((sum, u) => sum + getUnitStats(u).pitch, 0) + genB.level;
            // Brilliant: extra pitch
            const finalPitchA = handlerA.adjustPitchTotal ? handlerA.adjustPitchTotal(pitchRollA, genA.level) : pitchRollA;
            const finalPitchB = handlerB.adjustPitchTotal ? handlerB.adjustPitchTotal(pitchRollB, genB.level) : pitchRollB;
            roundLog.push(`  ${armyAName} pitch: ${finalPitchA}`);
            roundLog.push(`  ${armyBName} pitch: ${finalPitchB}`);            // RALLY PHASE
            roundLog.push('• Rally phase begins');
            const rallyRolls = (units, handler, level) => {
              let total = units.reduce((sum, u) => sum + getUnitStats(u).rally, 0) + 1;
              // Rally bonus
              if (handler.rallyBonus) total += handler.rallyBonus;
              // Inspiring: reroll lowest 1
              if (handler.enableRallyReroll) total += 1;
              return total;
            };
            const finalRallyA = rallyRolls(aUnits, handlerA, genA.level);
            const finalRallyB = rallyRolls(bUnits, handlerB, genB.level);
            roundLog.push(`  ${armyAName} rally: ${finalRallyA}`);
            roundLog.push(`  ${armyBName} rally: ${finalRallyB}`);
            
            // ROUTED UNIT RECOVERY
            if (aRoutedUnits.length > 0 || bRoutedUnits.length > 0) {
                roundLog.push('• Routed Unit Recovery');
                
                // Army A routed unit recovery
                if (aRoutedUnits.length > 0) {
                    roundLog.push(`  ${armyAName} attempts to rally ${aRoutedUnits.length} routed unit(s):`);
                    for (let i = aRoutedUnits.length - 1; i >= 0; i--) {
                        const routedUnit = aRoutedUnits[i];
                        const rallyRoll = rollDie();
                        if (rallyRoll >= 4) { // Need 4+ to rally back
                            roundLog.push(`    ${routedUnit.type} (${routedUnit.enhancement || 'None'}): Rolled ${rallyRoll} - Rallied back to battle!`);
                            aUnits.push(routedUnit);
                            aRoutedUnits.splice(i, 1);
                        } else {
                            roundLog.push(`    ${routedUnit.type} (${routedUnit.enhancement || 'None'}): Rolled ${rallyRoll} - Still routed.`);
                        }
                    }
                }
                
                // Army B routed unit recovery
                if (bRoutedUnits.length > 0) {
                    roundLog.push(`  ${armyBName} attempts to rally ${bRoutedUnits.length} routed unit(s):`);
                    for (let i = bRoutedUnits.length - 1; i >= 0; i--) {
                        const routedUnit = bRoutedUnits[i];
                        const rallyRoll = rollDie();
                        if (rallyRoll >= 4) { // Need 4+ to rally back
                            roundLog.push(`    ${routedUnit.type} (${routedUnit.enhancement || 'None'}): Rolled ${rallyRoll} - Rallied back to battle!`);
                            bUnits.push(routedUnit);
                            bRoutedUnits.splice(i, 1);
                        } else {
                            roundLog.push(`    ${routedUnit.type} (${routedUnit.enhancement || 'None'}): Rolled ${rallyRoll} - Still routed.`);
                        }
                    }
                }
            }

            // ACTION REPORT (DESTRUCTION)
            roundLog.push('• Action Report: Destruction');
            const destroyedByA = destructionDice(aUnits, handlerA);
            const destroyedByB = destructionDice(bUnits, handlerB);            roundLog.push(`  ${armyAName} destroys ${destroyedByA} of ${armyBName}'s brigades.`);
            roundLog.push(`  ${armyBName} destroys ${destroyedByB} of ${armyAName}'s brigades.`);
            
            // Randomly remove units
            for (let i = 0; i < destroyedByA && bUnits.length > 0; i++) {
                const randomIndex = Math.floor(Math.random() * bUnits.length);
                bUnits.splice(randomIndex, 1);
            }            for (let i = 0; i < destroyedByB && aUnits.length > 0; i++) {
                const randomIndex = Math.floor(Math.random() * aUnits.length);
                aUnits.splice(randomIndex, 1);
            }
            roundLog.push(`  End of Round: ${armyAName} has ${aUnits.length} brigades active (${aRoutedUnits.length} routed), ${armyBName} has ${bUnits.length} brigades active (${bRoutedUnits.length} routed).`);
            updateBattleDisplay(roundLog.join('\n'), true);
            
            // Store round data for chart generation
            window.battleData.rounds.push({
                round: round,
                armyAUnits: aUnits.length,
                armyBUnits: bUnits.length,                skirmishResult: `${aLosses || 0} vs ${bLosses || 0}`,
                details: roundLog.join('\n')
            });
            
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
        await delay(3000);

        // ACTION REPORT PHASE (Post-Battle)
        const actionLog = ['\n--- Action Report Phase ---'];
        actionLog.push('All surviving brigades and generals roll for casualties and promotions.');
        
        // Brigade casualty rolls for Army A
        actionLog.push(`\n${armyAName} Brigade Casualties:`);
        const aInitialCount = aUnits.length;
        for (let i = aUnits.length - 1; i >= 0; i--) {
            const roll = rollDie();
            const isDestroyed = roll <= 2;
            const unit = aUnits[i];
            actionLog.push(`  ${unit.type} (${unit.enhancement || 'None'}): Rolled ${roll} - ${isDestroyed ? 'DESTROYED' : 'Survives'}`);
            
            if (isDestroyed) {
                aUnits.splice(i, 1);
            }
        }
        
        // Victor rerolls for Army A
        if (victor === 'A' && aInitialCount > aUnits.length) {
            actionLog.push(`\n${armyAName} is victorious and may reroll destroyed brigades:`);
            const destroyedCount = aInitialCount - aUnits.length;
            // Simulate rerolls (simplified - would need actual user interaction)
            let saved = 0;
            for (let i = 0; i < destroyedCount; i++) {
                const reroll = rollDie();
                if (reroll > 2) {
                    saved++;
                    actionLog.push(`  Reroll ${i + 1}: Rolled ${reroll} - Brigade SAVED!`);
                } else {
                    actionLog.push(`  Reroll ${i + 1}: Rolled ${reroll} - Still destroyed.`);
                }
            }
            // Add saved brigades back (simplified)
            for (let i = 0; i < saved; i++) {
                aUnits.push({ type: 'heavy', enhancement: 'None' }); // placeholder
            }
        }

        // Brigade casualty rolls for Army B
        actionLog.push(`\n${armyBName} Brigade Casualties:`);
        const bInitialCount = bUnits.length;
        for (let i = bUnits.length - 1; i >= 0; i--) {
            const roll = rollDie();
            const isDestroyed = roll <= 2;
            const unit = bUnits[i];
            actionLog.push(`  ${unit.type} (${unit.enhancement || 'None'}): Rolled ${roll} - ${isDestroyed ? 'DESTROYED' : 'Survives'}`);
            
            if (isDestroyed) {
                bUnits.splice(i, 1);
            }
        }

        // Victor rerolls for Army B
        if (victor === 'B' && bInitialCount > bUnits.length) {
            actionLog.push(`\n${armyBName} is victorious and may reroll destroyed brigades:`);
            const destroyedCount = bInitialCount - bUnits.length;
            let saved = 0;
            for (let i = 0; i < destroyedCount; i++) {
                const reroll = rollDie();
                if (reroll > 2) {
                    saved++;
                    actionLog.push(`  Reroll ${i + 1}: Rolled ${reroll} - Brigade SAVED!`);
                } else {
                    actionLog.push(`  Reroll ${i + 1}: Rolled ${reroll} - Still destroyed.`);
                }
            }
            for (let i = 0; i < saved; i++) {
                bUnits.push({ type: 'heavy', enhancement: 'None' });
            }
        }

        // General casualty/promotion rolls
        actionLog.push(`\n--- General Rolls ---`);
        
        // General A roll
        const genARoll = rollDie();
        if (genARoll === 1) {
            actionLog.push(`${generalAName}: Rolled ${genARoll} - CAPTURED!`);
        } else if (genARoll >= 5) {
            actionLog.push(`${generalAName}: Rolled ${genARoll} - PROMOTED! (Level ${genA.level} → ${genA.level + 1})`);
            genA.level++;
        } else {
            actionLog.push(`${generalAName}: Rolled ${genARoll} - No effect.`);
        }

        // General B roll
        const genBRoll = rollDie();
        if (genBRoll === 1) {
            actionLog.push(`${generalBName}: Rolled ${genBRoll} - CAPTURED!`);
        } else if (genBRoll >= 5) {
            actionLog.push(`${generalBName}: Rolled ${genBRoll} - PROMOTED! (Level ${genB.level} → ${genB.level + 1})`);
            genB.level++;
        } else {
            actionLog.push(`${generalBName}: Rolled ${genBRoll} - No effect.`);
        }

        // Victor general reroll
        if (victor === 'A' && (genARoll === 1 || genARoll < 5)) {
            const reroll = rollDie();
            actionLog.push(`${generalAName} (Victor) rerolls: ${reroll}`);
            if (reroll >= 5) {
                actionLog.push(`  PROMOTED on reroll! (Level ${genA.level} → ${genA.level + 1})`);
                genA.level++;
            } else if (reroll === 1) {
                actionLog.push(`  Still captured on reroll.`);
            } else {
                actionLog.push(`  No effect on reroll.`);
            }
        }

        if (victor === 'B' && (genBRoll === 1 || genBRoll < 5)) {
            const reroll = rollDie();
            actionLog.push(`${generalBName} (Victor) rerolls: ${reroll}`);
            if (reroll >= 5) {
                actionLog.push(`  PROMOTED on reroll! (Level ${genB.level} → ${genB.level + 1})`);
                genB.level++;
            } else if (reroll === 1) {
                actionLog.push(`  Still captured on reroll.`);
            } else {
                actionLog.push(`  No effect on reroll.`);
            }
        }

        // Final summary
        actionLog.push(`\n--- Final Action Report Summary ---`);
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
    
    // Unit composition chart
    if (armies.A && armies.B) {
        drawUnitCompositionChart(ctx, armies.A, armies.B, 50, 620, width - 100, 180);
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
    
    // Add data points
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
 * Draw unit composition comparison chart
 */
function drawUnitCompositionChart(ctx, armyA, armyB, x, y, width, height) {
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
    ctx.fillText('Initial Army Composition', x + width / 2, y - 10);
    
    // Get unit counts for both armies
    const unitTypes = ['cav', 'heavy', 'light', 'ranged', 'support'];
    const unitNames = ['Cavalry', 'Heavy Inf.', 'Light Inf.', 'Ranged', 'Support'];
    const colors = ['#8b5cf6', '#ef4444', '#22c55e', '#3b82f6', '#f59e0b'];
    
    const armyAUnits = {};
    const armyBUnits = {};
    
    // Count units in Army A
    if (armyA.units) {
        armyA.units.forEach(unit => {
            armyAUnits[unit.type] = (armyAUnits[unit.type] || 0) + 1;
        });
    }
    
    // Count units in Army B  
    if (armyB.units) {
        armyB.units.forEach(unit => {
            armyBUnits[unit.type] = (armyBUnits[unit.type] || 0) + 1;
        });
    }
    
    // Calculate max for scaling
    const maxCount = Math.max(
        ...unitTypes.map(type => Math.max(armyAUnits[type] || 0, armyBUnits[type] || 0))
    );
    
    if (maxCount === 0) {
        ctx.fillStyle = '#6b7280';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('No unit data available', x + width / 2, y + height / 2);
        ctx.restore();
        return;
    }
    
    // Chart dimensions
    const margin = 40;
    const chartX = x + margin;
    const chartY = y + margin;
    const chartWidth = width - margin * 2;
    const chartHeight = height - margin * 2;
    
    // Bar width and spacing
    const barGroupWidth = chartWidth / unitTypes.length;
    const barWidth = barGroupWidth * 0.35;
    const barSpacing = barGroupWidth * 0.1;
    
    // Draw bars
    unitTypes.forEach((type, index) => {
        const baseX = chartX + index * barGroupWidth;
        
        // Army A bar
        const countA = armyAUnits[type] || 0;
        const heightA = (countA / maxCount) * chartHeight;
        const yA = chartY + chartHeight - heightA;
        
        ctx.fillStyle = colors[index];
        ctx.globalAlpha = 0.8;
        ctx.fillRect(baseX, yA, barWidth, heightA);
        
        // Army B bar
        const countB = armyBUnits[type] || 0;
        const heightB = (countB / maxCount) * chartHeight;
        const yB = chartY + chartHeight - heightB;
        
        ctx.globalAlpha = 0.5;
        ctx.fillRect(baseX + barWidth + barSpacing, yB, barWidth, heightB);
        
        ctx.globalAlpha = 1;
        
        // Labels
        ctx.fillStyle = '#374151';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(unitNames[index], baseX + barGroupWidth / 2, chartY + chartHeight + 20);
        
        // Values on bars
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px Arial';
        if (heightA > 15) {
            ctx.fillText(countA.toString(), baseX + barWidth / 2, yA + heightA / 2 + 3);
        }
        if (heightB > 15) {
            ctx.fillText(countB.toString(), baseX + barWidth + barSpacing + barWidth / 2, yB + heightB / 2 + 3);
        }
    });
    
    // Legend
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    
    // Army A legend
    ctx.fillStyle = '#374151';
    ctx.globalAlpha = 0.8;
    ctx.fillRect(chartX + chartWidth - 120, chartY + 10, 15, 15);
    ctx.globalAlpha = 1;
    ctx.fillText('Army A', chartX + chartWidth - 100, chartY + 22);
    
    // Army B legend
    ctx.globalAlpha = 0.5;
    ctx.fillRect(chartX + chartWidth - 120, chartY + 30, 15, 15);
    ctx.globalAlpha = 1;
    ctx.fillText('Army B', chartX + chartWidth - 100, chartY + 42);
    
    ctx.restore();
}

// Make function available globally
window.generateBattleReport = generateBattleReport;

// Debug: Confirm all functions are loaded
console.log('battle.js fully loaded. Available functions:', {
    simulateBattle: typeof window.simulateBattle,
    generateBattleReport: typeof window.generateBattleReport
});
