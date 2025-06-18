// battle.js

// Unit stats definitions
const unitStats = {
    cav: { skirmish: 1, pitch: 1, defense: 0, rally: 0, move: 5 },
    heavy: { skirmish: 0, pitch: 1, defense: 2, rally: 1, move: 3 },
    light: { skirmish: 2, pitch: 0, defense: 0, rally: 1, move: 4 },
    ranged: { skirmish: 0, pitch: 1, defense: 2, rally: 0, move: 4 },
    support: { skirmish: 0, pitch: 0, defense: 2, rally: 1, move: 4 }
};

const enhancements = {
    // Cavalry
    'Life Guard': { rally: 2 },
    Lancers: { skirmish: 2 },
    Dragoons: { defense: 2, pitch: 1, rally: 1 },
    // Heavy
    'Artillery Team': { defense: 1, pitch: 1 },
    Grenadiers: { skirmish: 2, pitch: 2 },
    Stormtroopers: { pitch: 1, rally: 1, move: 1 },
    // Light
    Rangers: { skirmish: 2, pitch: 1 },
    'Assault Team': { skirmish: 1 },
    Commando: { defense: 2, pitch: 1 },
    // Ranged
    Sharpshooters: { defense: 2 },
    'Mobile Platforms': { skirmish: 1, defense: 2, move: 1 },
    'Mortar Team': { pitch: 1, rally: 1 },
    // Support
    'Field Hospital': {},
    'Combat Engineers': {},
    'Officer Corps': { rally: 2 },
    // Universal
    'Sentry Team': { defense: 3 },
    Marines: {}
};

// Armies
const armyA = [];
const armyB = [];

// DOM Elements
const unitTypeA = document.getElementById('unitTypeA');
const unitCountA = document.getElementById('unitCountA');
const addUnitA = document.getElementById('addUnitA');
const armyAList = document.getElementById('armyAList');
const enhancementA = document.getElementById('enhancementA');

const unitTypeB = document.getElementById('unitTypeB');
const unitCountB = document.getElementById('unitCountB');
const addUnitB = document.getElementById('addUnitB');
const armyBList = document.getElementById('armyBList');
const enhancementB = document.getElementById('enhancementB');

const simulateBattleBtn = document.getElementById('simulateBattle');
const battleResultDiv = document.getElementById('battleResult');

// Helpers
function addUnits(army, listEl, type, count, enhancement) {
    for (let i = 0; i < count; i++) {
        army.push({ type, enhancement });
    }
    renderArmy(listEl, army);
}

function renderArmy(listEl, army) {
    listEl.innerHTML = '';
    const counts = army.reduce((acc, unit) => {
        const key = unit.enhancement !== 'None' ? `${unit.type} (${unit.enhancement})` : unit.type;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});
    for (const unitKey in counts) {
        const tr = document.createElement('tr');
        const tdUnit = document.createElement('td');
        const tdCount = document.createElement('td');
        tdUnit.textContent = unitKey;
        tdCount.textContent = counts[unitKey];
        tdUnit.className = 'border px-2 py-1';
        tdCount.className = 'border px-2 py-1';
        tr.appendChild(tdUnit);
        tr.appendChild(tdCount);
        listEl.appendChild(tr);
    }
}

// Roll a single d6
function rollDie() {
    return Math.floor(Math.random() * 6) + 1;
}

// Generate city garrison defenders for siege by tier
function generateDefenders(tier) {
    const defs = [];
    const heavyCount = tier === 1 ? 1 : tier === 2 ? 2 : 3;
    const rangedCount = tier === 1 ? 2 : tier === 2 ? 3 : 4;
    for (let i = 0; i < heavyCount; i++) defs.push('heavy');
    for (let i = 0; i < rangedCount; i++) defs.push('ranged');
    return defs;
}

// Simulate a battle with Skirmish, Pitch, Rally, and Action Report stages
function simulateBattle(army1, army2, genA, genB, battleType, cityTier) {
    let aUnits = [...army1];
    let bUnits = battleType === 'siege' ? generateDefenders(cityTier) : [...army2];
    const log = [];

    // Include general info
    log.push(`General A: Lv${genA.level} (${genA.trait}), General B: Lv${genB.level} (${genB.trait})`);

    // Skirmish Stage
    log.push('--- Skirmish Stage ---');
    const pickSkirmishers = units => units.slice().sort((u, v) => unitStats[v].attack - unitStats[u].attack).slice(0, 2);
    const aSkirm = pickSkirmishers(aUnits);
    const bSkirm = pickSkirmishers(bUnits);
    aSkirm.forEach(u => {
        if (!bUnits.length) return;
        const idx = Math.floor(Math.random() * bUnits.length);
        const target = bUnits[idx];
        const atk = rollDie() + unitStats[u].attack;
        const def = rollDie() + unitStats[target].defense;
        log.push(`A ${u} (${atk}) vs B ${target} (${def})`);
        if (atk > def) {
            log.push(`B ${target} routed!`);
            bUnits.splice(idx, 1);
        }
    });
    bSkirm.forEach(u => {
        if (!aUnits.length) return;
        const idx = Math.floor(Math.random() * aUnits.length);
        const target = aUnits[idx];
        const atk = rollDie() + unitStats[u].attack;
        const def = rollDie() + unitStats[target].defense;
        log.push(`B ${u} (${atk}) vs A ${target} (${def})`);
        if (atk > def) {
            log.push(`A ${target} routed!`);
            aUnits.splice(idx, 1);
        }
    });

    // Pitch Stage (up to 3 rounds)
    log.push('--- Pitch Stage ---');
    // Calculate general pitch bonuses
    const pitchBonusA = genA.trait === 'Brilliant' ? genA.level * 2 : genA.level;
    const pitchBonusB = genB.trait === 'Brilliant' ? genB.level * 2 : genB.level;
    let tally = 0;
    for (let round = 1; round <= 3; round++) {
        let aPitch = 0, bPitch = 0;
        aUnits.forEach(u => aPitch += rollDie() + unitStats[u].attack);
        bUnits.forEach(u => bPitch += rollDie() + unitStats[u].attack);
        aPitch += pitchBonusA;
        bPitch += pitchBonusB;
        tally += (aPitch - bPitch);
        log.push(`Round ${round}: A ${aPitch} vs B ${bPitch}, Tally ${tally}`);
        if (tally >= 20 || tally <= -20) break;
    }

    // Rally Stage if needed
    if (tally < 20 && tally > -20) {
        log.push('--- Rally Stage ---');
        aUnits = aUnits.filter(u => (rollDie() + unitStats[u].defense) >= 5);
        bUnits = bUnits.filter(u => (rollDie() + unitStats[u].defense) >= 5);
        log.push(`A survivors: ${aUnits.length}, B survivors: ${bUnits.length}`);
    }

    // Action Report
    log.push('--- Action Report ---');
    const filterDestroyed = units => units.filter(u => rollDie() > 2);
    const finalA = filterDestroyed(aUnits);
    const finalB = filterDestroyed(bUnits);
    log.push(`A destroyed: ${aUnits.length - finalA.length}, B destroyed: ${bUnits.length - finalB.length}`);

    // Determine Winner
    if (finalA.length > finalB.length) log.push('Army A wins!');
    else if (finalB.length > finalA.length) log.push('Army B wins!');
    else log.push("It's a tie!");

    return log.join('\n');
}

// Event Listeners
addUnitA.addEventListener('click', () => {
    const count = parseInt(unitCountA.value);
    addUnits(armyA, armyAList, unitTypeA.value, count, enhancementA.value);
});
addUnitB.addEventListener('click', () => {
    const count = parseInt(unitCountB.value);
    addUnits(armyB, armyBList, unitTypeB.value, count, enhancementB.value);
});

// Update event listener to include generals and siege settings
simulateBattleBtn.addEventListener('click', () => {
    if (!armyA.length || (!armyB.length && document.getElementById('battleType').value === 'open')) {
        battleResultDiv.textContent = 'Both armies must have at least one unit.';
        return;
    }
    const genLevelA = parseInt(document.getElementById('generalLevelA').value);
    const genTraitA = document.getElementById('generalTraitA').value;
    const genLevelB = parseInt(document.getElementById('generalLevelB').value);
    const genTraitB = document.getElementById('generalTraitB').value;
    const battleType = document.getElementById('battleType').value;
    const cityTier = battleType === 'siege' ? parseInt(document.getElementById('cityTier').value) : null;
    const result = simulateBattle(
        armyA, armyB,
        { level: genLevelA, trait: genTraitA },
        { level: genLevelB, trait: genTraitB },
        battleType, cityTier
    );
    battleResultDiv.innerHTML = `<pre class="text-left whitespace-pre-wrap">${result}</pre>`;
});
