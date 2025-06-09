// main.js - Basic SPA logic

export function main() {
    const app = document.getElementById('app');
    if (!app) return;    app.innerHTML = `
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; background: #f5f5f5; }
            .form-section { margin-bottom: 1.5rem; background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            .brigade-form { background: linear-gradient(135deg, #f9f9f9, #e9f5ff); border: 2px solid #ddd; }
            .general-form { background: linear-gradient(135deg, #f1f7ff, #e8f4ff); border: 2px solid #b3d9ff; }
            .army-form { background: linear-gradient(135deg, #f9fff1, #f0fff0); border: 2px solid #c8e6c8; }
            .battle-form { background: linear-gradient(135deg, #fff6f6, #ffe8e8); border: 2px solid #ffb3b3; }
            label { display: inline-block; margin: 0.5rem 1rem 0.5rem 0; font-weight: 500; }
            input, select { padding: 0.5rem; border: 1px solid #ccc; border-radius: 6px; font-size: 14px; }
            button { padding: 0.7rem 1.2rem; border: none; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
            button[type="submit"] { background: #007bff; color: white; }
            button[type="submit"]:hover { background: #0056b3; }
            .battle-btn { background: #dc3545; color: white; }
            .battle-btn:hover { background: #a71e2a; }
            .list-section { background: white; padding: 1rem; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
            ul { list-style: none; padding: 0; }
            li { padding: 0.5rem; margin: 0.3rem 0; background: #f8f9fa; border-radius: 6px; border-left: 4px solid #007bff; }
        </style>
        <header style="background: linear-gradient(135deg, #222, #444); color: white; padding: 1.5rem 0; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.3);">
            <h1 style="margin: 0; font-size: 2rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">⚔️ Map Game</h1>
        </header>
        <nav style="background: white; padding: 1rem 0; text-align: center; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <a href="#info" id="info-link" style="margin: 0 2rem; color: #007bff; text-decoration: none; font-weight: 500; padding: 0.5rem 1rem; border-radius: 20px; transition: all 0.2s;">📚 Info</a>
            <a href="#simulator" id="sim-link" style="margin: 0 2rem; color: #007bff; text-decoration: none; font-weight: 500; padding: 0.5rem 1rem; border-radius: 20px; transition: all 0.2s;">⚔️ Simulator</a>
        </nav>
        <main id="view" style="max-width: 1000px; margin: 2rem auto; padding: 1rem;"></main>
    `;

    function render(route) {
        const view = document.getElementById('view');
        if (!view) return;
        if (route === 'simulator') {
            view.innerHTML = `                <h2>🎲 Mock Battle Simulator</h2>
                <form id="brigade-form" class="form-section brigade-form">                    <h3>🪖 Create Brigade</h3>
                    <label>
                        Brigade Type:
                        <select id="brigade-type">
                            <option value="Cavalry">🐴 Cavalry</option>
                            <option value="Heavy">⚔️ Heavy</option>
                            <option value="Light">🪓 Light</option>
                            <option value="Ranged">🏹 Ranged</option>
                            <option value="Support">🛡️ Support</option>
                        </select>                    </label>
                    <label>
                        Enhancement:
                        <input type="text" id="brigade-enhancement" placeholder="e.g. Lancers, Rangers, Marines..." />
                    </label>
                    <button type="submit">Add Brigade</button>                </form>
                <div id="brigade-list" class="list-section">
                    <h3>Created Brigades</h3>
                    <ul id="brigades-ul"></ul>
                </div>
                
                <form id="general-form" class="form-section general-form">                    <h3>👑 Create General</h3>
                    <label>
                        General Name:
                        <input type="text" id="general-name" placeholder="e.g. Alexander" required />
                    </label>
                    <label style="margin-left:1rem;">
                        Trait:
                        <input type="text" id="general-trait" placeholder="e.g. Brilliant, Bold..." required />
                    </label>
                    <button type="submit" style="margin-left:1rem;">Add General</button>
                </form>
                <div id="general-list">
                    <h3>Created Generals</h3>
                    <ul id="generals-ul"></ul>
                </div>
                <hr style="margin:2rem 0;">
                <form id="army-form" style="margin-bottom:1.5rem;background:#f9fff1;padding:1rem;border-radius:8px;">
                    <h3>Create Army</h3>
                    <label>
                        General:
                        <select id="army-general"></select>
                    </label>
                    <label style="margin-left:1rem;vertical-align:top;">
                        Brigades (up to 8):<br>
                        <select id="army-brigades" multiple size="5" style="min-width:180px;"></select>
                    </label>
                    <button type="submit" style="margin-left:1rem;">Create Army</button>
                </form>                <div id="army-list">
                    <h3>Created Armies</h3>
                    <ul id="armies-ul"></ul>                    <div style="margin-top:1rem;">
                        <button type="button" id="load-samples-btn" style="background:#28a745;color:white;padding:0.7rem 1.2rem;border:none;border-radius:6px;cursor:pointer;">
                            🎯 Load 10 Sample Armies
                        </button>
                        <button type="button" id="save-armies-btn" style="background:#007bff;color:white;padding:0.7rem 1.2rem;border:none;border-radius:6px;cursor:pointer;margin-left:1rem;">
                            💾 Save Armies
                        </button>
                        <button type="button" id="load-armies-btn" style="background:#6c757d;color:white;padding:0.7rem 1.2rem;border:none;border-radius:6px;cursor:pointer;margin-left:1rem;">
                            📁 Load Armies
                        </button>
                        <button type="button" id="clear-all-btn" style="background:#dc3545;color:white;padding:0.7rem 1.2rem;border:none;border-radius:6px;cursor:pointer;margin-left:1rem;">
                            🗑️ Clear All
                        </button>
                        <br><small style="color:#666;">Pre-built armies for testing battles | Save/Load your custom armies</small>
                    </div>
                </div>
                <hr style="margin:2rem 0;">
                <form id="battle-form" style="margin-bottom:1.5rem;background:#fff6f6;padding:1rem;border-radius:8px;">
                    <h3>Simulate Battle</h3>
                    <label>
                        Army 1:
                        <select id="battle-army1"></select>
                    </label>
                    <label style="margin-left:1rem;">
                        Army 2:
                        <select id="battle-army2"></select>                    </label>
                    <button type="submit" style="margin-left:1rem;">Show Army Details</button>
                    <button type="button" id="simulate-battle-btn" style="margin-left:1rem;background:#d44;color:white;">Simulate Full Battle</button>
                </form>
                <div id="battle-result"></div>
            `;            // State
            const brigades = [];
            const generals = [];
            const armies = [];
            
            // Sample armies for testing
            const sampleArmies = [
                {
                    name: "The Swift Raiders",
                    general: { name: "Commander Swift", trait: "Merciless" },
                    brigades: [
                        { type: "Cavalry", enhancement: "Lancers" },
                        { type: "Ranged", enhancement: "Sharpshooters" },
                        { type: "Support", enhancement: "Field Hospital" }
                    ]
                },
                {
                    name: "The Siegebreakers",
                    general: { name: "General Hammer", trait: "Relentless" },
                    brigades: [
                        { type: "Heavy", enhancement: "Artillery Team" },
                        { type: "Light", enhancement: "Rangers" },
                        { type: "Ranged", enhancement: "Mortar Team" },
                        { type: "Support", enhancement: "Combat Engineers" },
                        { type: "Cavalry", enhancement: "Dragoons" }
                    ]
                },
                {
                    name: "The Iron Wall",
                    general: { name: "Marshal Stone", trait: "Resolute" },
                    brigades: [
                        { type: "Heavy", enhancement: "Stormtroopers" },
                        { type: "Heavy", enhancement: "Grenadiers" },
                        { type: "Heavy", enhancement: "Guard" },
                        { type: "Support", enhancement: "Field Hospital" },
                        { type: "Support", enhancement: "Officer Corps" },
                        { type: "Ranged", enhancement: "Mobile Platforms" },
                        { type: "Ranged", enhancement: "Sharpshooters" }
                    ]
                },
                {
                    name: "The Vanguard",
                    general: { name: "Lord Commander", trait: "Prodigious" },
                    brigades: [
                        { type: "Cavalry", enhancement: "Life Guard" },
                        { type: "Cavalry", enhancement: "Lancers" },
                        { type: "Cavalry", enhancement: "Dragoons" },
                        { type: "Cavalry", enhancement: "Stormtroopers" },
                        { type: "Heavy", enhancement: "Artillery Team" },
                        { type: "Heavy", enhancement: "Grenadiers" },
                        { type: "Support", enhancement: "Officer Corps" },
                        { type: "Ranged", enhancement: "Sharpshooters" }
                    ]
                },
                {
                    name: "The Guerrilla Strike",
                    general: { name: "Captain Shadow", trait: "Inspiring" },
                    brigades: [
                        { type: "Light", enhancement: "Assault Team" },
                        { type: "Light", enhancement: "Commando" },
                        { type: "Light", enhancement: "Rangers" },
                        { type: "Support", enhancement: "Field Hospital" },
                        { type: "Support", enhancement: "Officer Corps" }
                    ]
                },
                {
                    name: "The Artillery Barrage",
                    general: { name: "General Cannon", trait: "Brilliant" },
                    brigades: [
                        { type: "Heavy", enhancement: "Artillery Team" },
                        { type: "Heavy", enhancement: "Grenadiers" },
                        { type: "Heavy", enhancement: "Stormtroopers" },
                        { type: "Heavy", enhancement: "Guard" },
                        { type: "Ranged", enhancement: "Mortar Team" },
                        { type: "Ranged", enhancement: "Sharpshooters" },
                        { type: "Support", enhancement: "Field Hospital" }
                    ]
                },
                {
                    name: "The Sky Pirates",
                    general: { name: "Admiral Storm", trait: "Mariner" },
                    brigades: [
                        { type: "Cavalry", enhancement: "Marines" },
                        { type: "Cavalry", enhancement: "Marines" },
                        { type: "Support", enhancement: "Combat Engineers" }
                    ]
                },
                {
                    name: "The Holy Avengers",
                    general: { name: "High Paladin", trait: "Zealous" },
                    brigades: [
                        { type: "Support", enhancement: "Officer Corps" },
                        { type: "Support", enhancement: "Field Hospital" },
                        { type: "Support", enhancement: "Combat Engineers" },
                        { type: "Support", enhancement: "Sentry Team" },
                        { type: "Ranged", enhancement: "Sharpshooters" },
                        { type: "Ranged", enhancement: "Mortar Team" },
                        { type: "Light", enhancement: "Assault Team" },
                        { type: "Heavy", enhancement: "Artillery Team" }
                    ]
                },
                {
                    name: "The Trench Busters",
                    general: { name: "Colonel Blitz", trait: "Brutal" },
                    brigades: [
                        { type: "Cavalry", enhancement: "Lancers" },
                        { type: "Cavalry", enhancement: "Stormtroopers" },
                        { type: "Heavy", enhancement: "Artillery Team" },
                        { type: "Heavy", enhancement: "Grenadiers" },
                        { type: "Support", enhancement: "Combat Engineers" }
                    ]
                },
                {
                    name: "The Unyielding Charge",
                    general: { name: "Hero King", trait: "Heroic" },
                    brigades: [
                        { type: "Cavalry", enhancement: "Dragoons" },
                        { type: "Cavalry", enhancement: "Stormtroopers" },
                        { type: "Cavalry", enhancement: "Life Guard" },
                        { type: "Heavy", enhancement: "Stormtroopers" },
                        { type: "Heavy", enhancement: "Grenadiers" },
                        { type: "Support", enhancement: "Officer Corps" },
                        { type: "Support", enhancement: "Combat Engineers" }
                    ]
                }
            ];
            
            const form = document.getElementById('brigade-form');
            const ul = document.getElementById('brigades-ul');
            const generalForm = document.getElementById('general-form');
            const generalsUl = document.getElementById('generals-ul');            const armyForm = document.getElementById('army-form');
            const armyGeneralSelect = document.getElementById('army-general');
            const armyBrigadesSelect = document.getElementById('army-brigades');
            const armiesUl = document.getElementById('armies-ul');
            const battleForm = document.getElementById('battle-form');
            const battleArmy1 = document.getElementById('battle-army1');
            const battleArmy2 = document.getElementById('battle-army2');            const battleResult = document.getElementById('battle-result');
            const simulateBattleBtn = document.getElementById('simulate-battle-btn');
            const loadSamplesBtn = document.getElementById('load-samples-btn');
            const saveArmiesBtn = document.getElementById('save-armies-btn');
            const loadArmiesBtn = document.getElementById('load-armies-btn');
            const clearAllBtn = document.getElementById('clear-all-btn');

            // Brigade stats based on type
            const brigadeStats = {
                'Cavalry': { skirmish: 1, defense: 0, pitch: 1, rally: 0, move: 5 },
                'Heavy': { skirmish: 0, defense: 2, pitch: 1, rally: 1, move: 3 },
                'Light': { skirmish: 2, defense: 0, pitch: 0, rally: 1, move: 4 },
                'Ranged': { skirmish: 0, defense: 2, pitch: 1, rally: 0, move: 4 },
                'Support': { skirmish: 0, defense: 2, pitch: 0, rally: 1, move: 4 }
            };

            function rollDice() {
                return Math.floor(Math.random() * 6) + 1;
            }            function getBrigadeStats(brigade) {
                const baseStats = brigadeStats[brigade.type] || { skirmish: 0, defense: 0, pitch: 0, rally: 0, move: 0 };
                let enhancedStats = { ...baseStats };
                
                // Apply enhancement bonuses
                if (brigade.enhancement) {
                    const enhancement = brigade.enhancement.toLowerCase();
                    
                    // Specific enhancements
                    if (enhancement.includes('ranger') || enhancement.includes('scout')) {
                        enhancedStats.skirmish += 1;
                    }
                    if (enhancement.includes('lancer') || enhancement.includes('spear')) {
                        enhancedStats.pitch += 1;
                    }
                    if (enhancement.includes('guard') || enhancement.includes('shield')) {
                        enhancedStats.defense += 1;
                    }
                    if (enhancement.includes('veteran') || enhancement.includes('elite')) {
                        enhancedStats.rally += 1;
                    }
                    if (enhancement.includes('marine')) {
                        enhancedStats.defense += 1;
                        enhancedStats.rally += 1;
                    }
                    if (enhancement.includes('sentry')) {
                        enhancedStats.skirmish += 1;
                        enhancedStats.defense += 1;
                    }
                    // Additional specific enhancements from sample armies
                    if (enhancement.includes('sharpshooter')) {
                        enhancedStats.defense += 2;
                    }
                    if (enhancement.includes('artillery')) {
                        enhancedStats.pitch += 1;
                        enhancedStats.defense -= 1; // Artillery teams reduce enemy defense
                    }
                    if (enhancement.includes('grenadier')) {
                        enhancedStats.skirmish += 2;
                        enhancedStats.pitch += 2;
                    }
                    if (enhancement.includes('stormtrooper')) {
                        enhancedStats.pitch += 1;
                        enhancedStats.rally += 1;
                    }
                    if (enhancement.includes('dragoon')) {
                        enhancedStats.pitch += 1;
                        enhancedStats.rally += 1;
                    }
                    if (enhancement.includes('assault team')) {
                        enhancedStats.skirmish += 1; // Choose skirmish targets
                    }
                    if (enhancement.includes('commando')) {
                        enhancedStats.skirmish += 2; // Invisible to sentries
                    }
                    if (enhancement.includes('mortar')) {
                        enhancedStats.pitch += 1; // Negate enemy garrison
                    }
                    if (enhancement.includes('life guard')) {
                        enhancedStats.defense += 1;
                        enhancedStats.rally += 1;
                    }
                    if (enhancement.includes('mobile platform')) {
                        enhancedStats.defense += 2;
                        // +1 Movement would be handled separately
                    }
                    if (enhancement.includes('officer corps')) {
                        enhancedStats.rally += 2; // Choose retreat direction
                    }
                    if (enhancement.includes('field hospital')) {
                        enhancedStats.rally += 1; // Reroll destruction dice
                    }
                    if (enhancement.includes('combat engineer')) {
                        enhancedStats.defense += 1; // Siege abilities
                    }
                }
                
                return enhancedStats;
            }            function getGeneralBonus(general) {
                let bonus = 3; // Base level 3 general
                const trait = general.trait.toLowerCase();
                
                // Standard traits
                if (trait.includes('brilliant') || trait.includes('genius')) {
                    bonus += 2; // Extra tactical bonus
                }
                if (trait.includes('bold') || trait.includes('aggressive')) {
                    bonus += 1; // Extra combat bonus
                }
                if (trait.includes('defensive') || trait.includes('cautious')) {
                    bonus += 1; // Extra rally bonus for their army
                }
                
                // Sample army specific traits
                if (trait.includes('merciless')) {
                    bonus += 1; // Enemy brigades destroyed on 1-3
                }
                if (trait.includes('relentless')) {
                    bonus += 1; // +1 Movement, pursue retreating enemies
                }
                if (trait.includes('resolute')) {
                    bonus += 2; // +3 Defense to all brigades (simplified as general bonus)
                }
                if (trait.includes('prodigious')) {
                    bonus += 2; // +2 levels, boosting Pitch/Rally
                }
                if (trait.includes('inspiring')) {
                    bonus += 1; // Free Rally reroll, +2 Rally on celebrate
                }
                if (trait.includes('mariner')) {
                    bonus += 1; // +1 embarked movement, siege from landing
                }
                if (trait.includes('zealous')) {
                    bonus += 1; // +1 Rally, +2 Rally/+1 Pitch in Holy Wars
                }
                if (trait.includes('brutal')) {
                    bonus += 1; // Pillage 5-6, Raze = Sack
                }
                if (trait.includes('heroic')) {
                    bonus += 2; // +1 Rally, revive losing battles
                }
                
                return bonus;
            }

            async function simulateBattle(army1, army2) { // Make simulateBattle async
                const g1 = generals[army1.general];
                const g2 = generals[army2.general];
                const initialBrigades1 = army1.brigades.map(idx => ({ ...brigades[idx], id: idx, army: 1, status: 'active' }));
                const initialBrigades2 = army2.brigades.map(idx => ({ ...brigades[idx], id: idx, army: 2, status: 'active' }));
                
                let log = [];

                log.push(`<div style="text-align:center;background:linear-gradient(45deg,#1a237e,#42a5f5);color:white;padding:1rem;border-radius:8px;margin-bottom:1rem;">`);
                log.push(`<h3 style="margin:0;">⚔️ BATTLE BEGINS ⚔️</h3>`);
                log.push(`</div>`);

                const formatBrigadeForLog = (b) => `${b.type}${b.enhancement ? ` (${b.enhancement})` : ''}`;

                log.push(`<h4>Army 1: ${g1.name} (${g1.trait})</h4>`);
                log.push(`<ul>`);
                initialBrigades1.forEach(b => log.push(`<li>${formatBrigadeForLog(b)}</li>`));
                log.push(`</ul>`);

                log.push(`<h4>Army 2: ${g2.name} (${g2.trait})</h4>`);
                log.push(`<ul>`);
                initialBrigades2.forEach(b => log.push(`<li>${formatBrigadeForLog(b)}</li>`));
                log.push(`</ul><hr>`);
                
                let activeBrigades1 = [...initialBrigades1];
                let activeBrigades2 = [...initialBrigades2];
                
                let generalLevel1 = getGeneralBonus(g1); // Assuming general level is part of bonus
                let generalLevel2 = getGeneralBonus(g2);
                
                let battleWinner = null; // 1 for army1, 2 for army2

                // --- SKIRMISH STAGE ---
                log.push('<h5 style="color:#007bff;">Skirmish Stage</h5>');
                log.push('<p>Each side selects the 2 best brigades available as Skirmishers.</p>');

                const getSkirmishers = (brigadeList) => {
                    return brigadeList
                        .filter(b => b.status === 'active')
                        .map(b => ({ brigade: b, stats: getBrigadeStats(b) }))
                        .sort((a, b) => b.stats.skirmish - a.stats.skirmish)
                        .slice(0, 2);
                };

                let skirmishers1 = getSkirmishers(activeBrigades1);
                let skirmishers2 = getSkirmishers(activeBrigades2);
                
                log.push(`<h6>Army 1 Skirmishers:</h6>`);
                if (skirmishers1.length > 0) {
                    skirmishers1.forEach(s => log.push(`- ${formatBrigadeForLog(s.brigade)} (Skirmish: ${s.stats.skirmish})`));
                } else {
                    log.push('- None');
                }
                log.push(`<h6>Army 2 Skirmishers:</h6>`);
                if (skirmishers2.length > 0) {
                    skirmishers2.forEach(s => log.push(`- ${formatBrigadeForLog(s.brigade)} (Skirmish: ${s.stats.skirmish})`));
                } else {
                    log.push('- None');
                }

                const performSkirmishAttack = (attackerInfo, targetArmy, attackerArmyNum) => {
                    if (targetArmy.filter(b => b.status === 'active').length === 0) {
                        log.push(`- ${formatBrigadeForLog(attackerInfo.brigade)} has no targets left in Army ${attackerArmyNum === 1 ? 2 : 1}.`);
                        return;
                    }
                    const availableTargets = targetArmy.filter(b => b.status === 'active');
                    const targetBrigadeObj = availableTargets[Math.floor(Math.random() * availableTargets.length)];
                    const targetStats = getBrigadeStats(targetBrigadeObj);
                    
                    const skirmishRoll = rollDice() + attackerInfo.stats.skirmish;
                    const defenseRoll = rollDice() + targetStats.defense;
                    
                    log.push(`<p>${formatBrigadeForLog(attackerInfo.brigade)} (Army ${attackerArmyNum}) attacks ${formatBrigadeForLog(targetBrigadeObj)} (Army ${attackerArmyNum === 1 ? 2 : 1}).</p>`);
                    log.push(`&nbsp;&nbsp;Rolls: Skirmish ${skirmishRoll} (d6 + ${attackerInfo.stats.skirmish}) vs Defense ${defenseRoll} (d6 + ${targetStats.defense})`);
                    
                    if (skirmishRoll > defenseRoll) {
                        log.push(`&nbsp;&nbsp;<strong style="color:red;">${formatBrigadeForLog(targetBrigadeObj)} is routed!</strong> (Skips initial pitch phase)`);
                        targetBrigadeObj.status = 'routed_skirmish';
                    } else {
                        log.push(`&nbsp;&nbsp;Attack has no effect.`);
                    }
                };

                log.push('<h6>Army 1 Skirmish Actions:</h6>');
                skirmishers1.forEach(s => performSkirmishAttack(s, activeBrigades2, 1));
                
                log.push('<h6>Army 2 Skirmish Actions:</h6>');
                skirmishers2.forEach(s => performSkirmishAttack(s, activeBrigades1, 2));
                log.push('<hr>');

                // Main Battle Loop (Pitch -> Rally)
                let pitchTally = 0;
                let battleRound = 0;

                while (true) {
                    battleRound++;
                    log.push(`<h5 style="color:#dc3545;">Battle Cycle ${battleRound}</h5>`);
                    
                    // --- PITCH STAGE ---
                    log.push('<h5 style="color:#28a745;">Pitch Stage</h5>');
                    pitchTally = 0; // Reset for new Pitch cycle if coming from Rally

                    for (let round = 1; round <= 3; round++) {
                        log.push(`<h6>Pitch Round ${round} (of 3)</h6>`);
                        log.push(`<p><em>Simulating round... (10s delay)</em></p>`);
                        await new Promise(resolve => setTimeout(resolve, 10000)); // 10-second delay

                        let pitch1 = 0;
                        log.push('<div><strong>Army 1 Pitch:</strong></div>');
                        log.push('<table><tr><th>Brigade</th><th>Roll (d6)</th><th>Pitch Bonus</th><th>Total</th></tr>');
                        activeBrigades1.filter(b => b.status === 'active').forEach(brigade => {
                            const roll = rollDice();
                            const stats = getBrigadeStats(brigade);
                            const brigadePitch = roll + stats.pitch;
                            pitch1 += brigadePitch;
                            log.push(`<tr><td>${formatBrigadeForLog(brigade)}</td><td>${roll}</td><td>${stats.pitch}</td><td>${brigadePitch}</td></tr>`);
                        });
                        log.push(`<tr><td colspan="3">General ${g1.name} Bonus</td><td>${generalLevel1}</td></tr>`);
                        pitch1 += generalLevel1;
                        log.push(`<tr><td colspan="3"><strong>Army 1 Total Pitch</strong></td><td><strong>${pitch1}</strong></td></tr></table>`);

                        let pitch2 = 0;
                        log.push('<div><strong>Army 2 Pitch:</strong></div>');
                        log.push('<table><tr><th>Brigade</th><th>Roll (d6)</th><th>Pitch Bonus</th><th>Total</th></tr>');
                        activeBrigades2.filter(b => b.status === 'active').forEach(brigade => {
                            const roll = rollDice();
                            const stats = getBrigadeStats(brigade);
                            const brigadePitch = roll + stats.pitch;
                            pitch2 += brigadePitch;
                            log.push(`<tr><td>${formatBrigadeForLog(brigade)}</td><td>${roll}</td><td>${stats.pitch}</td><td>${brigadePitch}</td></tr>`);
                        });
                        log.push(`<tr><td colspan="3">General ${g2.name} Bonus</td><td>${generalLevel2}</td></tr>`);
                        pitch2 += generalLevel2;
                        log.push(`<tr><td colspan="3"><strong>Army 2 Total Pitch</strong></td><td><strong>${pitch2}</strong></td></tr></table>`);
                        
                        const roundResult = pitch1 - pitch2; // Army 1 is "Positive", Army 2 is "Negative"
                        pitchTally += roundResult;
                        log.push(`<p>Pitch Round ${round} Result: ${pitch1} (Army 1) - ${pitch2} (Army 2) = ${roundResult}</p>`);
                        log.push(`<p><strong>Current Pitch Tally: ${pitchTally}</strong></p><hr class="dotted">`);

                        if (round < 3 && (pitchTally >= 20 || pitchTally <= -20)) {
                            log.push(`<p>Pitch Tally reached decisive threshold early.</p>`);
                            break; // End pitch rounds early if threshold met
                        }
                    }
                    log.push('<hr>');

                    if (pitchTally >= 20) {
                        log.push(`<h5 style="color:green;">${g1.name} (Army 1) wins the Pitch! (Tally: ${pitchTally})</h5>`);
                        battleWinner = 1;
                        break; // Skips Rally, go to Action Report
                    } else if (pitchTally <= -20) {
                        log.push(`<h5 style="color:green;">${g2.name} (Army 2) wins the Pitch! (Tally: ${pitchTally})</h5>`);
                        battleWinner = 2;
                        break; // Skips Rally, go to Action Report
                    } else {
                        log.push(`<p>Pitch Tally (${pitchTally}) is between -19 and 19. Proceeding to Rally Stage.</p>`);
                        // --- RALLY STAGE ---
                        log.push('<h5 style="color:#ffc107;">Rally Stage</h5>');
                        
                        const performRally = (armyBrigades, armyNum) => {
                            log.push(`<h6>Army ${armyNum} Rally:</h6>`);
                            log.push('<table><tr><th>Brigade</th><th>Roll (d6)</th><th>Rally Bonus</th><th>Total</th><th>Outcome</th></tr>');
                            let remainingBrigades = 0;
                            armyBrigades.forEach(brigade => {
                                if (brigade.status === 'active' || brigade.status === 'routed_skirmish') { // Routed in skirmish also try to rally
                                    const roll = rollDice();
                                    const stats = getBrigadeStats(brigade);
                                    const rallyTotal = roll + stats.rally;
                                    let outcome;
                                    if (rallyTotal >= 5) {
                                        outcome = '<span style="color:green;">Stays</span>';
                                        brigade.status = 'active'; // Rallied or stayed active
                                        remainingBrigades++;
                                    } else {
                                        outcome = '<span style="color:red;">Routs</span>';
                                        brigade.status = 'routed_rally';
                                    }
                                    log.push(`<tr><td>${formatBrigadeForLog(brigade)}</td><td>${roll}</td><td>${stats.rally}</td><td>${rallyTotal}</td><td>${outcome}</td></tr>`);
                                } else if (brigade.status === 'routed_rally') { // Already routed in a previous rally this battle cycle
                                     log.push(`<tr><td>${formatBrigadeForLog(brigade)}</td><td colspan="3">Previously Routed</td><td><span style="color:red;">Routed</span></td></tr>`);
                                }
                            });
                            log.push('</table>');
                            return remainingBrigades;
                        };

                        const remaining1 = performRally(activeBrigades1, 1);
                        const remaining2 = performRally(activeBrigades2, 2);

                        activeBrigades1 = activeBrigades1.filter(b => b.status === 'active');
                        activeBrigades2 = activeBrigades2.filter(b => b.status === 'active');

                        log.push(`<p>Army 1 has ${remaining1} brigades remaining. Army 2 has ${remaining2} brigades remaining.</p>`);

                        if (remaining1 === 0 && remaining2 > 0) {
                            log.push(`<h5 style="color:green;">All Army 1 brigades routed! ${g2.name} (Army 2) wins!</h5>`);
                            battleWinner = 2;
                            break; 
                        } else if (remaining2 === 0 && remaining1 > 0) {
                            log.push(`<h5 style="color:green;">All Army 2 brigades routed! ${g1.name} (Army 1) wins!</h5>`);
                            battleWinner = 1;
                            break;
                        } else if (remaining1 === 0 && remaining2 === 0) {
                            log.push(`<h5 style="color:orange;">Mutual destruction! Both armies routed! It's a draw!</h5>`);
                            battleWinner = 0; // Draw
                            break;
                        } else {
                            log.push(`<p>Both sides have brigades remaining. Starting a new Pitch Stage (Pitch Tally resets to 0).</p><hr>`);
                            // Loop continues to a new Pitch Stage
                        }
                    }
                } // End of main battle while(true) loop
                
                // --- ACTION REPORT ---
                log.push('<hr><h5 style="color:#6f42c1;">Action Report</h5>');
                if (battleWinner === null || battleWinner === 0) { // Draw or no winner from pitch/rally somehow
                    log.push("<p>The battle ended inconclusively or as a draw. No victor for rerolls.</p>");
                } else {
                    log.push(`<p><strong>Victor: Army ${battleWinner} (${battleWinner === 1 ? g1.name : g2.name})</strong>. Victorious player may reroll once for each brigade and general casualty/promotion roll.</p>`);
                }


                const performCasualtyRolls = (armyBrigades, armyNum, isVictor) => {
                    log.push(`<h6>Army ${armyNum} Casualties:</h6>`);
                    log.push('<table><tr><th>Brigade</th><th>Initial Roll (d6)</th><th>Outcome</th><th>Reroll (d6)</th><th>Final Outcome</th></tr>');
                    let destroyedCount = 0;
                    armyBrigades.forEach(brigade => {
                        if (brigade.status === 'destroyed') { // Already marked destroyed (e.g. Lancers enhancement)
                             log.push(`<tr><td>${formatBrigadeForLog(brigade)}</td><td colspan="2">Previously Destroyed</td><td>-</td><td><strong style="color:darkred;">Destroyed</strong></td></tr>`);
                             destroyedCount++;
                             return;
                        }
                        let initialRoll = rollDice();
                        let initialOutcome = (initialRoll <= 2) ? '<strong style="color:darkred;">Destroyed</strong>' : '<span style="color:green;">Survived</span>';
                        let finalOutcome = initialOutcome;
                        let rerollInfo = '-';

                        if (initialRoll <= 2 && isVictor) { // Brigade destroyed AND is victor
                            log.push(`<tr><td>${formatBrigadeForLog(brigade)}</td><td>${initialRoll}</td><td>${initialOutcome}</td><td><em>Victor Reroll...</em></td><td></td></tr>`);
                            let reroll = rollDice();
                            finalOutcome = (reroll <= 2) ? '<strong style="color:darkred;">Destroyed (after reroll)</strong>' : '<span style="color:green;">Survived (after reroll)</span>';
                            rerollInfo = `${reroll}`;
                        }
                        
                        if (finalOutcome.includes("Destroyed")) {
                            brigade.status = 'destroyed';
                            destroyedCount++;
                        }
                        log.push(`<tr><td>${formatBrigadeForLog(brigade)}</td><td>${initialRoll}</td><td>${initialOutcome}</td><td>${rerollInfo}</td><td>${finalOutcome}</td></tr>`);
                    });
                    log.push('</table>');
                    return destroyedCount;
                };

                const destroyed1 = performCasualtyRolls(initialBrigades1, 1, battleWinner === 1);
                const destroyed2 = performCasualtyRolls(initialBrigades2, 2, battleWinner === 2);

                // General Promotions/Captures
                log.push('<h6>General Outcomes:</h6>');
                log.push('<table><tr><th>General</th><th>Initial Roll (d6)</th><th>Outcome</th><th>Reroll (d6)</th><th>Final Outcome</th></tr>');

                const performGeneralRoll = (general, armyNum, isVictor) => {
                    let initialRoll = rollDice();
                    let initialOutcomeText = "";
                    if (initialRoll === 1) initialOutcomeText = '<strong style="color:darkred;">Captured!</strong>';
                    else if (initialRoll >= 5) initialOutcomeText = '<strong style="color:blue;">Promoted!</strong>';
                    else initialOutcomeText = 'Nothing';

                    let finalOutcomeText = initialOutcomeText;
                    let rerollInfo = '-';

                    if (isVictor && (initialRoll === 1 || initialRoll < 5 && initialRoll > 1) ) { // Reroll if captured, or if not promoted (and not a 1 already if that matters)
                        // Victor can reroll any non-promotion, or a capture
                        log.push(`<tr><td>${general.name} (Army ${armyNum})</td><td>${initialRoll}</td><td>${initialOutcomeText}</td><td><em>Victor Reroll...</em></td><td></td></tr>`);
                        let reroll = rollDice();
                        if (reroll === 1) finalOutcomeText = '<strong style="color:darkred;">Captured! (after reroll)</strong>';
                        else if (reroll >= 5) finalOutcomeText = '<strong style="color:blue;">Promoted! (after reroll)</strong>';
                        else finalOutcomeText = 'Nothing (after reroll)';
                        rerollInfo = `${reroll}`;
                    }
                     log.push(`<tr><td>${general.name} (Army ${armyNum})</td><td>${initialRoll}</td><td>${initialOutcomeText}</td><td>${rerollInfo}</td><td>${finalOutcomeText}</td></tr>`);
                };

                performGeneralRoll(g1, 1, battleWinner === 1);
                performGeneralRoll(g2, 2, battleWinner === 2);
                log.push('</table>');
                
                log.push(`<br><div style="background:#e9ecef;padding:0.5rem;border-radius:4px;"><strong>Final Results:</strong></div>`);
                log.push(`Army 1 (${g1.name}) casualties: ${destroyed1}/${initialBrigades1.length}`);
                log.push(`Army 2 (${g2.name}) casualties: ${destroyed2}/${initialBrigades2.length}`);
                
                if (battleWinner === 1) {
                    log.push(`<strong style="color:green;">Army 1 (${g1.name}) is Victorious!</strong>`);
                } else if (battleWinner === 2) {
                    log.push(`<strong style="color:green;">Army 2 (${g2.name}) is Victorious!</strong>`);
                } else if (battleWinner === 0) {
                     log.push(`<strong style="color:orange;">The battle is a Draw!</strong>`);
                } else {
                    log.push(`<strong style="color:gray;">Battle ended without a clear victor.</strong>`);
                }
                
                return log.join(''); // Return as a single HTML string
            }

            if (battleForm) {
                battleForm.onsubmit = (e) => {
                    e.preventDefault();
                    if (!battleArmy1 || !battleArmy2) return;
                    const idx1 = parseInt(battleArmy1.value);
                    const idx2 = parseInt(battleArmy2.value);
                    if (isNaN(idx1) || isNaN(idx2) || idx1 === idx2) {
                        battleResult.innerHTML = '<span style="color:#c00;">Select two different armies.</span>';
                        return;
                    }
                    const a1 = armies[idx1];
                    const a2 = armies[idx2];
                    const g1 = generals[a1.general];
                    const g2 = generals[a2.general];
                    const b1 = a1.brigades.map(idx => {
                        const b = brigades[idx];
                        return `${b.type}${b.enhancement ? ` — ${b.enhancement}` : ''}`;
                    }).join(', ');
                    const b2 = a2.brigades.map(idx => {
                        const b = brigades[idx];
                        return `${b.type}${b.enhancement ? ` — ${b.enhancement}` : ''}`;
                    }).join(', ');                    battleResult.innerHTML = `
                        <div style="background:#f9f9f9;padding:1rem;border-radius:8px;">
                            <h4>Army 1: <b>${g1.name}</b> (${g1.trait})</h4>
                            <div>Brigades: ${b1}</div>
                            <hr>
                            <h4>Army 2: <b>${g2.name}</b> (${g2.trait})</h4>
                            <div>Brigades: ${b2}</div>
                        </div>
                    `;
                    battleResult.style.display = 'block';
                };

                if (simulateBattleBtn) {
                    simulateBattleBtn.onclick = async () => { // Make onclick async
                        if (!battleArmy1 || !battleArmy2) return;
                        const idx1 = parseInt(battleArmy1.value);
                        const idx2 = parseInt(battleArmy2.value);
                        if (isNaN(idx1) || isNaN(idx2) || idx1 === idx2) {
                            battleResult.innerHTML = '<span style="color:#c00;">Select two different armies.</span>';
                            return;
                        }
                        const a1 = armies[idx1];
                        const a2 = armies[idx2];
                        
                        // Disable button during simulation
                        simulateBattleBtn.disabled = true;
                        simulateBattleBtn.textContent = 'Simulating...';

                        const battleLog = await simulateBattle(a1, a2); // await the simulation
                        
                        battleResult.innerHTML = `
                            <div style="background:#f9f9f9;padding:1rem;border-radius:8px;max-height:600px;overflow-y:auto;">
                                ${battleLog}
                            </div>
                        `;
                        battleResult.style.display = 'block';

                        // Re-enable button
                        simulateBattleBtn.disabled = false;
                        simulateBattleBtn.textContent = 'Simulate Full Battle';
                    };
                }
            }

            form.onsubmit = (e) => {
                e.preventDefault();
                const type = document.getElementById('brigade-type').value;
                const enhancement = document.getElementById('brigade-enhancement').value.trim();
                brigades.push({ type, enhancement });
                renderBrigades();
                renderArmies();
                form.reset();
            };

            generalForm.onsubmit = (e) => {
                e.preventDefault();
                const name = document.getElementById('general-name').value.trim();
                const trait = document.getElementById('general-trait').value.trim();
                generals.push({ name, trait });
                renderGenerals();
                renderArmies();
                generalForm.reset();
            };

            armyForm.onsubmit = (e) => {
                e.preventDefault();
                const generalIdx = parseInt(armyGeneralSelect.value);
                const selectedBrigades = Array.from(armyBrigadesSelect.selectedOptions).map(opt => parseInt(opt.value));
                if (selectedBrigades.length === 0 || selectedBrigades.length > 8) {
                    alert('Select 1-8 brigades for the army.');
                    return;
                }
                armies.push({ general: generalIdx, brigades: selectedBrigades });
                renderArmies();
                armyForm.reset();            };

            // Load sample armies function
            function loadSampleArmies() {
                // Clear existing data
                brigades.length = 0;
                generals.length = 0;
                armies.length = 0;
                
                sampleArmies.forEach((army, armyIndex) => {
                    // Add general first
                    generals.push(army.general);
                    const generalIndex = generals.length - 1;
                    
                    // Add brigades for this army
                    const armyBrigadeIndexes = [];
                    army.brigades.forEach(brigade => {
                        brigades.push(brigade);
                        armyBrigadeIndexes.push(brigades.length - 1);
                    });
                    
                    // Create the army
                    armies.push({
                        general: generalIndex,
                        brigades: armyBrigadeIndexes,
                        name: army.name
                    });
                });
                
                // Re-render everything
                renderBrigades();
                renderGenerals();
                renderArmies();
                
                // Show success message
                if (battleResult) {
                    battleResult.innerHTML = `
                        <div style="background:#d4edda;color:#155724;padding:1rem;border-radius:8px;margin-top:1rem;">
                            ✅ Successfully loaded ${sampleArmies.length} sample armies! You can now battle them against each other.
                        </div>
                    `;
                }            }

            // Save armies to localStorage
            function saveArmies() {
                const saveData = {
                    brigades: [...brigades],
                    generals: [...generals],
                    armies: [...armies],
                    timestamp: new Date().toISOString()
                };
                
                try {
                    localStorage.setItem('warfareSimulatorData', JSON.stringify(saveData));
                    if (battleResult) {
                        battleResult.innerHTML = `
                            <div style="background:#d4edda;color:#155724;padding:1rem;border-radius:8px;margin-top:1rem;">
                                💾 Successfully saved ${armies.length} armies, ${brigades.length} brigades, and ${generals.length} generals!
                            </div>
                        `;
                    }
                } catch (error) {
                    if (battleResult) {
                        battleResult.innerHTML = `
                            <div style="background:#f8d7da;color:#721c24;padding:1rem;border-radius:8px;margin-top:1rem;">
                                ❌ Failed to save armies: ${error.message}
                            </div>
                        `;
                    }
                }
            }

            // Load armies from localStorage
            function loadArmies() {
                try {
                    const saveData = localStorage.getItem('warfareSimulatorData');
                    if (!saveData) {
                        if (battleResult) {
                            battleResult.innerHTML = `
                                <div style="background:#fff3cd;color:#856404;padding:1rem;border-radius:8px;margin-top:1rem;">
                                    ⚠️ No saved armies found. Create some armies and save them first!
                                </div>
                            `;
                        }
                        return;
                    }

                    const data = JSON.parse(saveData);
                    
                    // Clear existing data
                    brigades.length = 0;
                    generals.length = 0;
                    armies.length = 0;
                    
                    // Load saved data
                    brigades.push(...data.brigades);
                    generals.push(...data.generals);
                    armies.push(...data.armies);
                    
                    // Re-render everything
                    renderBrigades();
                    renderGenerals();
                    renderArmies();
                    
                    if (battleResult) {
                        const saveDate = new Date(data.timestamp).toLocaleString();
                        battleResult.innerHTML = `
                            <div style="background:#d4edda;color:#155724;padding:1rem;border-radius:8px;margin-top:1rem;">
                                📁 Successfully loaded ${armies.length} armies, ${brigades.length} brigades, and ${generals.length} generals!<br>
                                <small>Saved on: ${saveDate}</small>
                            </div>
                        `;
                    }
                } catch (error) {
                    if (battleResult) {
                        battleResult.innerHTML = `
                            <div style="background:#f8d7da;color:#721c24;padding:1rem;border-radius:8px;margin-top:1rem;">
                                ❌ Failed to load armies: ${error.message}
                            </div>
                        `;
                    }
                }
            }

            // Clear all armies, brigades, and generals
            function clearAll() {
                if (confirm('Are you sure you want to clear all brigades, generals, and armies? This cannot be undone.')) {
                    brigades.length = 0;
                    generals.length = 0;
                    armies.length = 0;
                    
                    renderBrigades();
                    renderGenerals();
                    renderArmies();
                    
                    if (battleResult) {
                        battleResult.innerHTML = `
                            <div style="background:#d4edda;color:#155724;padding:1rem;border-radius:8px;margin-top:1rem;">
                                🗑️ All data cleared successfully!
                            </div>
                        `;
                    }
                }
            }

            // Event handler for loading samples
            if (loadSamplesBtn) {
                loadSamplesBtn.onclick = loadSampleArmies;
            }

            // Event handlers for save/load/clear
            if (saveArmiesBtn) {
                saveArmiesBtn.onclick = saveArmies;
            }
            if (loadArmiesBtn) {
                loadArmiesBtn.onclick = loadArmies;
            }
            if (clearAllBtn) {
                clearAllBtn.onclick = clearAll;
            }

            renderBrigades();
            renderGenerals();
            renderArmies();
        } else {
            view.innerHTML = `
                <h2>Warfare System Overview</h2>
                <section style="margin-bottom:2rem;">
                    <h3>The Basics</h3>
                    <ul>
                        <li>Wars are fought with <b>Brigades</b> (units) and <b>Generals</b> (commanders).</li>
                        <li>Brigades can be combined into <b>Armies</b> (up to 8 brigades).</li>
                        <li>Wars run on a <b>3-day Action Cycle</b> (Create, Move, Battle/Siege).</li>
                        <li>Your <b>Brigade Cap</b> increases with city ownership.</li>
                        <li><b>War College</b> level grants general benefits.</li>
                        <li>Peace is achieved via <b>Peace Treaties</b> with victory/defeat conditions.</li>
                    </ul>
                </section>
                <section style="margin-bottom:2rem;">
                    <h3>Brigades</h3>
                    <p>Brigades are the standard military unit, and act as independent pieces on your personal war map in the War Room. You may assign movement orders, watch them battle, and upgrade them with powerful enhancements to get an advantage against your opponents.</p>
                    <p>Brigades can be built at any city, costing 2 food and 1 metal, or 40 silver. You may build as many brigades as you have the Brigade Cap for, and may not build any more until they are destroyed or your cap increases. Your brigade cap is 2+ your city cap increases, listed below:</p>
                    <ul>
                        <li>A Tier 1 City gives +1 to your brigade cap.</li>
                        <li>A Tier 2 City gives +3 to your brigade cap.</li>
                        <li>A Tier 3 City gives +5 to your brigade cap.</li>
                    </ul>
                    <p>Brigades come in 5 specialized roles, determined when building the unit. These Brigades function similarly, but have different values for the different stages of battle. Brigade movement is also determined by these roles. All Brigades may only see the tile they are standing on, unless an enhancement states otherwise.</p>
                    <ul>
                        <li>🐴 <b>Cavalry:</b> +1 Skirmish, +1 Pitch, 5 Movement</li>
                        <li>⚔️ <b>Heavy:</b> +2 Defense, +1 Pitch, +1 Rally, 3 Movement</li>
                        <li>🪓 <b>Light:</b> +2 Skirmish, +1 Rally, 4 Movement</li>
                        <li>🏹 <b>Ranged:</b> +2 Defense, +1 Pitch, 4 Movement</li>
                        <li>🛡️ <b>Support:</b> +2 Defense, +1 Rally, 4 Movement</li>
                    </ul>
                    <p>Brigades may each be given a single enhancement, which grants benefits or abilities to the brigade. Enhancements cost either 40 silver or the resource cost attached to each brigade type. The enhancements are listed below, but must be attached to the associated Brigade Type. Universal enhancements are available for all.</p>
                    
                    <h4>🐴 Cavalry (1 food, 1 gem, 1 metal)</h4>
                    <ul>
                        <li><b>Life Guard:</b> +2 Rally. This Brigade allows a General to reroll a 1 on the promotion roll once per battle.</li>
                        <li><b>Lancers:</b> +2 Skirmish. If this brigade routs a brigade by a difference of 3+ in the Skirmish stage, that brigade must immediately roll a destruction roll.</li>
                        <li><b>Dragoons:</b> +2 Defense. +1 Pitch. +1 Rally.</li>
                    </ul>

                    <h4>⚔️ Heavy (1 fuel, 2 metal)</h4>
                    <ul>
                        <li><b>Artillery Team:</b> +1 Defense. +1 Pitch. When Garrisoned, +1 Pitch. This Brigade applies -1 defense to all enemy brigades in a battle.</li>
                        <li><b>Grenadiers:</b> +2 Skirmish. +2 Pitch.</li>
                        <li><b>Stormtroopers:</b> +1 Pitch. +1 Rally. +1 Movement. This brigade ignores trench movement penalties.</li>
                    </ul>

                    <h4>🪓 Light (1 food, 1 metal, 1 timber)</h4>
                    <ul>
                        <li><b>Rangers:</b> +2 Skirmish. +1 Pitch.</li>
                        <li><b>Assault Team:</b> +1 Skirmish. This unit may select what brigade it skirmishes, and negates that brigade's Garrison modifier for the battle.</li>
                        <li><b>Commando:</b> +2 Defense. +1 Pitch. This Brigade cannot be seen by enemy Sentry Teams.</li>
                    </ul>

                    <h4>🏹 Ranged (1 stone, 2 timber)</h4>
                    <ul>
                        <li><b>Sharpshooters:</b> +2 Defense. When garrisoned, +1 Pitch. This Brigade routs any skirmishers that target this brigade and fail, and that brigade must immediately roll a destruction die.</li>
                        <li><b>Mobile Platforms:</b> +1 Skirmish. +2 Defense. +1 Movement.</li>
                        <li><b>Mortar Team:</b> +1 Pitch. +1 Rally. This brigade negates the garrison bonus for a single brigade, chosen randomly.</li>
                    </ul>

                    <h4>🛡️ Support (1 fuel, 2 Stone)</h4>
                    <ul>
                        <li><b>Field Hospital:</b> This Brigade may reroll the Action Report Destruction Die, and extends this to all brigades in the same army.</li>
                        <li><b>Combat Engineers:</b> This Brigade may build one temporary structure on the tile it resides during an organization day, once per map cycle. This brigade negates the trench movement penalty for the Army. An Army with a Brigade that has the Combat Engineers enhancement decreases all siege times by 1 (non-stacking).</li>
                        <li><b>Officer Corps:</b> +2 Rally. When in an army the General in charge needs a 4-6 to level up. This brigade may choose where it retreats to.</li>
                    </ul>

                    <h4>🪖 Universal (2 Food, 1 metal)</h4>
                    <ul>
                        <li><b>Sentry Team:</b> +3 Defense. This Brigade has +1 tile of sight.</li>
                        <li><b>Marines:</b> This Brigade may immediately siege when landing on an enemy city. +1 sea tile movement for the army (non-stacking).</li>
                    </ul>
                </section>
                <section style="margin-bottom:2rem;">
                    <h3>Generals & Armies</h3>
                    <p>Generals are your commanders, and their job is to run an army. Every General has a randomly assigned trait, which grants bonuses or special abilities to their army.</p>
                    <p>Generals are assumed universally at every city when not leading an army, but they must be attached to a brigade at a city to form an army. They may then go around collecting other units until they reach the 8 brigade cap.</p>
                    <p>Generals have a level, which is scaled from a 1-10. When a General reaches Level 10, he may be retired, and increase your war college level by 1. If your war college is already max level, you would instead receive 300 silver.</p>
                    <ul><li>Your General Level is a direct bonus to your pitch value in battle. You add the general level number as a base increase per round, making Generals extremely impactful to the outcome of a battle.</li></ul>
                    <p>Generals themselves have a cap, determined by your war college level. Your cap starts at 1. Generals cost 100 silver for every general you already have, so if you have no generals you will get one for free, or if you have 2 generals your next one costs 200 silver.</p>
                    <p>General Traits are rolled randomly when the general is created, or rerolled when using 3 gems to do so. The traits are listed below:</p>
                    <ul>
                        <li><b>1 Ambitious:</b> -1 to the number needed to promote after a battle.</li>
                        <li><b>2 Bold:</b> One of your skirmishers get a bonus equal to half the general\'s level, rounded up.</li>
                        <li><b>3 Brilliant:</b> This General gets double his general level during the Pitch.</li>
                        <li><b>4 Brutal:</b> Pillaging resources succeeds on a 5-6. Razing a city also counts as sacking it.</li>
                        <li><b>5 Cautious:</b> You may declare the skirmishing stage to be skipped this battle.</li>
                        <li><b>6 Chivalrous:</b> During the Action Report, you may choose to allow your enemy to have an extra reroll on their Destruction dice, in order to get -1 siege timer on your next city siege with this army.</li>
                        <li><b>7 Confident:</b> +2 to Defense and +1 to Rally for all brigades.</li>
                        <li><b>8 Defiant:</b> +2 to rally for all brigades.</li>
                        <li><b>9 Disciplined:</b> +1 to pitch and rally for all brigades.</li>
                        <li><b>10 Dogged:</b> This General may choose 2 brigades to assist any battle occurring on an adjacent tile. These brigades return after the battle.</li>
                        <li><b>11 Heroic:</b> +1 to Rally for all brigades. If the battle would be lost, this general may sacrifice himself to return all brigades to a new pitch, granting his general level as a pitch bonus to all brigades for the remainder of the battle.</li>
                        <li><b>12 Inspiring:</b> All brigades get a free reroll on their rally rolls, once per rally stage. Celebrating with this army gives +2 rally instead of +1.</li>
                        <li><b>13 Lucky:</b> This General, when a 1 is rolled on the promotion die, may reroll the promotion die once per battle.</li>
                        <li><b>14 Mariner:</b> +1 to army movement while embarked. This General may siege cities from a landing, and this army may immediately move after embarking.</li>
                        <li><b>15 Merciless:</b> During the action report, enemy brigades are destroyed on a 1-3.</li>
                        <li><b>16 Prodigious:</b> This General gets an additional 2 levels. These levels are lost if this trait is rerolled.</li>
                        <li><b>17 Relentless:</b> +1 to army movement on land. This General may choose to pursue an enemy army that retreats, instead of continuing their original move.</li>
                        <li><b>18 Resolute:</b> +3 to defense for all brigades.</li>
                        <li><b>19 Wary:</b> You are alerted when an enemy can see this army. Your Army can see one tile further away (stacks with sentry team). Any enemy Generals within this army\'s sight have their trait revealed.</li>
                        <li><b>20 Zealous:</b> +1 Rally for all brigades. When in a holy war, this number goes to +2 rally and +1 pitch for all brigades.</li>
                    </ul>
                    <p>Army size: up to 8 brigades, moves at slowest brigade speed.</p>
                </section>
                <section style="margin-bottom:2rem;">
                    <h3>Action Cycle</h3>
                    <ol>
                        <li><b>Day 1:</b> Create/enhance brigades, recruit generals, build structures</li>
                        <li><b>Day 2:</b> Move brigades, pillage resources</li>
                        <li><b>Day 3:</b> Fight battles, siege cities</li>
                    </ol>
                </section>
                <section style="margin-bottom:2rem;">
                    <h3>Battles</h3>
                    <ol>
                        <li><b>Skirmish:</b> 2 best brigades from each side try to rout enemies</li>
                        <li><b>Pitch:</b> 3 rounds, add up dice and bonuses, check for win/loss</li>
                        <li><b>Rally:</b> Surviving brigades roll to stay or rout</li>
                        <li><b>Action Report:</b> Roll for casualties and general promotions.
                            <ul>
                                <li>During the Action Report, Generals must roll a d6, called a promotion roll.</li>
                                <li>Rolling a 5-6 results in a <b>Promotion</b>, causing the general to level up.</li>
                                <li>Rolling a 1 results in a <b>Capture</b>, allowing your enemy to determine your general\\'s fate. A captured general is removed from the field, and may be <b>Executed</b> or <b>Ransomed</b>.
                                    <ul>
                                        <li>If a General is Executed, the executor may detail how the death occurs, either in battle or in RP. The general is then removed from the game.</li>
                                        <li>If a General is Ransomed, the ransomer may set any amount of silver or resources as a cost to get the general back. Should you refuse or fail to provide the ransom within what they consider acceptable time, they may hold the general indefinitely. Declaring an objectively outrageous sum could be considered a diplomatic insult.</li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                    </ol>
                </section>
                <section style="margin-bottom:2rem;">
                    <h3>Victory & Aftermath</h3>
                    <ul>
                        <li>Peace treaties end wars, with victory/defeat terms.</li>
                        <li>Winning armies continue movement, losing armies scatter or retreat.</li>
                    </ul>
                    <h4>After the Battle Details:</h4>
                    <ul>
                        <li>Following a battle, the losing player\\'s brigades all scatter, moving a random number of tiles in random directions.</li>
                        <li>The Random number of tiles is from 1 tile to the brigade\\'s movement value. (e.g., a Heavy can go 1-3 tiles, Cavalry 1-5 tiles).</li>
                        <li>A losing army remains intact if the general survives, and may choose the direction it retreats, still moving a random number of tiles according to its slowest brigade.</li>
                        <li>Winning Brigades and Armies will continue their movement as it was determined in the movement day orders.</li>
                        <li>Regardless of winning or losing, any brigades or armies that move into enemy brigades after a battle will trigger another battle. Continue resolving battles until no new battles occur.</li>
                    </ul>
                </section>
                <section style="margin-bottom:2rem;">
                    <h3>More Details</h3>
                    <p>See the full rules for brigade types, enhancements, general traits, sieges, and temporary structures.</p>
                </section>
                <section style="margin-bottom:2rem;">
                    <h3>War College</h3>
                    <p>Your War College is your nation\\'s propensity for warfare. War colleges have levels similar to Generals, 1-10, but they only go up when you win a war, or retire a general.</p>
                    <p>Your War College Level carries additional benefits as you level it up. Everyone starts at Level 1.</p>
                    <ul>
                        <li><b>Level 1:</b> Your General Cap is 1. Your Generals start as level 1.</li>
                        <li><b>Level 2:</b> You may roll for general traits twice, choosing either result.</li>
                        <li><b>Level 3:</b> Your Generals start as level 2.</li>
                        <li><b>Level 4:</b> Your general Cap is 2.</li>
                        <li><b>Level 5:</b> Your Pillaging die result is at +1. Sacking a city is worth double.</li>
                        <li><b>Level 6:</b> Your Generals start as Level 3.</li>
                        <li><b>Level 7:</b> Your General Cap is 3.</li>
                        <li><b>Level 8:</b> You get +1 to Skirmish and Defense Rolls.</li>
                        <li><b>Level 9:</b> Your Generals start as Level 4.</li>
                        <li><b>Level 10:</b> Your General Cap is 4.</li>
                    </ul>
                </section>
                <section style="margin-bottom:2rem;">
                    <h3>Temporary Structures</h3>
                    <p>Temporary Structures are short term buildings that last from the day they\\'re built until the next map update.</p>
                    <p>Temporary Buildings may be built anywhere in your territory, on organization days. Towers and Forts can be used by your opponent, so be careful with where you place them.</p>
                    <p>There are 3 Temporary Buildings available, each costing stone to construct:</p>
                    <ul>
                        <li><b>Trenches (1 Stone):</b> Enemy brigades moving through a tile with trenches must use an additional tile of movement to do so.</li>
                        <li><b>Watchtowers (2 Stone):</b> Brigades on Watchtowers that have not moved this cycle have their sight extended by 1 tile.</li>
                        <li><b>Forts (3 Stone):</b> Brigades on Fort tiles that have not moved this action cycle become Garrisoned for as long as they remain on the tile.</li>
                    </ul>
                </section>
            `;
        }
    }

    document.getElementById('info-link').onclick = (e) => {
        e.preventDefault();
        render('info');
    };
    document.getElementById('sim-link').onclick = (e) => {
        e.preventDefault();
        render('simulator');
    };

    // Default route
    render('info');
}
