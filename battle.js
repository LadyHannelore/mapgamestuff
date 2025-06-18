// battle.js

// Unit stats definitions
const unitStats = {
    light: { attack: 5, defense: 3 },
    heavy: { attack: 8, defense: 6 },
    ranged: { attack: 6, defense: 2 },
    cav: { attack: 7, defense: 4 },
    support: { attack: 2, defense: 8 },
    general1: { attack: 10, defense: 10 },
    general2: { attack: 9, defense: 12 }
};

// Armies
const armyA = [];
const armyB = [];

// DOM Elements
const unitTypeA = document.getElementById('unitTypeA');
const unitCountA = document.getElementById('unitCountA');
const addUnitA = document.getElementById('addUnitA');
const armyAList = document.getElementById('armyAList');

const unitTypeB = document.getElementById('unitTypeB');
const unitCountB = document.getElementById('unitCountB');
const addUnitB = document.getElementById('addUnitB');
const armyBList = document.getElementById('armyBList');

const simulateBattleBtn = document.getElementById('simulateBattle');
const battleResultDiv = document.getElementById('battleResult');

// Mapping for image extensions
const unitImageExt = { support: 'png', general1: 'png', general2: 'png' };

// Helpers
function addUnits(army, listEl, type, count) {
    for (let i = 0; i < count; i++) {
        army.push(type);
    }
    renderArmy(listEl, army);
}

function renderArmy(listEl, army) {
    // Clear existing table rows
    listEl.innerHTML = '';
    // Count units
    const counts = army.reduce((acc, unit) => {
        acc[unit] = (acc[unit] || 0) + 1;
        return acc;
    }, {});
    // Populate table rows
    for (const unit in counts) {
        const tr = document.createElement('tr');
        // Unit cell with image and name
        const tdUnit = document.createElement('td');
        tdUnit.className = 'border px-2 py-1 flex items-center gap-2';
        const ext = unitImageExt[unit] || 'jpg';
        const img = document.createElement('img');
        img.src = `images/${unit}.${ext}`;
        img.alt = unit;
        img.className = 'w-8 h-8 object-cover';
        const nameSpan = document.createElement('span');
        nameSpan.textContent = unit;
        tdUnit.appendChild(img);
        tdUnit.appendChild(nameSpan);
        // Count cell
        const tdCount = document.createElement('td');
        tdCount.className = 'border px-2 py-1 text-center';
        tdCount.textContent = counts[unit];
        // Append to row
        tr.appendChild(tdUnit);
        tr.appendChild(tdCount);
        listEl.appendChild(tr);
    }
}

// Roll a single d6
function rollDie() {
    return Math.floor(Math.random() * 6) + 1;
}

// Simulate a battle with Skirmish, Pitch, Rally, and Action Report stages
function simulateBattle(army1, army2) {
    let aUnits = [...army1];
    let bUnits = [...army2];
    const log = [];

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
    let tally = 0;
    for (let round = 1; round <= 3; round++) {
        let aPitch = 0, bPitch = 0;
        aUnits.forEach(u => aPitch += rollDie() + unitStats[u].attack);
        bUnits.forEach(u => bPitch += rollDie() + unitStats[u].attack);
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
    addUnits(armyA, armyAList, unitTypeA.value, count);
});
addUnitB.addEventListener('click', () => {
    const count = parseInt(unitCountB.value);
    addUnits(armyB, armyBList, unitTypeB.value, count);
});

// Handle battle type selection
simulateBattleBtn.addEventListener('click', () => {
    if (!armyA.length || !armyB.length) {
        battleResultDiv.textContent = 'Both armies must have at least one unit.';
        return;
    }
    const type = document.getElementById('battleType').value;
    let log;
    if (type === 'siege') {
        // Add default tier-1 city garrison for siege: 1 heavy, 2 ranged
        const siegeDefenders = [...armyB, 'heavy', 'ranged', 'ranged'];
        log = simulateBattle(armyA, siegeDefenders);
        log = `--- Siege Mode ---\n${log}`;
    } else {
        log = simulateBattle(armyA, armyB);
        log = `--- Open Battle ---\n${log}`;
    }
    battleResultDiv.innerHTML = `<pre class="text-left whitespace-pre-wrap">${log}</pre>`;
});

// Listener for running predefined GM battle
const runGMBattleBtn = document.getElementById('runGMBattle');
runGMBattleBtn.addEventListener('click', () => {
    // Clear existing armies
    armyA.length = 0;
    armyB.length = 0;
    // Bohemian Army (Army A)
    armyA.push('light'); // Light - Assault Squad
    armyA.push('heavy'); // Heavy - Artillery Detachment
    armyA.push('support'); // Support - Field Hospital
    armyA.push('support'); // Support - Combat Engineers
    armyA.push('ranged'); // Ranged - Sharpshooters
    // Austrian Garrison (Army B)
    armyB.push('heavy');
    armyB.push('ranged');
    armyB.push('ranged');
    // Update UI
    renderArmy(armyAList, armyA);
    renderArmy(armyBList, armyB);
    // Simulate as open battle
    const log = simulateBattle(armyA, armyB);
    battleResultDiv.innerHTML = `<pre class="text-left whitespace-pre-wrap">--- GM Battle ---\n${log}</pre>`;
});
