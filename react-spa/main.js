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
                'Cavalry': { skirmish: 1, defense: 0, pitch: 1, rally: 0 },
                'Heavy': { skirmish: 0, defense: 2, pitch: 1, rally: 1 },
                'Light': { skirmish: 2, defense: 0, pitch: 0, rally: 1 },
                'Ranged': { skirmish: 0, defense: 2, pitch: 1, rally: 0 },
                'Support': { skirmish: 0, defense: 2, pitch: 0, rally: 1 }
            };

            function rollDice() {
                return Math.floor(Math.random() * 6) + 1;
            }            function getBrigadeStats(brigade) {
                const baseStats = brigadeStats[brigade.type] || { skirmish: 0, defense: 0, pitch: 0, rally: 0 };
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

            function simulateBattle(army1, army2) {
                const g1 = generals[army1.general];
                const g2 = generals[army2.general];
                const brigades1 = army1.brigades.map(idx => brigades[idx]);
                const brigades2 = army2.brigades.map(idx => brigades[idx]);                let log = [
                    `<div style="text-align:center;background:linear-gradient(45deg,#ff6b6b,#4ecdc4);color:white;padding:1rem;border-radius:8px;margin-bottom:1rem;">`,
                    `<h3 style="margin:0;">⚔️ BATTLE REPORT ⚔️</h3>`,
                    `<h4 style="margin:0.5rem 0 0 0;">${g1.name} (${g1.trait}) vs ${g2.name} (${g2.trait})</h4>`,
                    `</div>`
                ];
                let activeBrigades1 = [...brigades1];
                let activeBrigades2 = [...brigades2];
                let generalLevel1 = getGeneralBonus(g1);
                let generalLevel2 = getGeneralBonus(g2);
                
                // Skirmish Stage
                log.push('<h5>Skirmish Stage</h5>');
                
                // Select 2 best skirmishers from each side
                const skirmishers1 = activeBrigades1
                    .map((b, i) => ({ brigade: b, stats: getBrigadeStats(b), index: i }))
                    .sort((a, b) => b.stats.skirmish - a.stats.skirmish)
                    .slice(0, Math.min(2, activeBrigades1.length));
                
                const skirmishers2 = activeBrigades2
                    .map((b, i) => ({ brigade: b, stats: getBrigadeStats(b), index: i }))
                    .sort((a, b) => b.stats.skirmish - a.stats.skirmish)
                    .slice(0, Math.min(2, activeBrigades2.length));
                
                let routedBrigades1 = [];
                let routedBrigades2 = [];
                
                // Army 1 skirmishers attack Army 2
                skirmishers1.forEach((skirmisher, i) => {
                    const targetIdx = Math.floor(Math.random() * activeBrigades2.length);
                    const target = activeBrigades2[targetIdx];
                    const targetStats = getBrigadeStats(target);
                    
                    const skirmishRoll = rollDice() + skirmisher.stats.skirmish;
                    const defenseRoll = rollDice() + targetStats.defense;
                    
                    log.push(`${skirmisher.brigade.type} attacks ${target.type}: ${skirmishRoll} vs ${defenseRoll}`);
                    
                    if (skirmishRoll > defenseRoll) {
                        log.push(`${target.type} is routed!`);
                        routedBrigades2.push(targetIdx);
                    }
                });
                
                // Army 2 skirmishers attack Army 1
                skirmishers2.forEach((skirmisher, i) => {
                    const targetIdx = Math.floor(Math.random() * activeBrigades1.length);
                    const target = activeBrigades1[targetIdx];
                    const targetStats = getBrigadeStats(target);
                    
                    const skirmishRoll = rollDice() + skirmisher.stats.skirmish;
                    const defenseRoll = rollDice() + targetStats.defense;
                    
                    log.push(`${skirmisher.brigade.type} attacks ${target.type}: ${skirmishRoll} vs ${defenseRoll}`);
                    
                    if (skirmishRoll > defenseRoll) {
                        log.push(`${target.type} is routed!`);
                        routedBrigades1.push(targetIdx);
                    }
                });
                
                // Pitch Stage
                log.push('<h5>Pitch Stage</h5>');
                let pitchTally = 0;
                let round = 1;
                
                while (round <= 3 && Math.abs(pitchTally) < 20) {
                    log.push(`<strong>Round ${round}</strong>`);
                    
                    // Army 1 pitch
                    let pitch1 = 0;
                    activeBrigades1.forEach((brigade, idx) => {
                        if (!routedBrigades1.includes(idx)) {
                            const roll = rollDice();
                            const stats = getBrigadeStats(brigade);
                            pitch1 += roll + stats.pitch;
                        }
                    });
                    pitch1 += generalLevel1;
                    
                    // Army 2 pitch
                    let pitch2 = 0;
                    activeBrigades2.forEach((brigade, idx) => {
                        if (!routedBrigades2.includes(idx)) {
                            const roll = rollDice();
                            const stats = getBrigadeStats(brigade);
                            pitch2 += roll + stats.pitch;
                        }
                    });
                    pitch2 += generalLevel2;
                    
                    const roundResult = pitch1 - pitch2;
                    pitchTally += roundResult;
                    
                    log.push(`Army 1: ${pitch1}, Army 2: ${pitch2}, Round Result: ${roundResult}, Tally: ${pitchTally}`);
                    round++;
                }
                
                let winner = null;
                if (pitchTally >= 20) {
                    winner = 1;
                    log.push(`<strong>${g1.name} wins the battle!</strong>`);
                } else if (pitchTally <= -20) {
                    winner = 2;
                    log.push(`<strong>${g2.name} wins the battle!</strong>`);
                } else {
                    // Rally Stage
                    log.push('<h5>Rally Stage</h5>');
                    
                    // Army 1 rally
                    const failed1 = [];
                    activeBrigades1.forEach((brigade, idx) => {
                        if (!routedBrigades1.includes(idx)) {
                            const roll = rollDice();
                            const stats = getBrigadeStats(brigade);
                            const rallyTotal = roll + stats.rally;
                            if (rallyTotal < 5) {
                                failed1.push(idx);
                                log.push(`${brigade.type} (Army 1) fails rally: ${rallyTotal}`);
                            }
                        }
                    });
                    
                    // Army 2 rally
                    const failed2 = [];
                    activeBrigades2.forEach((brigade, idx) => {
                        if (!routedBrigades2.includes(idx)) {
                            const roll = rollDice();
                            const stats = getBrigadeStats(brigade);
                            const rallyTotal = roll + stats.rally;
                            if (rallyTotal < 5) {
                                failed2.push(idx);
                                log.push(`${brigade.type} (Army 2) fails rally: ${rallyTotal}`);
                            }
                        }
                    });
                    
                    routedBrigades1 = [...routedBrigades1, ...failed1];
                    routedBrigades2 = [...routedBrigades2, ...failed2];
                    
                    // Check if all brigades routed
                    if (routedBrigades1.length >= activeBrigades1.length) {
                        winner = 2;
                        log.push(`<strong>${g2.name} wins - all enemy brigades routed!</strong>`);
                    } else if (routedBrigades2.length >= activeBrigades2.length) {
                        winner = 1;
                        log.push(`<strong>${g1.name} wins - all enemy brigades routed!</strong>`);
                    } else {
                        log.push('Battle continues with remaining brigades...');
                    }
                }
                
                // Action Report
                log.push('<h5>Action Report</h5>');
                
                // Brigade casualties
                let destroyed1 = 0, destroyed2 = 0;
                activeBrigades1.forEach((brigade, idx) => {
                    const roll = rollDice();
                    if (roll <= 2) {
                        destroyed1++;
                        log.push(`${brigade.type} (Army 1) destroyed`);
                    }
                });
                
                activeBrigades2.forEach((brigade, idx) => {
                    const roll = rollDice();
                    if (roll <= 2) {
                        destroyed2++;
                        log.push(`${brigade.type} (Army 2) destroyed`);
                    }
                });
                
                // General promotions/captures
                const generalRoll1 = rollDice();
                const generalRoll2 = rollDice();
                
                if (generalRoll1 === 1) {
                    log.push(`<strong>${g1.name} captured!</strong>`);
                } else if (generalRoll1 >= 5) {
                    log.push(`${g1.name} promoted!`);
                }
                
                if (generalRoll2 === 1) {
                    log.push(`<strong>${g2.name} captured!</strong>`);
                } else if (generalRoll2 >= 5) {
                    log.push(`${g2.name} promoted!`);
                }
                
                log.push(`<br><strong>Final Results:</strong>`);
                log.push(`Army 1 casualties: ${destroyed1}/${activeBrigades1.length}`);
                log.push(`Army 2 casualties: ${destroyed2}/${activeBrigades2.length}`);
                
                return log.join('<br>');
            }

            function renderBrigades() {
                ul.innerHTML = '';
                armyBrigadesSelect.innerHTML = '';
                if (brigades.length === 0) {
                    ul.innerHTML = '<li style="color:#888;">No brigades created yet.</li>';
                } else {
                    brigades.forEach((b, i) => {
                        ul.innerHTML += `<li><b>${b.type}</b>${b.enhancement ? ` — <i>${b.enhancement}</i>` : ''}</li>`;
                        armyBrigadesSelect.innerHTML += `<option value="${i}">${b.type}${b.enhancement ? ` — ${b.enhancement}` : ''}</option>`;
                    });
                }
            }

            function renderGenerals() {
                generalsUl.innerHTML = '';
                armyGeneralSelect.innerHTML = '';
                if (generals.length === 0) {
                    generalsUl.innerHTML = '<li style="color:#888;">No generals created yet.</li>';
                } else {
                    generals.forEach((g, i) => {
                        generalsUl.innerHTML += `<li><b>${g.name}</b> — <i>${g.trait}</i></li>`;
                        armyGeneralSelect.innerHTML += `<option value="${i}">${g.name} (${g.trait})</option>`;
                    });
                }
            }

            function renderArmies() {
                armiesUl.innerHTML = '';
                if (battleArmy1) battleArmy1.innerHTML = '';
                if (battleArmy2) battleArmy2.innerHTML = '<option>No armies</option>';
                if (armies.length === 0) {
                    armiesUl.innerHTML = '<li style="color:#888;">No armies created yet.</li>';
                    if (battleArmy1) battleArmy1.innerHTML = '<option>No armies</option>';
                    if (battleArmy2) battleArmy2.innerHTML = '<option>No armies</option>';
                } else {
                    armies.forEach((a, i) => {
                        const general = generals[a.general];
                        const brigadeList = a.brigades.map(idx => {
                            const b = brigades[idx];
                            return `<span>${b.type}${b.enhancement ? ` — <i>${b.enhancement}</i>` : ''}</span>`;
                        }).join(', ');
                        armiesUl.innerHTML += `<li><b>${general.name}</b> (${general.trait})<br>Brigades: ${brigadeList}</li>`;
                        if (battleArmy1) battleArmy1.innerHTML += `<option value="${i}">${general.name} (${general.trait})</option>`;
                        if (battleArmy2) battleArmy2.innerHTML += `<option value="${i}">${general.name} (${general.trait})</option>`;
                    });                }
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
                    simulateBattleBtn.onclick = () => {
                        if (!battleArmy1 || !battleArmy2) return;
                        const idx1 = parseInt(battleArmy1.value);
                        const idx2 = parseInt(battleArmy2.value);
                        if (isNaN(idx1) || isNaN(idx2) || idx1 === idx2) {
                            battleResult.innerHTML = '<span style="color:#c00;">Select two different armies.</span>';
                            return;
                        }
                        const a1 = armies[idx1];
                        const a2 = armies[idx2];
                        
                        const battleLog = simulateBattle(a1, a2);                        battleResult.innerHTML = `
                            <div style="background:#f9f9f9;padding:1rem;border-radius:8px;max-height:400px;overflow-y:auto;">
                                ${battleLog}
                            </div>
                        `;
                        battleResult.style.display = 'block';
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
                    <ul>
                        <li>Generals lead armies, grant bonuses, and have unique traits.</li>
                        <li>Generals level up and can retire to improve your War College.</li>
                        <li>Army size: up to 8 brigades, moves at slowest brigade speed.</li>
                        <li><b>General Trait Examples:</b>
                            <ul>
                                <li><b>Brilliant/Genius:</b> +2 to all army actions</li>
                                <li><b>Bold/Aggressive:</b> +1 to all army actions</li>
                                <li><b>Defensive/Cautious:</b> +1 to army rally attempts</li>
                            </ul>
                        </li>
                    </ul>
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
                        <li><b>Action Report:</b> Roll for casualties and general promotions</li>
                    </ol>
                </section>
                <section style="margin-bottom:2rem;">
                    <h3>Victory & Aftermath</h3>
                    <ul>
                        <li>Peace treaties end wars, with victory/defeat terms.</li>
                        <li>Winning armies continue movement, losing armies scatter or retreat.</li>
                    </ul>
                </section>
                <section style="margin-bottom:2rem;">
                    <h3>More Details</h3>
                    <p>See the full rules for brigade types, enhancements, general traits, sieges, and temporary structures.</p>
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
