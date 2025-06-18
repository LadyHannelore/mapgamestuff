// battle.js

// Unit stats definitions (matches tutorial exactly)
const unitStats = {
    cav: { skirmish: 1, pitch: 1, defense: 0, rally: 0, move: 5 },
    heavy: { skirmish: 0, pitch: 1, defense: 2, rally: 1, move: 3 },
    light: { skirmish: 2, pitch: 0, defense: 0, rally: 1, move: 4 },
    ranged: { skirmish: 0, pitch: 1, defense: 2, rally: 0, move: 4 },
    support: { skirmish: 0, pitch: 0, defense: 2, rally: 1, move: 4 }
};

const enhancements = {
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

// General trait effects (matches tutorial)
const generalTraits = {
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
    
    if (generalImageSelectA && generalImageA) {
        generalImageSelectA.addEventListener('change', function() {
            generalImageA.src = this.value;
        });
    }
    
    const generalImageSelectB = document.getElementById('generalImageSelectB');
    const generalImageB = document.getElementById('generalImageB');
    
    if (generalImageSelectB && generalImageB) {
        generalImageSelectB.addEventListener('change', function() {
            generalImageB.src = this.value;
        });
    }
});

// Helpers
function addUnits(army, listEl, type, count, enhancement) {
    for (let i = 0; i < count; i++) {
        army.push({ type, enhancement });
    }
    renderArmy(listEl, army);
}

function renderArmy(listEl, army) {
    listEl.innerHTML = '';
    const imageMap = {
        light: 'images/light.jpg',
        heavy: 'images/heavy.jpg',
        ranged: 'images/ranged.jpg',
        cav: 'images/cav.jpg',
        support: 'images/support.png'
    };
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
function getUnitStats(unit, isGarrison = false) {
    const baseStats = unitStats[unit.type];
    const enhancement = enhancements[unit.enhancement] || {};
    
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

// Apply general trait bonuses to army
function applyGeneralTraits(units, general) {
    if (!general || !general.trait || general.trait === 'None') return units;
    
    const trait = generalTraits[general.trait];
    if (!trait) return units;
    
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
window.simulateBattle = async function(army1, army2, genA, genB, battleType, cityTier, customNames = {}) {
    try {
        let aUnits = [...army1];
        let bUnits = battleType === 'siege' ? generateDefenders(cityTier) : [...army2];
        const log = [];

        // Use custom names if provided, otherwise generate random ones
        const armyAName = customNames.armyAName || generateArmyName();
        const armyBName = customNames.armyBName || generateArmyName();
        const generalAName = customNames.generalAName || generateGeneralName();
        const generalBName = customNames.generalBName || generateGeneralName();
        const battleLocationName = customNames.battleLocation || generateBattleLocation();

        // Add nicknames to units
        aUnits = aUnits.map(unit => ({
            ...unit,
            nickname: generateUnitNickname(unit.type)
        }));
        
        if (battleType !== 'siege') {
            bUnits = bUnits.map(unit => ({
                ...unit,
                nickname: generateUnitNickname(unit.type)
            }));
        } else {
            bUnits = bUnits.map(unit => ({
                ...unit,
                nickname: "City Guard"
            }));
        }

        // Apply general trait bonuses
        aUnits = applyGeneralTraits(aUnits, genA);
        bUnits = applyGeneralTraits(bUnits, genB);

        log.push(`=== BATTLE OF ${battleLocationName.toUpperCase()} ===`);
        log.push(`${armyAName}: ${aUnits.length} brigades, General ${generalAName} Lv${genA.level} (${genA.trait})`);
        if (battleType === 'siege') {
            log.push(`vs. Tier ${cityTier} City Garrison: ${bUnits.length} brigades (garrison has +2 defense, +2 rally)`);
        } else {
            log.push(`${armyBName}: ${bUnits.length} brigades, General ${generalBName} Lv${genB.level} (${genB.trait})`);
        }        log.push('');

        // Display initial setup - check if this is a new battle to add to existing results
        const battleResultDiv = document.getElementById('battleResult');
        const isNewBattle = battleResultDiv && battleResultDiv.innerHTML.trim() && !battleResultDiv.innerHTML.includes('Set up your armies');
        updateBattleDisplay(log.join('\n'), false, isNewBattle);
        await delay(2000); // 2 second delay before starting

        // SKIRMISH STAGE
        const skirmishLog = [];
        skirmishLog.push('--- SKIRMISH STAGE ---');
        
        // Select 2 best skirmishers per side (highest skirmish stat)
        const selectSkirmishers = (units) => {
            return units.slice()
                .sort((a, b) => {
                    const aStats = getUnitStats(a, a.garrison);
                    const bStats = getUnitStats(b, b.garrison);
                    return bStats.skirmish - aStats.skirmish;
                })
                .slice(0, Math.min(2, units.length));
        };

        const aSkirmishers = selectSkirmishers(aUnits);
        const bSkirmishers = selectSkirmishers(bUnits);
        const routedUnits = [];

        // A's skirmishers attack B's units
        aSkirmishers.forEach((skirmisher, i) => {
            if (bUnits.length === 0) return;
            
            const targetIdx = Math.floor(Math.random() * bUnits.length);
            const target = bUnits[targetIdx];
              const skirmStats = getUnitStats(skirmisher, skirmisher.garrison);
            const targetStats = getUnitStats(target, target.garrison);
            
            const skirmRoll = rollDie() + skirmStats.skirmish;
            const defRoll = rollDie() + targetStats.defense;
            
            skirmishLog.push(`${armyAName} ${skirmisher.nickname} (${skirmisher.type}): ${skirmRoll} vs ${battleType === 'siege' ? 'Garrison' : armyBName} ${target.nickname} (${target.type}): ${defRoll}`);
            
            if (skirmRoll > defRoll) {
                skirmishLog.push(`  → ${battleType === 'siege' ? 'Garrison' : armyBName} ${target.nickname} routed! (misses initial pitch)`);
                routedUnits.push(target);
                bUnits.splice(targetIdx, 1);
            }
        });

        // B's skirmishers attack A's units  
        bSkirmishers.forEach((skirmisher, i) => {
            if (aUnits.length === 0) return;
            
            const targetIdx = Math.floor(Math.random() * aUnits.length);
            const target = aUnits[targetIdx];
            
            const skirmStats = getUnitStats(skirmisher, skirmisher.garrison);
            const targetStats = getUnitStats(target, target.garrison);
            
            const skirmRoll = rollDie() + skirmStats.skirmish;
            const defRoll = rollDie() + targetStats.defense;
            
            skirmishLog.push(`${battleType === 'siege' ? 'Garrison' : armyBName} ${skirmisher.nickname} (${skirmisher.type}): ${skirmRoll} vs ${armyAName} ${target.nickname} (${target.type}): ${defRoll}`);
            
            if (skirmRoll > defRoll) {
                skirmishLog.push(`  → ${armyAName} ${target.nickname} routed! (misses initial pitch)`);
                routedUnits.push(target);
                aUnits.splice(targetIdx, 1);
            }
        });

        skirmishLog.push('');
        
        // Display skirmish results
        updateBattleDisplay('\n' + skirmishLog.join('\n'), true);
        await delay(3000); // 3 second delay after skirmish        // PITCH STAGE (up to 3 rounds)
        const pitchLog = [];
        pitchLog.push('--- PITCH STAGE ---');
        updateBattleDisplay('\n' + pitchLog.join('\n'), true);
        await delay(2000); // 2 second delay before pitch starts
        
        let pitchTally = 0;
        
        for (let round = 1; round <= 3; round++) {
            const roundLog = [];
            roundLog.push(`Round ${round}:`);
            
            let aPitchTotal = 0;
            let bPitchTotal = 0;
            
            // Army A pitch
            aUnits.forEach(unit => {
                const stats = getUnitStats(unit, unit.garrison);
                const roll = rollDie();
                const pitch = roll + stats.pitch + (unit.traitPitchBonus || 0);
                aPitchTotal += pitch;
            });
            
            // Add general level bonus (doubled for Brilliant trait)
            const aGeneralBonus = genA.trait === 'Brilliant' ? genA.level * 2 : genA.level;
            aPitchTotal += aGeneralBonus;
            
            // Army B pitch
            bUnits.forEach(unit => {
                const stats = getUnitStats(unit, unit.garrison);
                const roll = rollDie();
                const pitch = roll + stats.pitch + (unit.traitPitchBonus || 0);
                bPitchTotal += pitch;
            });
            
            // Add general level bonus (doubled for Brilliant trait)
            const bGeneralBonus = genB.trait === 'Brilliant' ? genB.level * 2 : genB.level;
            bPitchTotal += bGeneralBonus;
            
            const roundResult = aPitchTotal - bPitchTotal;
            pitchTally += roundResult;
              roundLog.push(`  ${armyAName}: ${aPitchTotal} (${aUnits.length} brigades + ${aGeneralBonus} ${generalAName})`);
            roundLog.push(`  ${battleType === 'siege' ? 'Garrison' : armyBName}: ${bPitchTotal} (${bUnits.length} brigades + ${bGeneralBonus} ${battleType === 'siege' ? 'Commander' : generalBName})`);
            roundLog.push(`  Round result: ${roundResult > 0 ? '+' : ''}${roundResult}, Tally: ${pitchTally}`);
            
            // Display this round's results
            updateBattleDisplay('\n' + roundLog.join('\n'), true);
            
            // Check for decisive victory
            if (pitchTally >= 20) {
                const victoryLog = [`  ${armyAName} achieves decisive victory! (Tally ≥ 20)`];
                updateBattleDisplay('\n' + victoryLog.join('\n'), true);
                break;
            } else if (pitchTally <= -20) {
                const victoryLog = [`  ${battleType === 'siege' ? 'Garrison' : armyBName} achieves decisive victory! (Tally ≤ -20)`];
                updateBattleDisplay('\n' + victoryLog.join('\n'), true);
                break;
            }
            
            // 5 second delay between rounds (except after the last round)
            if (round < 3 && pitchTally > -20 && pitchTally < 20) {
                await delay(5000);
            }
        }
        
        await delay(3000); // 3 second delay after pitch stage
          // RALLY STAGE (if no decisive victory)
        if (pitchTally > -20 && pitchTally < 20) {
            const rallyLog = [];
            rallyLog.push('--- RALLY STAGE ---');
            updateBattleDisplay('\n' + rallyLog.join('\n'), true);
            await delay(2000); // 2 second delay before rally starts
            
            // Add routed units back for rally check
            const allAUnits = [...aUnits, ...routedUnits.filter(u => army1.includes(u))];
            const allBUnits = [...bUnits, ...routedUnits.filter(u => !army1.includes(u))];
            
            // Army A rally checks
            const aSurvivors = [];            const aRallyLog = [];
            allAUnits.forEach(unit => {
                const stats = getUnitStats(unit, unit.garrison);
                const rallyRoll = rollDie() + stats.rally + (unit.traitRallyBonus || 0);
                if (rallyRoll >= 5) {
                    aSurvivors.push(unit);
                    aRallyLog.push(`${armyAName} ${unit.nickname}: Rally ${rallyRoll} - stays`);
                } else {
                    aRallyLog.push(`${armyAName} ${unit.nickname}: Rally ${rallyRoll} - routs`);
                }
            });
            
            // Army B rally checks
            const bSurvivors = [];
            const bRallyLog = [];
            allBUnits.forEach(unit => {
                const stats = getUnitStats(unit, unit.garrison);
                const rallyRoll = rollDie() + stats.rally + (unit.traitRallyBonus || 0);
                if (rallyRoll >= 5) {
                    bSurvivors.push(unit);
                    bRallyLog.push(`${battleType === 'siege' ? 'Garrison' : armyBName} ${unit.nickname}: Rally ${rallyRoll} - stays`);                } else {
                    bRallyLog.push(`${battleType === 'siege' ? 'Garrison' : armyBName} ${unit.nickname}: Rally ${rallyRoll} - routs`);
                }
            });
            
            const allRallyLog = [...aRallyLog, ...bRallyLog];
            allRallyLog.push(`After rally: ${armyAName} has ${aSurvivors.length} brigades, ${battleType === 'siege' ? 'Garrison' : armyBName} has ${bSurvivors.length} brigades`);
            
            updateBattleDisplay('\n' + allRallyLog.join('\n'), true);
            
            aUnits = aSurvivors;
            bUnits = bSurvivors;
            
            // If one side has no units left, battle ends
            if (aUnits.length === 0 || bUnits.length === 0) {
                const endLog = ['One side completely routed!'];
                updateBattleDisplay('\n' + endLog.join('\n'), true);
            }
            
            await delay(3000); // 3 second delay after rally
        }        // ACTION REPORT
        const actionLog = [];
        actionLog.push('--- ACTION REPORT ---');
        updateBattleDisplay('\n' + actionLog.join('\n'), true);
        await delay(2000); // 2 second delay before action report
        
        // Destruction rolls
        const aDestroyed = [];
        const bDestroyed = [];
        const destructionLog = [];
          aUnits.forEach(unit => {
            const destructionRoll = rollDie();
            if (destructionRoll <= 2) {
                aDestroyed.push(unit);
                destructionLog.push(`${armyAName} ${unit.nickname}: Destruction roll ${destructionRoll} - destroyed`);
            } else {
                destructionLog.push(`${armyAName} ${unit.nickname}: Destruction roll ${destructionRoll} - survives`);
            }
        });
        
        bUnits.forEach(unit => {
            const destructionRoll = rollDie();
            if (destructionRoll <= 2) {
                bDestroyed.push(unit);
                destructionLog.push(`${battleType === 'siege' ? 'Garrison' : armyBName} ${unit.nickname}: Destruction roll ${destructionRoll} - destroyed`);
            } else {
                destructionLog.push(`${battleType === 'siege' ? 'Garrison' : armyBName} ${unit.nickname}: Destruction roll ${destructionRoll} - survives`);
            }
        });
        
        updateBattleDisplay('\n' + destructionLog.join('\n'), true);
        await delay(3000); // 3 second delay after destruction rolls
        
        // General promotion/capture rolls
        const generalLog = [];
        const aGenRoll = rollDie();
        const bGenRoll = rollDie();
          if (aGenRoll === 1) {
            generalLog.push(`General ${generalAName}: Promotion roll ${aGenRoll} - CAPTURED!`);
        } else if (aGenRoll >= 5) {
            generalLog.push(`General ${generalAName}: Promotion roll ${aGenRoll} - PROMOTED!`);
        } else {
            generalLog.push(`General ${generalAName}: Promotion roll ${aGenRoll} - no change`);
        }
        
        if (bGenRoll === 1) {
            generalLog.push(`${battleType === 'siege' ? 'Garrison Commander' : `General ${generalBName}`}: Promotion roll ${bGenRoll} - CAPTURED!`);
        } else if (bGenRoll >= 5) {
            generalLog.push(`${battleType === 'siege' ? 'Garrison Commander' : `General ${generalBName}`}: Promotion roll ${bGenRoll} - PROMOTED!`);
        } else {
            generalLog.push(`${battleType === 'siege' ? 'Garrison Commander' : `General ${generalBName}`}: Promotion roll ${bGenRoll} - no change`);
        }
        
        updateBattleDisplay('\n' + generalLog.join('\n'), true);
        await delay(3000); // 3 second delay before final results        // DETERMINE WINNER
        const aFinalCount = aUnits.length - aDestroyed.length;
        const bFinalCount = bUnits.length - bDestroyed.length;
          const finalLog = [];
        finalLog.push('--- BATTLE RESULT ---');
        finalLog.push(`${armyAName}: ${aFinalCount} brigades remaining (${aDestroyed.length} destroyed)`);
        finalLog.push(`${battleType === 'siege' ? 'Garrison' : armyBName}: ${bFinalCount} brigades remaining (${bDestroyed.length} destroyed)`);
        
        if (pitchTally >= 20 || (aFinalCount > 0 && bFinalCount === 0)) {
            finalLog.push(`🏆 ${armyAName.toUpperCase()} WINS!`);
        } else if (pitchTally <= -20 || (bFinalCount > 0 && aFinalCount === 0)) {
            finalLog.push(`🏆 ${(battleType === 'siege' ? 'GARRISON' : armyBName.toUpperCase())} WINS!`);
        } else if (aFinalCount === bFinalCount) {
            finalLog.push('⚖️ DRAW - Both armies withdraw');
        } else if (aFinalCount > bFinalCount) {
            finalLog.push(`🏆 ${armyAName.toUpperCase()} WINS! (more survivors)`);
        } else {
            finalLog.push(`🏆 ${(battleType === 'siege' ? 'GARRISON' : armyBName.toUpperCase())} WINS! (more survivors)`);
        }

        updateBattleDisplay('\n' + finalLog.join('\n'), true);
        
        return "Battle simulation complete! Check the display above for full results.";
        
    } catch (e) {
        return 'Error during battle simulation: ' + e.message;
    }
}
