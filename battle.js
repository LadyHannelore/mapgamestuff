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
      // General image selection
    const generalImageSelectA = document.getElementById('generalImageSelectA');
    const generalImageA = document.getElementById('generalImageA');
    const customImageA = document.getElementById('customImageA');
    const customUrlA = document.getElementById('customUrlA');
    
    if (generalImageSelectA && generalImageA) {
        generalImageSelectA.addEventListener('change', function() {
            if (this.value === 'custom') {
                customImageA.classList.remove('hidden');
                customUrlA.classList.remove('hidden');
            } else {
                customImageA.classList.add('hidden');
                customUrlA.classList.add('hidden');
                generalImageA.src = this.value;
            }
        });
        
        // Handle file upload for General A
        customImageA.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    generalImageA.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
        
        // Handle URL input for General A
        customUrlA.addEventListener('input', function() {
            if (this.value.trim()) {
                generalImageA.src = this.value.trim();
            }
        });
    }
    
    const generalImageSelectB = document.getElementById('generalImageSelectB');
    const generalImageB = document.getElementById('generalImageB');
    const customImageB = document.getElementById('customImageB');
    const customUrlB = document.getElementById('customUrlB');
    
    if (generalImageSelectB && generalImageB) {
        generalImageSelectB.addEventListener('change', function() {
            if (this.value === 'custom') {
                customImageB.classList.remove('hidden');
                customUrlB.classList.remove('hidden');
            } else {
                customImageB.classList.add('hidden');
                customUrlB.classList.add('hidden');
                generalImageB.src = this.value;
            }
        });
        
        // Handle file upload for General B
        customImageB.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    generalImageB.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
        
        // Handle URL input for General B
        customUrlB.addEventListener('input', function() {
            if (this.value.trim()) {
                generalImageB.src = this.value.trim();
            }
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

// Helper function to delay execution
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
    console.log('simulateBattle called with', { army1, army2, genA, genB, battleType, cityTier });
    try {
        // Clone armies
        let aUnits = [...army1];
        let bUnits = battleType === 'siege' ? generateDefenders(cityTier) : [...army2];
        const log = [];

        // Determine handlers
        const handlerA = TRAIT_HANDLERS[genA.trait] || {};
        const handlerB = TRAIT_HANDLERS[genB.trait] || {};

        // Names
        const armyAName = customNames.armyAName || generateArmyName();
        const armyBName = customNames.armyBName || generateArmyName();
        const generalAName = customNames.generalAName || generateGeneralName();
        const generalBName = customNames.generalBName || generateGeneralName();
        const battleLocation = customNames.battleLocation || generateBattleLocation();

        log.push(`⚔️ Battle at ${battleLocation}: ${armyAName} vs ${armyBName}`);

        // SKIRMISH PHASE
        if (handlerA.skipSkirmish || handlerB.skipSkirmish) {
          log.push('• Skirmish phase skipped by cautious general.');
        } else {
          log.push('• Skirmish phase begins');
          const aSkirm = aUnits.reduce((sum, u) => sum + getUnitStats(u).skirmish, 0);
          const bSkirm = bUnits.reduce((sum, u) => sum + getUnitStats(u).skirmish, 0);
          // Bold: bonus to one skirmisher
          if (handlerA.applySkirmishBonus) handlerA.applySkirmishBonus(aUnits, genA.level);
          if (handlerB.applySkirmishBonus) handlerB.applySkirmishBonus(bUnits, genB.level);
          log.push(`  ${armyAName} skirmish total: ${aSkirm}`);
          log.push(`  ${armyBName} skirmish total: ${bSkirm}`);
          // Determine routs
          if (aSkirm > bSkirm) {
            bUnits = bUnits.filter((_, i) => i % 2 === 0);
            log.push(`  ${armyBName} loses half units in rout.`);
          } else if (bSkirm > aSkirm) {
            aUnits = aUnits.filter((_, i) => i % 2 === 0);
            log.push(`  ${armyAName} loses half units in rout.`);
          } else {
            log.push('  Skirmish tied, no rout.');
          }
        }

        // PITCH PHASE
        log.push('• Pitch phase begins');
        const pitchRollA = aUnits.reduce((sum, u) => sum + getUnitStats(u).pitch, 0) + genA.level;
        const pitchRollB = bUnits.reduce((sum, u) => sum + getUnitStats(u).pitch, 0) + genB.level;
        // Brilliant: extra pitch
        const finalPitchA = handlerA.adjustPitchTotal ? handlerA.adjustPitchTotal(pitchRollA, genA.level) : pitchRollA;
        const finalPitchB = handlerB.adjustPitchTotal ? handlerB.adjustPitchTotal(pitchRollB, genB.level) : pitchRollB;
        log.push(`  ${armyAName} pitch: ${finalPitchA}`);
        log.push(`  ${armyBName} pitch: ${finalPitchB}`);

        // RALLY PHASE
        log.push('• Rally phase begins');
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
        log.push(`  ${armyAName} rally: ${finalRallyA}`);
        log.push(`  ${armyBName} rally: ${finalRallyB}`);

        // ACTION REPORT
        log.push('• Action report begins');
        const destructionDice = (units, handler) => {
          const base = units.length;
          // Merciless: destroys on 1-3 instead of 1-2
          const threshold = handler.destructionOn1to3 ? 3 : 2;
          return Math.min(base, threshold);
        };
        log.push(`  ${armyAName} destroy ${destructionDice(aUnits, handlerA)} brigades`);
        log.push(`  ${armyBName} destroy ${destructionDice(bUnits, handlerB)} brigades`);

        // PROMOTION PHASE
        let promoThreshold = 6;
        if (handlerA.adjustPromotionThreshold) promoThreshold = handlerA.adjustPromotionThreshold(promoThreshold);
        if (handlerB.adjustPromotionThreshold) promoThreshold = handlerB.adjustPromotionThreshold(promoThreshold);
        log.push(`• Promotion threshold: ${promoThreshold}`);

        // FINAL SCORING
        const survivorsA = aUnits.length;
        const survivorsB = bUnits.length;
        log.push(`🏆 Survivors: ${survivorsA} vs ${survivorsB}`);
        if (survivorsA > survivorsB) log.push(`${armyAName} WINS!`);
        else if (survivorsB > survivorsA) log.push(`${armyBName} WINS!`);
        else log.push('Draw.');

        updateBattleDisplay('\n' + log.join('\n'), true);
        return 'Battle complete.';
    } catch (e) {
        return 'Error: ' + e.message;
    }
};

// =============================================================================
// MODULE INITIALIZATION
// =============================================================================

console.log('Battle.js loaded successfully. simulateBattle function defined.');

// =============================================================================
// SAMPLE ARMY CONFIGURATIONS
// =============================================================================
const SAMPLE_ARMIES = [
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
// Helper function to delay execution
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
