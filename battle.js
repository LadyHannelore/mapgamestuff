/**
 * Battle Simulator - Professional Edition
 * Implements a comprehensive warfare simulation system based on tutorial mechanics
 * @author Mock Battle Simulator
 * @version 2.0
 */

'use strict';

console.log('Battle.js loading...');
// Global variables to ensure functions are available immediately
window.battleJsLoaded = false;

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
    'Lancers': { skirmish: 2 }, // Changed: Overrun is now a core skirmish mechanic
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
    // Only initialize if elements exist to avoid errors
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

    // Event listeners are handled in the HTML file to avoid duplication
    console.log('Battle.js DOM elements initialized');
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
        army.push({ 
            type, 
            enhancement,
            originalIndex: army.length // Assign originalIndex for animations
        });
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
        tr.className = 'border-b transition-all duration-300 unit-row';
        tr.id = `unit-${armyId}-${index}`;
        
        // Apply routed styling if unit is routed
        if (unit.routed) {
            tr.classList.add('routed');
            tr.style.opacity = '0.6';
            tr.style.backgroundColor = '#fef3c7';
            tr.style.transform = 'translateX(-10px)';
        }
        
        // Apply destroyed styling if unit is destroyed
        if (unit.destroyed) {
            tr.classList.add('destroyed');
            tr.style.opacity = '0.3';
            tr.style.backgroundColor = '#fee2e2';
            tr.style.textDecoration = 'line-through';
        }

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

// Make addUnits available globally
window.addUnits = addUnits;

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

// =============================================================================
// BATTLE SIMULATION LOGIC
// =============================================================================

/**
 * Main battle simulation class
 */
class BattleSimulator {
    constructor() {
        this.armyA = [];
        this.armyB = [];
        this.generalA = null;
        this.generalB = null;
        this.rounds = [];
        this.currentRound = 0;
        this.unitsToDestroyA = 0;
        this.unitsToDestroyB = 0;
    }

    /**
     * Initialize the battle simulator with armies and generals
     * @param {Array} armyA - Array of units for Army A
     * @param {Array} armyB - Array of units for Army B
     * @param {Object} generalA - General object for Army A
     * @param {Object} generalB - General object for Army B
     */
    init(armyA, armyB, generalA, generalB) {
        this.armyA = armyA;
        this.armyB = armyB;
        this.generalA = generalA;
        this.generalB = generalB;
    }

    /**
     * Simulate the battle
     */
    async simulate() {
        this.currentRound = 0;
        this.rounds = [];

        // Reset armies in case of re-simulation and ensure original indices are preserved
        this.armyA = JSON.parse(JSON.stringify(window.armyA)).map((unit, index) => ({
            ...unit,
            originalIndex: unit.originalIndex !== undefined ? unit.originalIndex : index
        }));
        this.armyB = JSON.parse(JSON.stringify(window.armyB)).map((unit, index) => ({
            ...unit,
            originalIndex: unit.originalIndex !== undefined ? unit.originalIndex : index
        }));

        // Initialize and render the battlefield
        initializeBattlefield();
        renderBattlefield(this.armyA, this.armyB);
        await delay(1000); // Give time to see initial formation

        // General loop for each round of the battle
        while (this.armyA.length > 0 && this.armyB.length > 0) {
            this.currentRound++;
            
            // Animate round start
            animateBattleRound(this.currentRound);
            updateBattleDisplay(`Round ${this.currentRound}`, true);
            await delay(600); // Wait for round animation

            // Log the round start
            this.rounds.push({
                round: this.currentRound,
                armyA: JSON.parse(JSON.stringify(this.armyA)),
                armyB: JSON.parse(JSON.stringify(this.armyB))
            });

            // Main phase: units attack
            await this.mainPhase();

            // Destruction phase: handle unit losses
            await this.destructionPhase();

            // Rally phase: units rally (to be implemented)
            await this.rallyPhase();

            // Update battlefield after each round
            renderBattlefield(this.armyA, this.armyB);

            // Wait for a moment before next round
            await delay(1500);
        }

        // Battle ended, determine final result
        this.finalResult = this.armyA.length > 0 ? 'A' : 'B';
        const winnerName = `Army ${this.finalResult}`;
        
        // Animate victory first, then display text
        animateVictory(winnerName);
        updateBattleDisplay(`Battle Over! Winner: ${winnerName}`, true);
        this.logBattle();
        
        // Store final result in battle data and return it
        window.battleData.finalResult = {
            winner: `Army ${this.finalResult}`,
            survivors: {
                armyA: this.armyA,
                armyB: this.armyB
            },
            rounds: this.rounds
        };
        
        return window.battleData.finalResult;
    }

    async mainPhase() {
        // Animate formations advancing for battle
        animateBattlefieldFormation('A', 'advance');
        animateBattlefieldFormation('B', 'advance');
        updateBattleDisplay('⚔️ Armies advance into combat!', true);
        await delay(800);

        // Calculate attack and defense totals
        const attackA = this.armyA.reduce((sum, unit) => sum + getUnitStats(unit).skirmish, 0);
        const defenseA = this.armyB.reduce((sum, unit) => sum + getUnitStats(unit).defense, 0);
        const attackB = this.armyB.reduce((sum, unit) => sum + getUnitStats(unit).skirmish, 0);
        const defenseB = this.armyA.reduce((sum, unit) => sum + getUnitStats(unit).defense, 0);

        // Display attack/defense values
        updateBattleDisplay(`Army A - Attack: ${attackA}, Defense: ${defenseA}`, false);
        updateBattleDisplay(`Army B - Attack: ${attackB}, Defense: ${defenseB}`, false);

        // Animate attacking units on battlefield
        this.armyA.forEach((unit, index) => {
            const stats = getUnitStats(unit);
            if (stats.skirmish > 0) {
                animateBattlefieldUnit(`battlefield-unit-A-${index}`, 'attack');
            }
        });
        
        this.armyB.forEach((unit, index) => {
            const stats = getUnitStats(unit);
            if (stats.skirmish > 0) {
                animateBattlefieldUnit(`battlefield-unit-B-${index}`, 'attack');
            }
        });

        await delay(600);

        // Calculate damage and apply to enemy armies
        const damageToB = Math.max(0, attackA - defenseB);
        const damageToA = Math.max(0, attackB - defenseA);
        
        if (damageToB > 0) {
            updateBattleDisplay(`💥 Army A deals ${damageToB} damage to Army B!`, true);
        }
        if (damageToA > 0) {
            updateBattleDisplay(`💥 Army B deals ${damageToA} damage to Army A!`, true);
        }
        
        this.applyDamage(this.armyB, damageToB, 'B');
        this.applyDamage(this.armyA, damageToA, 'A');

        await delay(500);
    }

    async destructionPhase() {
        if (this.unitsToDestroyA > 0) {
            await this.handleDestruction('A', this.unitsToDestroyA);
            this.unitsToDestroyA = 0; // Reset after handling
        }
        if (this.unitsToDestroyB > 0) {
            await this.handleDestruction('B', this.unitsToDestroyB);
            this.unitsToDestroyB = 0; // Reset after handling
        }
    }

    async handleDestruction(armyId, unitsToDestroy) {
        const army = armyId === 'A' ? this.armyA : this.armyB;
        const general = armyId === 'A' ? this.generalA : this.generalB;

        updateBattleDisplay(`Army ${armyId} must choose **${unitsToDestroy}** unit(s) to destroy.`, true);
        await delay(1000);

        const choices = army.map((unit, index) => ({
            text: `${unit.type} (${unit.enhancement || 'None'})`,
            value: index
        }));

        const unitsToRemove = await showModal(
            `General ${general.name || armyId}, select ${unitsToDestroy} unit(s) to be destroyed.`,
            choices,
            unitsToDestroy
        );

        // Remove units in reverse order to maintain correct indices
        const sortedIndices = unitsToRemove.map(idx => parseInt(idx)).sort((a, b) => b - a);
        
        for (const unitIndex of sortedIndices) {
            const unit = army[unitIndex];
            if (unit) {
                updateBattleDisplay(`Army ${armyId} sacrifices their ${unit.type}.`, true);
                const unitId = `unit-${armyId}-${unitIndex}`;
                
                // Animate destruction in both table and battlefield
                await new Promise(resolve => animateDestruction(unitId, resolve));
                
                // Animate battlefield unit destruction
                await new Promise(resolve => {
                    animateBattlefieldUnit(`battlefield-unit-${armyId}-${unitIndex}`, 'destroy', resolve);
                });
                
                // Update battlefield unit state
                updateBattlefieldUnitState(armyId, unitIndex, 'destroyed');
                
                army.splice(unitIndex, 1);
            }
        }
    }

    async rallyPhase() {
        updateBattleDisplay('Rally Phase', true);
        await this.handleRally('A');
        await this.handleRally('B');
    }

    async handleRally(armyId) {
        const army = armyId === 'A' ? this.armyA : this.armyB;
        const general = armyId === 'A' ? this.generalA : this.generalB;
        const routedUnits = army.filter(u => u.routed);

        if (routedUnits.length === 0) {
            return;
        }

        updateBattleDisplay(`Army ${armyId} attempts to rally ${routedUnits.length} routed unit(s).`, true);

        for (let i = 0; i < routedUnits.length; i++) {
            const unit = routedUnits[i];
            const unitIndex = army.indexOf(unit);
            const stats = getUnitStats(unit);
            const rallyValue = stats.rally + (general ? (GENERAL_TRAITS[general.trait]?.rally || 0) : 0);
            const roll = rollDie();
            const rallyCheck = roll + rallyValue;

            let message = `Army ${armyId}'s ${unit.type} (Rally: ${rallyValue}) rolled a ${roll}. Total: ${rallyCheck}.`;

            if (rallyCheck >= 4) {
                message += ` It returns to the fight!`;
                updateBattleDisplay(message, true);
                unit.routed = false;
                
                // Use the new rally animation for table
                const unitId = `unit-${armyId}-${unitIndex}`;
                animateRally(unitId);
                
                // Animate battlefield unit rallying
                animateBattlefieldUnit(`battlefield-unit-${armyId}-${unitIndex}`, 'rally');
                
                // Update battlefield unit state
                updateBattlefieldUnitState(armyId, unitIndex, 'normal');
                
                const element = document.querySelector(`#${unitId}`);
                if (element) {
                    element.classList.remove('routed');
                }
                await delay(500);
            } else {
                message += ` It fails to rally and is removed from the battle.`;
                updateBattleDisplay(message, true);
                // GSAP animation for destruction
                const unitId = `unit-${armyId}-${unitIndex}`;
                await new Promise(resolve => animateDestruction(unitId, resolve));
                // Remove this unit from the army
                army.splice(unitIndex, 1);
            }
        }
        // Re-render armies to reflect changes
        renderArmy(document.getElementById('armyAList'), window.armyA);
        renderArmy(document.getElementById('armyBList'), window.armyB);
    }

    /**
     * Apply damage to an army
     * @param {Array} army - The army to apply damage to
     * @param {number} damage - The amount of damage to apply
     * @param {string} armyId - The ID of the army ('A' or 'B')
     */
    applyDamage(army, damage, armyId) {
        if (damage <= 0) return;

        updateBattleDisplay(`Army ${armyId} takes ${damage} damage.`, true);

        // Sort units by defense, then by random order
        const sortedUnits = army.filter(u => !u.routed).map((unit, index) => ({
            ...unit,
            currentIndex: index // Keep track of current index in the army
        })).sort((a, b) => {
            const defenseDiff = getUnitStats(b).defense - getUnitStats(a).defense;
            if (defenseDiff !== 0) return defenseDiff;
            return Math.random() - 0.5;
        });

        const unitsToRout = [];
        // Apply damage, marking units for routing
        for (let i = 0; i < sortedUnits.length && damage > 0; i++) {
            const unit = sortedUnits[i];
            const unitStats = getUnitStats(unit);
            
            damage -= unitStats.defense;

            if (damage >= 0) {
                unitsToRout.push(unit.currentIndex);
                updateBattleDisplay(`Army ${armyId}'s ${unit.type} is routed!`, true);
                const unitId = `unit-${armyId}-${unit.currentIndex}`;
                
                // Use the new damage animation for table
                animateDamage(unitId);
                
                // Animate battlefield unit taking damage
                animateBattlefieldUnit(`battlefield-unit-${armyId}-${unit.currentIndex}`, 'damage');
                
                // Update battlefield unit state
                updateBattlefieldUnitState(armyId, unit.currentIndex, 'routed');
                
                const element = document.querySelector(`#${unitId}`);
                if (element) {
                    element.classList.add('routed');
                }
            } else {
                // Damage absorbed, no destruction
                break;
            }
        }

        unitsToRout.forEach(currentIndex => {
            if (army[currentIndex]) {
                army[currentIndex].routed = true;
            }
        });
    }

    /**
     * Mark a unit for destruction (to be handled in destruction phase)
     * @param {Object} unit - The unit to mark for destruction
     */
    markUnitForDestruction(unit) {
        const armyId = unit.armyId;
        const army = armyId === 'A' ? this.armyA : this.armyB;
        const index = army.indexOf(unit);
        if (index !== -1) {
            army.splice(index, 1);
        }
    }

    /**
     * Log the battle details to the console
     */
    logBattle() {
        console.log('Battle Log:', this.rounds);
    }
}

// =============================================================================
// INITIALIZATION AND EVENT HANDLERS
// =============================================================================

/**
 * Initialize the battle simulator with selected armies and generals
 */
function initBattle() {
    const selectedUnitsA = JSON.parse(localStorage.getItem('selectedUnitsA')) || [];
    const selectedUnitsB = JSON.parse(localStorage.getItem('selectedUnitsB')) || [];
    const generalA = JSON.parse(localStorage.getItem('selectedGeneralA'));
    const generalB = JSON.parse(localStorage.getItem('selectedGeneralB'));

    // Validate selections
    if (selectedUnitsA.length === 0 || selectedUnitsB.length === 0) {
        alert('Please select units for both armies.');
        return;
    }

    // Create army objects with enhancements
    const armyA = selectedUnitsA.map((unit, index) => ({
        type: unit.type,
        enhancement: unit.enhancement,
        originalIndex: index // Track original index for removal
    }));
    const armyB = selectedUnitsB.map((unit, index) => ({
        type: unit.type,
        enhancement: unit.enhancement,
        originalIndex: index // Track original index for removal
    }));

    // Initialize and simulate battle
    const battleSimulator = new BattleSimulator();
    battleSimulator.init(armyA, armyB, generalA, generalB);
    battleSimulator.simulate();
}

// Resolve duplicate declarations of UNIT_IMAGE_MAP and startBattleBtn

// Remove duplicate UNIT_IMAGE_MAP declaration
if (typeof window.UNIT_IMAGE_MAP === 'undefined') {
    window.UNIT_IMAGE_MAP = {
        light: 'images/light.jpg',
        heavy: 'images/heavy.jpg',
        ranged: 'images/ranged.jpg',
        cav: 'images/cav.jpg',
        support: 'images/support.png'
    };
}

// Ensure startBattleBtn is only declared once
if (typeof window.startBattleBtn === 'undefined') {
    window.startBattleBtn = document.getElementById('startBattleBtn');
    if (window.startBattleBtn) {
        window.startBattleBtn.addEventListener('click', initBattle);
    }
}

// =============================================================================
// MODAL AND ANIMATION PLACEHOLDERS
// =============================================================================

/**
 * Show a modal for unit selection
 * @param {string} title - Modal title
 * @param {Array} choices - Array of choice objects { text, value }
 * @param {number} maxSelections - Maximum number of selections allowed
 * @returns {Promise<Array>} Selected values
 */
function showModal(title, choices, maxSelections) {
    return new Promise(resolve => {
        console.log('🎯 Showing modal for unit selection:', title, 'choices:', choices.length, 'max:', maxSelections);
        
        // For now, auto-select the first units (can be enhanced later)
        const autoSelection = choices.slice(0, maxSelections).map(c => c.value);
        
        // Show modal in battle display
        const battleResultDiv = document.getElementById('battleResult');
        if (battleResultDiv) {
            const modalDiv = document.createElement('div');
            modalDiv.className = 'bg-yellow-100 border-l-4 border-yellow-500 p-4 my-2';
            modalDiv.innerHTML = `
                <div class="flex">
                    <div class="flex-shrink-0">
                        <i class="fas fa-exclamation-triangle text-yellow-500"></i>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-yellow-700 font-medium">${title}</p>
                        <p class="text-xs text-yellow-600 mt-1">Auto-selecting: ${autoSelection.map(idx => choices[idx]?.text || 'Unit').join(', ')}</p>
                    </div>
                </div>
            `;
            battleResultDiv.appendChild(modalDiv);
            
            // Auto-scroll to bottom
            battleResultDiv.scrollTop = battleResultDiv.scrollHeight;
        }
        
        // Auto-resolve after a short delay
        setTimeout(() => {
            console.log('🎯 Modal auto-resolving with:', autoSelection);
            resolve(autoSelection);
        }, 1000);
    });
}

/**
 * Animate the destruction of a unit
 * @param {string} unitId - The ID of the unit to animate
 * @param {Function} callback - Callback function to call when animation is complete
 */
function animateDestruction(unitId, callback) {
    console.log('🔥 Attempting to animate destruction for:', unitId);
    const element = document.querySelector(`#${unitId}`);
    if (!element) {
        console.warn('❌ Element not found for destruction animation:', unitId);
        console.log('Available elements:', Array.from(document.querySelectorAll('[id*="unit-"]')).map(el => el.id));
        setTimeout(callback, 500);
        return;
    }
    
    console.log('✅ Found element for destruction:', unitId, element);

    // Create explosion effect with icon
    const explosionIcon = document.createElement('div');
    explosionIcon.innerHTML = '💥';
    explosionIcon.style.position = 'absolute';
    explosionIcon.style.fontSize = '24px';
    explosionIcon.style.zIndex = '1000';
    explosionIcon.style.pointerEvents = 'none';
    explosionIcon.style.opacity = '0';
    
    // Position the explosion over the unit
    const rect = element.getBoundingClientRect();
    explosionIcon.style.left = (rect.left + rect.width / 2 - 12) + 'px';
    explosionIcon.style.top = (rect.top + rect.height / 2 - 12) + 'px';
    
    document.body.appendChild(explosionIcon);

    // Animate the destruction sequence
    if (typeof gsap !== 'undefined') {
        // GSAP animation sequence
        const tl = gsap.timeline({
            onComplete: () => {
                document.body.removeChild(explosionIcon);
                element.style.display = 'none';
                callback();
            }
        });

        // 1. Show explosion
        tl.to(explosionIcon, { 
            opacity: 1, 
            scale: 1.5, 
            duration: 0.2 
        })
        // 2. Shake and fade unit
        .to(element, { 
            x: -10, 
            rotation: -5, 
            duration: 0.1 
        }, 0.1)
        .to(element, { 
            x: 10, 
            rotation: 5, 
            duration: 0.1 
        })
        .to(element, { 
            x: -5, 
            rotation: -2, 
            duration: 0.1 
        })
        .to(element, { 
            x: 0, 
            rotation: 0, 
            opacity: 0.3, 
            duration: 0.2 
        })
        // 3. Fade explosion
        .to(explosionIcon, { 
            opacity: 0, 
            scale: 2, 
            duration: 0.3 
        }, 0.4);
    } else {
        // Fallback CSS animation
        explosionIcon.style.transition = 'all 0.6s ease-out';
        explosionIcon.style.opacity = '1';
        explosionIcon.style.transform = 'scale(1.5)';
        
        element.style.transition = 'all 0.6s ease-out';
        element.style.opacity = '0.3';
        element.style.transform = 'scale(0.8) rotate(10deg)';
        
        setTimeout(() => {
            explosionIcon.style.opacity = '0';
            explosionIcon.style.transform = 'scale(2)';
            
            setTimeout(() => {
                document.body.removeChild(explosionIcon);
                element.style.display = 'none';
                callback();
            }, 300);
        }, 300);
    }
}

/**
 * Animate damage taken by a unit (routing animation)
 * @param {string} unitId - The ID of the unit to animate
 */
function animateDamage(unitId) {
    console.log('⚔️ Attempting to animate damage for:', unitId);
    const element = document.querySelector(`#${unitId}`);
    if (!element) {
        console.warn('❌ Element not found for damage animation:', unitId);
        return;
    }
    
    console.log('✅ Found element for damage:', unitId, element);

    // Create damage indicator
    const damageIcon = document.createElement('div');
    damageIcon.innerHTML = '⚔️';
    damageIcon.style.position = 'absolute';
    damageIcon.style.fontSize = '18px';
    damageIcon.style.zIndex = '999';
    damageIcon.style.pointerEvents = 'none';
    damageIcon.style.opacity = '0';
    damageIcon.style.color = '#dc2626';
    
    const rect = element.getBoundingClientRect();
    damageIcon.style.left = (rect.right - 20) + 'px';
    damageIcon.style.top = (rect.top + 5) + 'px';
    
    document.body.appendChild(damageIcon);

    if (typeof gsap !== 'undefined') {
        // GSAP damage animation
        gsap.timeline({
            onComplete: () => document.body.removeChild(damageIcon)
        })
        .to(damageIcon, { 
            opacity: 1, 
            y: -20, 
            duration: 0.3 
        })
        .to(damageIcon, { 
            opacity: 0, 
            y: -40, 
            duration: 0.4 
        })
        .to(element, { 
            opacity: 0.5, 
            x: -30, 
            duration: 0.5 
        }, 0);
    } else {
        // Fallback animation
        damageIcon.style.transition = 'all 0.7s ease-out';
        damageIcon.style.opacity = '1';
        damageIcon.style.transform = 'translateY(-40px)';
        
        element.style.transition = 'all 0.5s ease-out';
        element.style.opacity = '0.5';
        element.style.transform = 'translateX(-30px)';
        
        setTimeout(() => {
            damageIcon.style.opacity = '0';
            setTimeout(() => document.body.removeChild(damageIcon), 200);
        }, 500);
    }
}

/**
 * Animate unit rallying (recovery animation)
 * @param {string} unitId - The ID of the unit to animate
 */
function animateRally(unitId) {
    console.log('🛡️ Attempting to animate rally for:', unitId);
    const element = document.querySelector(`#${unitId}`);
    if (!element) {
        console.warn('❌ Element not found for rally animation:', unitId); 
        return;
    }
    
    console.log('✅ Found element for rally:', unitId, element);

    // Create rally indicator
    const rallyIcon = document.createElement('div');
    rallyIcon.innerHTML = '🛡️';
    rallyIcon.style.position = 'absolute';
    rallyIcon.style.fontSize = '18px';
    rallyIcon.style.zIndex = '999';
    rallyIcon.style.pointerEvents = 'none';
    rallyIcon.style.opacity = '0';
    rallyIcon.style.color = '#059669';
    
    const rect = element.getBoundingClientRect();
    rallyIcon.style.left = (rect.left - 25) + 'px';
    rallyIcon.style.top = (rect.top + 5) + 'px';
    
    document.body.appendChild(rallyIcon);

    if (typeof gsap !== 'undefined') {
        // GSAP rally animation
        gsap.timeline({
            onComplete: () => document.body.removeChild(rallyIcon)
        })
        .to(rallyIcon, { 
            opacity: 1, 
            scale: 1.2, 
            duration: 0.3 
        })
        .to(rallyIcon, { 
            opacity: 0, 
            scale: 0.8, 
            duration: 0.4 
        })
        .to(element, { 
            opacity: 1, 
            x: 0, 
            duration: 0.5 
        }, 0);
    } else {
        // Fallback animation
        rallyIcon.style.transition = 'all 0.7s ease-out';
        rallyIcon.style.opacity = '1';
        rallyIcon.style.transform = 'scale(1.2)';
        
        element.style.transition = 'all 0.5s ease-out';
        element.style.opacity = '1';
        element.style.transform = 'translateX(0px)';
        
        setTimeout(() => {
            rallyIcon.style.opacity = '0';
            rallyIcon.style.transform = 'scale(0.8)';
            setTimeout(() => document.body.removeChild(rallyIcon), 200);
        }, 300);
    }
}

/**
 * Animate battle round start
 * @param {number} roundNumber - The round number
 */
function animateBattleRound(roundNumber) {
    console.log('⚔️ Animating battle round:', roundNumber);
    const battleResultDiv = document.getElementById('battleResult');
    if (!battleResultDiv) {
        console.warn('❌ Battle result div not found');
        return;
    }
    
    console.log('✅ Found battle result div, creating round animation');

    // Create round announcement
    const roundIcon = document.createElement('div');
    roundIcon.innerHTML = `⚔️ ROUND ${roundNumber} ⚔️`;
    roundIcon.style.position = 'relative';
    roundIcon.style.fontSize = '20px';
    roundIcon.style.fontWeight = 'bold';
    roundIcon.style.color = '#7c3aed';
    roundIcon.style.textAlign = 'center';
    roundIcon.style.margin = '10px 0';
    roundIcon.style.padding = '10px';
    roundIcon.style.background = 'linear-gradient(45deg, #f3f4f6, #e5e7eb)';
    roundIcon.style.borderRadius = '8px';
    roundIcon.style.border = '2px solid #7c3aed';
    roundIcon.style.opacity = '0';
    roundIcon.style.transform = 'scale(0.5)';
    
    battleResultDiv.appendChild(roundIcon);

    if (typeof gsap !== 'undefined') {
        gsap.to(roundIcon, { 
            opacity: 1, 
            scale: 1, 
            duration: 0.5, 
            ease: "back.out(1.7)" 
        });
    } else {
        roundIcon.style.transition = 'all 0.5s ease-out';
        setTimeout(() => {
            roundIcon.style.opacity = '1';
            roundIcon.style.transform = 'scale(1)';
        }, 50);
    }
}

/**
 * Animate battle victory
 * @param {string} winner - The winning army
 */
function animateVictory(winner) {
    console.log('🏆 Animating victory for:', winner);
    const battleResultDiv = document.getElementById('battleResult');
    if (!battleResultDiv) {
        console.warn('❌ Battle result div not found');
        return;
    }
    
    console.log('✅ Found battle result div, creating victory animation');

    // Create victory announcement
    const victoryIcon = document.createElement('div');
    victoryIcon.innerHTML = `🏆 ${winner} WINS! 🏆`;
    victoryIcon.style.position = 'relative';
    victoryIcon.style.fontSize = '24px';
    victoryIcon.style.fontWeight = 'bold';
    victoryIcon.style.color = '#dc2626';
    victoryIcon.style.textAlign = 'center';
    victoryIcon.style.margin = '15px 0';
    victoryIcon.style.padding = '15px';
    victoryIcon.style.background = 'linear-gradient(45deg, #fef3c7, #fbbf24)';
    victoryIcon.style.borderRadius = '12px';
    victoryIcon.style.border = '3px solid #dc2626';
    victoryIcon.style.boxShadow = '0 8px 32px rgba(220, 38, 38, 0.3)';
    victoryIcon.style.opacity = '0';
    victoryIcon.style.transform = 'scale(0.3) rotate(-10deg)';
    
    battleResultDiv.appendChild(victoryIcon);

    if (typeof gsap !== 'undefined') {
        gsap.to(victoryIcon, { 
            opacity: 1, 
            scale: 1, 
            rotation: 0,
            duration: 0.8, 
            ease: "elastic.out(1, 0.3)" 
        });
    } else {
        victoryIcon.style.transition = 'all 0.8s ease-out';
        setTimeout(() => {
            victoryIcon.style.opacity = '1';
            victoryIcon.style.transform = 'scale(1) rotate(0deg)';
        }, 50);
    }
}

// Global simulate battle function for HTML interface
window.simulateBattle = async function(armyA, armyB, generalA, generalB, battleType, cityTier, battleConfig) {
    console.log('Starting battle simulation:', { armyA, armyB, generalA, generalB, battleType, cityTier });
    console.log('Army A length:', armyA?.length, 'Army B length:', armyB?.length);
    
    // Validate armies
    if (!armyA || armyA.length === 0) {
        throw new Error('Army A is empty or undefined');
    }
    if (!armyB || armyB.length === 0) {
        throw new Error('Army B is empty or undefined');
    }
    
    try {
        // Clear battle display
        const battleResultDiv = document.getElementById('battleResult');
        if (battleResultDiv) {
            battleResultDiv.innerHTML = '';
        }
        
        // Initialize battle simulator
        const battleSimulator = new BattleSimulator();
        battleSimulator.init(armyA, armyB, generalA, generalB);
        
        // Store battle configuration
        window.battleData = {
            armyA: [...armyA],
            armyB: [...armyB],
            generalA: {...generalA},
            generalB: {...generalB},
            battleType: battleType,
            cityTier: cityTier,
            log: []
        };
        
        // Simulate the battle
        const result = await battleSimulator.simulate();
        
        console.log('Battle simulation completed:', result);
        return result;
    } catch (error) {
        console.error('Error during battle simulation:', error);
        throw error;
    }
};

// Export the BattleSimulator class for direct use
window.BattleSimulator = BattleSimulator;

// Enhanced generateBattleReport function to create an image-based report
window.generateBattleReport = function() {
    console.log('Generating battle report image...');

    if (!window.battleData) {
        throw new Error('No battle data available. Please run a battle simulation first.');
    }

    if (!window.battleData.finalResult) {
        throw new Error('Battle data incomplete. Please run a complete battle simulation first.');
    }
    
    const battleData = window.battleData;
    const result = battleData.finalResult;

    // Create a canvas element
    const canvas = document.createElement('canvas');
    canvas.width = 1400;
    canvas.height = 2000;
    const ctx = canvas.getContext('2d');

    // Set background color
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 36px Arial';
    ctx.fillText('Battle Report', 50, 50);

    // Battle Overview
    ctx.font = '24px Arial';
    ctx.fillText(`Battle Type: ${battleData.battleType || 'Standard Battle'}`, 50, 100);
    ctx.fillText(`Date: ${new Date().toLocaleString()}`, 50, 140);

    // Generals
    ctx.fillText(`General A: ${battleData.generalA ? battleData.generalA.name : 'Unknown'}`, 50, 180);
    ctx.fillText(`General B: ${battleData.generalB ? battleData.generalB.name : 'Unknown'}`, 50, 220);

    // Army Compositions
    ctx.font = 'bold 28px Arial';
    ctx.fillText('Army Compositions', 50, 280);

    ctx.font = '20px Arial';
    ctx.fillText('Army A:', 50, 320);
    battleData.armyA.forEach((unit, index) => {
        ctx.fillText(`${index + 1}. ${unit.count}x ${unit.type.toUpperCase()} (${unit.enhancement || 'None'})`, 70, 360 + index * 30);
    });

    ctx.fillText('Army B:', 50, 360 + battleData.armyA.length * 30 + 40);
    battleData.armyB.forEach((unit, index) => {
        ctx.fillText(`${index + 1}. ${unit.count}x ${unit.type.toUpperCase()} (${unit.enhancement || 'None'})`, 70, 400 + battleData.armyA.length * 30 + index * 30);
    });

    // Battle Results
    ctx.font = 'bold 28px Arial';
    ctx.fillText('Battle Results', 50, 500 + battleData.armyA.length * 30 + battleData.armyB.length * 30);

    ctx.font = '20px Arial';
    ctx.fillText(`Winner: ${result.winner}`, 50, 540 + battleData.armyA.length * 30 + battleData.armyB.length * 30);

    if (result.casualties) {
        ctx.fillText('Casualties:', 50, 580 + battleData.armyA.length * 30 + battleData.armyB.length * 30);
        if (result.casualties.armyA) {
            ctx.fillText(`Army A: ${result.casualties.armyA.join(', ')}`, 70, 620 + battleData.armyA.length * 30 + battleData.armyB.length * 30);
        }
        if (result.casualties.armyB) {
            ctx.fillText(`Army B: ${result.casualties.armyB.join(', ')}`, 70, 660 + battleData.armyA.length * 30 + battleData.armyB.length * 30);
        }
    }

    if (result.survivors) {
        ctx.fillText('Survivors:', 50, 700 + battleData.armyA.length * 30 + battleData.armyB.length * 30);
        if (result.survivors.armyA) {
            ctx.fillText(`Army A: ${result.survivors.armyA.map(s => `${s.count}x ${s.type}`).join(', ')}`, 70, 740 + battleData.armyA.length * 30 + battleData.armyB.length * 30);
        }
        if (result.survivors.armyB) {
            ctx.fillText(`Army B: ${result.survivors.armyB.map(s => `${s.count}x ${s.type}`).join(', ')}`, 70, 780 + battleData.armyA.length * 30 + battleData.armyB.length * 30);
        }
    }

    // Battle Log
    if (battleData.log && battleData.log.length > 0) {
        ctx.font = 'bold 28px Arial';
        ctx.fillText('Battle Log', 50, 820 + battleData.armyA.length * 30 + battleData.armyB.length * 30);

        ctx.font = '20px Arial';
        battleData.log.forEach((entry, index) => {
            ctx.fillText(`Round ${index + 1}: ${entry}`, 70, 860 + battleData.armyA.length * 30 + battleData.armyB.length * 30 + index * 30);
        });
    }
    
    // Draw divider line
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 900 + battleData.armyA.length * 30 + battleData.armyB.length * 30);
    ctx.lineTo(1350, 900 + battleData.armyA.length * 30 + battleData.armyB.length * 30);
    ctx.stroke();

    // Add a footer
    ctx.font = '16px Arial';
    ctx.fillStyle = '#777777';
    ctx.fillText('Generated by Battle Simulator', 50, 950 + battleData.armyA.length * 30 + battleData.armyB.length * 30);
    
    // Export canvas as image
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `battle-report-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`;
    link.click();

    console.log('Battle report image generated and downloaded successfully');
};

console.log('Battle.js loaded successfully with window.simulateBattle and window.generateBattleReport functions');
console.log('GSAP availability:', typeof gsap !== 'undefined' ? '✅ Available' : '❌ Not loaded');
window.battleJsLoaded = true;

// Ensure functions are immediately available
console.log('Verifying functions are available:');
console.log('window.simulateBattle:', typeof window.simulateBattle);
console.log('window.generateBattleReport:', typeof window.generateBattleReport);

// Test animation function for debugging
window.testAnimations = function() {
    console.log('🎬 Testing battle animations...');
    
    // Test round animation
    animateBattleRound(1);
    
    setTimeout(() => {
        // Test victory animation
        animateVictory('Army A');
    }, 1000);
    
    // Test unit animations (if units exist)
    const firstUnit = document.querySelector('[id*="unit-"]');
    if (firstUnit) {
        setTimeout(() => {
            console.log('Testing damage animation on:', firstUnit.id);
            animateDamage(firstUnit.id);
        }, 2000);
        
        setTimeout(() => {
            console.log('Testing rally animation on:', firstUnit.id);
            animateRally(firstUnit.id);
        }, 3000);
        
        setTimeout(() => {
            console.log('Testing destruction animation on:', firstUnit.id);
            animateDestruction(firstUnit.id, () => {
                console.log('Destruction animation completed');
            });
        }, 4000);
    } else {
        console.log('No units found for testing unit animations');
    }
};

// =============================================================================
// BATTLEFIELD VISUALIZATION SYSTEM
// =============================================================================

/**
 * Initialize battlefield visual area in the DOM
 */
function initializeBattlefield() {
    const battleResultDiv = document.getElementById('battleResult');
    if (!battleResultDiv) {
        console.warn('❌ Battle result div not found for battlefield initialization');
        return;
    }

    // Create battlefield container if it doesn't exist
    let battlefield = document.getElementById('battlefield');
    if (!battlefield) {
        battlefield = document.createElement('div');
        battlefield.id = 'battlefield';
        battlefield.className = 'battlefield';
        battlefield.innerHTML = `
            <div class="battlefield-header">
                <h3>⚔️ BATTLEFIELD ⚔️</h3>
            </div>
            <div class="army-formations">
                <div class="army-formation army-a">
                    <h4>🛡️ Army A</h4>
                    <div class="formation-units" id="battlefield-army-a"></div>
                </div>
                <div class="army-formation army-b">
                    <h4>⚔️ Army B</h4>
                    <div class="formation-units" id="battlefield-army-b"></div>
                </div>
            </div>
        `;
        
        // Insert battlefield at the top of battle results
        battleResultDiv.insertBefore(battlefield, battleResultDiv.firstChild);
    }
}

/**
 * Render army units on the battlefield
 * @param {Array} armyA - Army A units
 * @param {Array} armyB - Army B units
 */
function renderBattlefield(armyA, armyB) {
    console.log('🎯 Rendering battlefield with armies:', { armyA: armyA.length, armyB: armyB.length });
    
    // Ensure battlefield is initialized
    initializeBattlefield();
    
    const armyAContainer = document.getElementById('battlefield-army-a');
    const armyBContainer = document.getElementById('battlefield-army-b');
    
    if (!armyAContainer || !armyBContainer) {
        console.warn('❌ Battlefield containers not found');
        return;
    }
    
    // Clear existing units
    armyAContainer.innerHTML = '';
    armyBContainer.innerHTML = '';
    
    // Render Army A units
    armyA.forEach((unit, index) => {
        const unitElement = createBattlefieldUnit(unit, 'A', index);
        armyAContainer.appendChild(unitElement);
    });
    
    // Render Army B units
    armyB.forEach((unit, index) => {
        const unitElement = createBattlefieldUnit(unit, 'B', index);
        armyBContainer.appendChild(unitElement);
    });
    
    console.log('✅ Battlefield rendered successfully');
}

/**
 * Create a battlefield unit element
 * @param {Object} unit - Unit data
 * @param {string} armyId - Army identifier (A or B)
 * @param {number} index - Unit index
 * @returns {HTMLElement} Unit element
 */
function createBattlefieldUnit(unit, armyId, index) {
    const unitElement = document.createElement('div');
    unitElement.className = `battlefield-unit ${unit.type}`;
    unitElement.id = `battlefield-unit-${armyId}-${index}`;
    
    // Add routed/destroyed states
    if (unit.routed) {
        unitElement.classList.add('routed');
    }
    if (unit.destroyed) {
        unitElement.classList.add('destroyed');
    }
    
    // Unit tooltip with stats
    const stats = getUnitStats(unit);
    unitElement.title = `${unit.type.toUpperCase()}
Enhancement: ${unit.enhancement || 'None'}
Skirmish: ${stats.skirmish} | Pitch: ${stats.pitch}
Defense: ${stats.defense} | Rally: ${stats.rally}
Move: ${stats.move}`;
    
    // Add enhancement indicator if present
    if (unit.enhancement && unit.enhancement !== 'None') {
        const enhancementBadge = document.createElement('div');
        enhancementBadge.className = 'enhancement-badge';
        enhancementBadge.textContent = unit.enhancement.charAt(0);
        unitElement.appendChild(enhancementBadge);
    }
    
    return unitElement;
}

/**
 * Animate battlefield unit during battle phases
 * @param {string} unitId - Battlefield unit ID
 * @param {string} animationType - Type of animation (attack, defend, damage, destroy, rally)
 * @param {Function} callback - Callback when animation completes
 */
function animateBattlefieldUnit(unitId, animationType, callback = () => {}) {
    console.log(`🎬 Animating battlefield unit ${unitId} with ${animationType}`);
    
    const element = document.getElementById(unitId);
    if (!element) {
        console.warn(`❌ Battlefield unit element not found: ${unitId}`);
        callback();
        return;
    }
    
    // Remove any existing animation classes
    element.classList.remove('attacking', 'defending', 'taking-damage', 'rallying');
    
    if (typeof gsap !== 'undefined') {
        animateBattlefieldUnitGSAP(element, animationType, callback);
    } else {
        animateBattlefieldUnitCSS(element, animationType, callback);
    }
}

/**
 * GSAP-based battlefield unit animations
 */
function animateBattlefieldUnitGSAP(element, animationType, callback) {
    const tl = gsap.timeline({ onComplete: callback });
    
    switch (animationType) {
        case 'attack':
            element.classList.add('attacking');
            tl.to(element, { x: 10, duration: 0.2 })
              .to(element, { x: -5, duration: 0.1 })
              .to(element, { x: 0, duration: 0.2 });
            break;
            
        case 'defend':
            element.classList.add('defending');
            tl.to(element, { scale: 0.9, duration: 0.2 })
              .to(element, { scale: 1.1, duration: 0.2 })
              .to(element, { scale: 1, duration: 0.2 });
            break;
            
        case 'damage':
            element.classList.add('taking-damage');
            tl.to(element, { 
                x: -15, 
                rotation: -10, 
                scale: 0.9, 
                duration: 0.3 
            })
            .to(element, { 
                x: 0, 
                rotation: 0, 
                scale: 1, 
                duration: 0.4 
            });
            break;
            
        case 'destroy':
            tl.to(element, { 
                scale: 0, 
                rotation: 360, 
                opacity: 0, 
                duration: 0.6 
            });
            break;
            
        case 'rally':
            element.classList.add('rallying');
            element.classList.remove('routed');
            tl.to(element, { 
                scale: 1.2, 
                rotation: 10, 
                duration: 0.3 
            })
            .to(element, { 
                scale: 1, 
                rotation: 0, 
                duration: 0.3 
            });
            break;
            
        default:
            callback();
    }
}

/**
 * CSS-based battlefield unit animations (fallback)
 */
function animateBattlefieldUnitCSS(element, animationType, callback) {
    element.style.transition = 'all 0.6s ease-out';
    
    switch (animationType) {
        case 'attack':
            element.classList.add('attacking');
            element.style.transform = 'translateX(10px)';
            setTimeout(() => {
                element.style.transform = 'translateX(-5px)';
                setTimeout(() => {
                    element.style.transform = 'translateX(0)';
                    setTimeout(callback, 200);
                }, 100);
            }, 200);
            break;
            
        case 'defend':
            element.classList.add('defending');
            element.style.transform = 'scale(0.9)';
            setTimeout(() => {
                element.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                    setTimeout(callback, 200);
                }, 200);
            }, 200);
            break;
            
        case 'damage':
            element.classList.add('taking-damage');
            element.style.transform = 'translateX(-15px) rotate(-10deg) scale(0.9)';
            setTimeout(() => {
                element.style.transform = 'translateX(0) rotate(0deg) scale(1)';
                setTimeout(callback, 400);
            }, 300);
            break;
            
        case 'destroy':
            element.style.transform = 'scale(0) rotate(360deg)';
            element.style.opacity = '0';
            setTimeout(callback, 600);
            break;
            
        case 'rally':
            element.classList.add('rallying');
            element.classList.remove('routed');
            element.style.transform = 'scale(1.2) rotate(10deg)';
            setTimeout(() => {
                element.style.transform = 'scale(1) rotate(0deg)';
                setTimeout(callback, 300);
            }, 300);
            break;
            
        default:
            callback();
    }
}

/**
 * Update battlefield unit states (routed, destroyed)
 * @param {string} armyId - Army identifier
 * @param {number} unitIndex - Unit index
 * @param {string} state - State to apply ('routed', 'destroyed', 'normal')
 */
function updateBattlefieldUnitState(armyId, unitIndex, state) {
    const unitId = `battlefield-unit-${armyId}-${unitIndex}`;
    const element = document.getElementById(unitId);
    
    if (!element) {
        console.warn(`❌ Battlefield unit not found for state update: ${unitId}`);
        return;
    }
    
    // Remove all state classes
    element.classList.remove('routed', 'destroyed');
    
    // Apply new state
    if (state === 'routed') {
        element.classList.add('routed');
    } else if (state === 'destroyed') {
        element.classList.add('destroyed');
    }
    
    console.log(`✅ Updated battlefield unit ${unitId} state to: ${state}`);
}

/**
 * Animate battlefield formation movement (for mass attacks/retreats)
 * @param {string} armyId - Army identifier
 * @param {string} movementType - 'advance', 'retreat', 'charge'
 */
function animateBattlefieldFormation(armyId, movementType) {
    console.log(`🏃 Animating formation ${movementType} for Army ${armyId}`);
    
    const formationContainer = document.getElementById(`battlefield-army-${armyId.toLowerCase()}`);
    if (!formationContainer) {
        console.warn(`❌ Formation container not found: battlefield-army-${armyId.toLowerCase()}`);
        return;
    }
    
    const units = formationContainer.querySelectorAll('.battlefield-unit');
    
    if (typeof gsap !== 'undefined') {
        units.forEach((unit, index) => {
            const delay = index * 0.1; // Stagger the animation
            
            switch (movementType) {
                case 'advance':
                    gsap.to(unit, { 
                        x: armyId === 'A' ? 20 : -20, 
                        duration: 0.5, 
                        delay,
                        yoyo: true,
                        repeat: 1
                    });
                    break;
                    
                case 'retreat':
                    gsap.to(unit, { 
                        x: armyId === 'A' ? -30 : 30, 
                        opacity: 0.7,
                        duration: 0.8, 
                        delay,
                        yoyo: true,
                        repeat: 1
                    });
                    break;
                    
                case 'charge':
                    gsap.to(unit, { 
                        scale: 1.1,
                        x: armyId === 'A' ? 30 : -30, 
                        duration: 0.3, 
                        delay,
                        yoyo: true,
                        repeat: 1
                    });
                    break;
            }
        });
    } else {
        // CSS fallback
        units.forEach((unit, index) => {
            setTimeout(() => {
                unit.style.transition = 'all 0.5s ease-out';
                
                switch (movementType) {
                    case 'advance':
                                               unit.style.transform = `translateX(${armyId === 'A' ? '20px' : '-20px'})`;
                        setTimeout(() => {
                            unit.style.transform = 'translateX(0)';
                        }, 500);
                        break;
                        
                    case 'retreat':
                        unit.style.transform = `translateX(${armyId === 'A' ? '-30px' : '30px'})`;
                        unit.style.opacity = '0.7';
                        setTimeout(() => {
                            unit.style.transform = 'translateX(0)';
                            unit.style.opacity = '1';
                        }, 800);
                        break;
                        
                    case 'charge':
                        unit.style.transform = `scale(1.1) translateX(${armyId === 'A' ? '30px' : '-30px'})`;
                        setTimeout(() => {
                            unit.style.transform = 'scale(1) translateX(0)';
                        }, 300);
                        break;
                }
            }, index * 100);
        });
    }
}

// Make battlefield functions globally available
window.initializeBattlefield = initializeBattlefield;
window.renderBattlefield = renderBattlefield;
window.animateBattlefieldUnit = animateBattlefieldUnit;
window.updateBattlefieldUnitState = updateBattlefieldUnitState;
window.animateBattlefieldFormation = animateBattlefieldFormation;

// =============================================================================
// ENHANCED BATTLE CONSOLE DISPLAY
// =============================================================================

/**
 * Initialize separate containers for battlefield and text output
 */
function initializeBattleContainers() {
    const battleContainer = document.getElementById('battleContainer');
    if (!battleContainer) {
        console.error('Battle container not found!');
        return;
    }

    // Create battlefield container
    const battlefield = document.createElement('div');
    battlefield.id = 'battlefield';
    battlefield.className = 'battlefield';
    battleContainer.appendChild(battlefield);

    // Create text output container
    const textOutput = document.createElement('div');
    textOutput.id = 'textOutput';
    textOutput.className = 'text-output';
    battleContainer.appendChild(textOutput);
}

// Call initializeBattleContainers when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeBattleContainers();
});
