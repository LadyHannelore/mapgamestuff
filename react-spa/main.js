// main.js - Basic SPA logic

// Persistent state arrays (module scope)
            // State arrays are now persistent at module scope

export function main() {
    console.log('Main function executed');
    
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
            .calendar { background: white; padding: 1rem; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.1); margin-bottom: 2rem; }
        </style>
        <header style="background: linear-gradient(135deg, #222, #444); color: white; padding: 1.5rem 0; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.3);">
            <h1 style="margin: 0; font-size: 2rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">⚔️ Map Game</h1>
        </header>
        <nav style="background: white; padding: 1rem 0; text-align: center; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <a href="#info" id="info-link" style="margin: 0 2rem; color: #007bff; text-decoration: none; font-weight: 500; padding: 0.5rem 1rem; border-radius: 20px; transition: all 0.2s;">📚 Info</a>
            <a href="#simulator" id="sim-link" style="margin: 0 2rem; color: #007bff; text-decoration: none; font-weight: 500; padding: 0.5rem 1rem; border-radius: 20px; transition: all 0.2s;">⚔️ Simulator</a>
        </nav>
        <main id="view" style="max-width: 1000px; margin: 2rem auto; padding: 1rem;"></main>
        <div id="calendar"></div>
    `;

    function render(route) {
        const view = document.getElementById('view');
        if (!view) return;
        if (route === 'simulator') {
            view.innerHTML = `
                <h2>🎲 Mock Battle Simulator</h2>
                <form id="brigade-form" class="form-section brigade-form">
                    <h3>🪖 Create Brigade</h3>
                    <label>
                        Brigade Type:
                        <select id="brigade-type">
                            <option value="Cavalry">🐴 Cavalry</option>
                            <option value="Heavy">⚔️ Heavy</option>
                            <option value="Light">🪓 Light</option>
                            <option value="Ranged">🏹 Ranged</option>
                            <option value="Support">🛡️ Support</option>
                        </select>
                    </label>
                    <label>
                        Enhancement:
                        <select id="brigade-enhancement">
                            <!-- Options will be populated dynamically -->
                        </select>
                    </label>
                    <button type="submit">Add Brigade</button>
                </form>
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
            `;
            // State arrays are now persistent at module scope
            
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
            
            // Remove duplicate variable declarations by using existing variables
            const form = document.getElementById('brigade-form');
            const ul = document.getElementById('brigades-ul');
            const generalForm = document.getElementById('general-form');
            const generalsUl = document.getElementById('generals-ul');
            const armyForm = document.getElementById('army-form');
            const armyGeneralSelect = document.getElementById('army-general');
            const armyBrigadesSelect = document.getElementById('army-brigades');
            const armiesUl = document.getElementById('armies-ul');
            const battleForm = document.getElementById('battle-form');
            const battleArmy1 = document.getElementById('battle-army1');
            const battleArmy2 = document.getElementById('battle-army2');
            const battleResult = document.getElementById('battle-result');
            const simulateBattleBtn = document.getElementById('simulate-battle-btn');
            const loadSamplesBtn = document.getElementById('load-samples-btn');
            const saveArmiesBtn = document.getElementById('save-armies-btn');
            const loadArmiesBtn = document.getElementById('load-armies-btn');
            const clearAllBtn = document.getElementById('clear-all-btn');

            // Enhancement options by type
            const enhancementOptions = {
                Cavalry: [
                    { value: 'Life Guard', label: 'Life Guard: +2 Rally. Allows General to reroll a 1 on promotion roll once per battle.' },
                    { value: 'Lancers', label: 'Lancers: +2 Skirmish. Rout by 3+ in Skirmish forces destruction roll.' },
                    { value: 'Dragoons', label: 'Dragoons: +2 Defense. +1 Pitch. +1 Rally.' }
                ],
                Heavy: [
                    { value: 'Artillery Team', label: 'Artillery Team: +1 Defense. +1 Pitch. Garrisoned: +1 Pitch. Applies -1 defense to all enemy brigades.' },
                    { value: 'Grenadiers', label: 'Grenadiers: +2 Skirmish. +2 Pitch.' },
                    { value: 'Stormtroopers', label: 'Stormtroopers: +1 Pitch. +1 Rally. +1 Movement. Ignores trench movement penalties.' }
                ],
                Light: [
                    { value: 'Rangers', label: 'Rangers: +2 Skirmish. +1 Pitch.' },
                    { value: 'Assault Team', label: 'Assault Team: +1 Skirmish. Selects skirmish target, negates Garrison modifier.' },
                    { value: 'Commando', label: 'Commando: +2 Defense. +1 Pitch. Cannot be seen by enemy Sentry Teams.' }
                ],
                Ranged: [
                    { value: 'Sharpshooters', label: 'Sharpshooters: +2 Defense. Garrisoned: +1 Pitch. Rout failed skirmishers.' },
                    { value: 'Mobile Platforms', label: 'Mobile Platforms: +1 Skirmish. +2 Defense. +1 Movement.' },
                    { value: 'Mortar Team', label: 'Mortar Team: +1 Pitch. +1 Rally. Negates garrison bonus for a single brigade.' }
                ],
                Support: [
                    { value: 'Field Hospital', label: 'Field Hospital: Reroll Action Report Destruction Die for all brigades in army.' },
                    { value: 'Combat Engineers', label: 'Combat Engineers: Build temporary structure, negate trench penalty, decrease siege times by 1.' },
                    { value: 'Officer Corps', label: 'Officer Corps: +2 Rally. General needs 4-6 to level up. May choose retreat.' }
                ],
                Universal: [
                    { value: 'Sentry Team', label: 'Sentry Team: +3 Defense. +1 tile of sight.' },
                    { value: 'Marines', label: 'Marines: May immediately siege when landing on enemy city. +1 sea tile movement for army.' }
                ]
            };

            function updateEnhancementOptions() {
                const type = document.getElementById('brigade-type').value;
                const enhancementSelect = document.getElementById('brigade-enhancement');
                enhancementSelect.innerHTML = '';
                // Add type-specific enhancements
                enhancementOptions[type].forEach(opt => {
                    const option = document.createElement('option');
                    option.value = opt.value;
                    option.textContent = opt.label;
                    enhancementSelect.appendChild(option);
                });
                // Add universal enhancements
                enhancementOptions.Universal.forEach(opt => {
                    const option = document.createElement('option');
                    option.value = opt.value;
                    option.textContent = opt.label;
                    enhancementSelect.appendChild(option);
                });
            }

            // Initial population
            updateEnhancementOptions();
            document.getElementById('brigade-type').addEventListener('change', updateEnhancementOptions);

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

            // Assuming generalForm is already defined and refers to your general creation form
            if (generalForm) {
                generalForm.onsubmit = (e) => {
                    e.preventDefault();
                    const nameInput = document.getElementById('general-name'); // Ensure this input field exists in your HTML
                    const traitInput = document.getElementById('general-trait'); // Ensure this input field exists
                    
                    const name = nameInput ? nameInput.value.trim() : `General ${generals.length + 1}`;
                    const trait = traitInput ? traitInput.value.trim() : "Default Trait";

                    if (name && trait) {
                        generals.push({ 
                            id: `g${generals.length}`, 
                            name, 
                            trait, 
                            level: 1, 
                            experience: 0, // For tracking promotions
                            status: 'active' 
                        });
                        renderGenerals(); // Update display of generals
                        renderArmies();   // Update army selection dropdowns if generals are part of armies
                        generalForm.reset();
                        if (battleResult) battleResult.innerHTML = `<div style="color: green; padding: 10px;">General ${name} created!</div>`;
                    } else {
                        if (battleResult) battleResult.innerHTML = '<div style="color: red; padding: 10px;">General name and trait are required.</div>';
                    }
                };
            }

            // Wire up the army creation form handler
            if (armyForm) {
                armyForm.onsubmit = (e) => {
                    e.preventDefault();
                    // existing armyForm submission logic should go here
                };
            }

            // Load sample armies function
            function loadSampleArmies() {
                brigades.length = 0;
                generals.length = 0;
                armies.length = 0;

                // Define brigade base stats (simplified, refer to rules for full details)
                const brigadeBaseStats = {
                    'Cavalry': { skirmish: 1, pitch: 1, rally: 0, defense: 0, movement: 5 },
                    'Heavy':   { skirmish: 0, pitch: 1, rally: 1, defense: 2, movement: 3 },
                    'Light':   { skirmish: 2, pitch: 0, rally: 1, defense: 0, movement: 4 },
                    'Ranged':  { skirmish: 0, pitch: 1, rally: 0, defense: 2, movement: 4 },
                    'Support': { skirmish: 0, pitch: 0, rally: 1, defense: 2, movement: 4 }
                };
                const getStats = (type) => JSON.parse(JSON.stringify(brigadeBaseStats[type] || { skirmish: 0, pitch: 0, rally: 0, defense: 0, movement: 3 }));

                // Sample Brigades
                brigades.push({ id: 'b0', name: 'Light Horse', type: 'Cavalry', enhancement: null, stats: getStats('Cavalry') });
                brigades.push({ id: 'b1', name: 'Iron Wall', type: 'Heavy', enhancement: null, stats: getStats('Heavy') });
                brigades.push({ id: 'b2', name: 'Scouts', type: 'Light', enhancement: 'Rangers', stats: getStats('Light') }); // Rangers: +2 Skirmish, +1 Pitch
                brigades.push({ id: 'b3', name: 'Archers', type: 'Ranged', enhancement: null, stats: getStats('Ranged') });
                brigades.push({ id: 'b4', name: 'Riders', type: 'Cavalry', enhancement: 'Lancers', stats: getStats('Cavalry') }); // Lancers: +2 Skirmish
                brigades.push({ id: 'b5', name: 'Phalanx', type: 'Heavy', enhancement: 'Artillery Team', stats: getStats('Heavy') }); // Artillery: +1 Def, +1 Pitch
                
                // Sample Generals
                generals.push({ id: 'g0', name: 'General Maximus', trait: 'Brilliant', level: 3, experience: 0, status: 'active' });
                generals.push({ id: 'g1', name: 'Cmdr. Valerius', trait: 'Confident', level: 2, experience: 0, status: 'active' });

                // Sample Armies (using indices)
                armies.push({ name: 'Alpha Legion', general: 0, brigades: [0, 1, 2] }); // General Maximus with 3 brigades
                armies.push({ name: 'Beta Cohort', general: 1, brigades: [3, 4, 5] });   // Cmdr. Valerius with 3 brigades
                
                renderBrigades();
                renderGenerals();
                renderArmies(); 
                
                if (battleResult) {
                    battleResult.innerHTML = `
                        <div style="background:#d4edda;color:#155724;padding:1rem;border-radius:8px;margin-top:1rem;">
                            Sample armies loaded successfully!
                        </div>
                    `;
                }
            }
            
            // Event handler for loading sample armies
            if (loadSamplesBtn) {
                loadSamplesBtn.onclick = loadSampleArmies;
            }

            // Battle Form Submission
            if (battleForm) {
                battleForm.onsubmit = async (e) => {
                    e.preventDefault();
                    const army1Select = document.getElementById('battle-army1');
                    const army2Select = document.getElementById('battle-army2');

                    if (!army1Select || !army2Select) {
                        if (battleResult) battleResult.innerHTML = "<div style=\"color:red; padding:10px;\">Error: Army selection dropdowns not found.</div>";
                        return;
                    }

                    const army1Index = parseInt(army1Select.value);
                    const army2Index = parseInt(army2Select.value);

                    if (isNaN(army1Index) || isNaN(army2Index) || army1Index < 0 || army1Index >= armies.length || army2Index < 0 || army2Index >= armies.length) {
                        if (battleResult) battleResult.innerHTML = "<div style=\"color:red; padding:10px;\">Error: Please select valid armies.</div>";
                        return;
                    }
                    if (army1Index === army2Index) {
                        if (battleResult) battleResult.innerHTML = "<div style=\"color:red; padding:10px;\">Error: Armies must be different.</div>";
                        return;
                    }

                    const army1Data = armies[army1Index];
                    const army2Data = armies[army2Index];

                    if (battleResult) battleResult.innerHTML = "<div style=\"color:blue; padding:10px;\">Simulating battle...</div>";
                    
                    await simulateBattle(army1Data, army2Data);
                };
            }

            async function simulateBattle(army1Data, army2Data) {
                if (!battleResult) { console.error("battleResult element not found for logging"); return; }
                let battleLog = [];
                const log = (message) => {
                    console.log(message);
                    battleLog.push(message);
                    // Live update the battle log on screen
                    battleResult.innerHTML = battleLog.map(line => `<div>${line}</div>`).join('');
                };
                battleResult.innerHTML = ''; // Clear previous logs at the start

                const rollD6 = () => Math.floor(Math.random() * 6) + 1;

                // --- Helper: Get effective stats (NEEDS FULL IMPLEMENTATION based on rules) ---
                function getEffectiveStats(brigadeObj, generalObj) {
                    // Base stats from type (should be a comprehensive constant)
                    const baseStatsData = {
                        'Cavalry': { s: 1, p: 1, r: 0, d: 0 }, 'Heavy': { s: 0, p: 1, r: 1, d: 2 },
                        'Light':   { s: 2, p: 0, r: 1, d: 0 }, 'Ranged':{ s: 0, p: 1, r: 0, d: 2 },
                        'Support': { s: 0, p: 0, r: 1, d: 2 }
                    };
                    let stats = JSON.parse(JSON.stringify(baseStatsData[brigadeObj.type] || { s: 0, p: 0, r: 0, d: 0 }));

                    // TODO: Apply ALL brigade enhancement effects from rules
                    if (brigadeObj.enhancement === 'Lancers') stats.s += 2;
                    if (brigadeObj.enhancement === 'Rangers') { stats.s += 2; stats.p += 1; }
                    if (brigadeObj.enhancement === 'Artillery Team') { stats.d += 1; stats.p += 1; /* And -1 def to all enemy */ }
                    // ... many more enhancements

                    // TODO: Apply ALL general trait effects from rules to this brigade's stats
                    if (generalObj) {
                        if (generalObj.trait === 'Confident') { stats.d += 2; stats.r += 1; }
                        if (generalObj.trait === 'Disciplined') { stats.p += 1; stats.r += 1; }
                        if (generalObj.trait === 'Resolute') stats.d += 3;
                        // ... many more traits
                    }
                    return { skirmish: stats.s, pitch: stats.p, rally: stats.r, defense: stats.d };
                }

                log(`<h2>Battle: ${army1Data.name || 'Army 1'} vs ${army2Data.name || 'Army 2'}</h2>`);

                const general1 = { ...generals[army1Data.general] }; // Copy general data
                const general2 = { ...generals[army2Data.general] };

                log(`<b>${army1Data.name}</b>: General ${general1.name} (Lvl ${general1.level}, ${general1.trait})`);
                log(`<b>${army2Data.name}</b>: General ${general2.name} (Lvl ${general2.level}, ${general2.trait})`);

                let battleBrigades1 = army1Data.brigades.map(bIdx => ({ 
                    ...brigades[bIdx], 
                    originalIndex: bIdx, 
                    currentStatus: 'fighting', 
                    army: 1, 
                    name: brigades[bIdx].name || `Brigade ${brigades[bIdx].id}`
                })); // Added closing parenthesis

                let battleBrigades2 = army2Data.brigades.map(bIdx => ({ 
                    ...brigades[bIdx], 
                    originalIndex: bIdx, 
                    currentStatus: 'fighting', 
                    army: 2, 
                    name: brigades[bIdx].name || `Brigade ${brigades[bIdx].id}`
                })); // Added closing parenthesis

                // --- SKIRMISH PHASE ---
                log("<h3>--- Skirmish Phase ---</h3>");
                // TODO: Implement "best" skirmisher selection (e.g., highest skirmish stat, non-garrisoned).
                // TODO: Implement General Trait "Cautious" (skip skirmish).
                // TODO: Implement General Trait "Bold" (bonus to one skirmisher).
                const getSkirmishers = (bArmy) => bArmy.filter(b => b.currentStatus === 'fighting' /* && !b.isGarrisoned */).slice(0, 2);
                
                const runSkirmishes = (attackingSkirmishers, defendingArmy, attackerGen, defenderGen, attackerArmyName) => {
                    attackingSkirmishers.forEach(skirmisher => {
                        const fightingDefenders = defendingArmy.filter(b => b.currentStatus === 'fighting');
                        if (fightingDefenders.length === 0) return;
                        const target = fightingDefenders[Math.floor(Math.random() * fightingDefenders.length)];
                        
                        const skirmisherStats = getEffectiveStats(skirmisher, attackerGen);
                        const targetStats = getEffectiveStats(target, defenderGen);
                        let skirmishRoll = rollD6() + skirmisherStats.skirmish;
                        let defenseRoll = rollD6() + targetStats.defense;

                        log(`${attackerArmyName}: ${skirmisher.name} (Skirmish ${skirmishRoll}) attacks ${target.name} (Defense ${defenseRoll})`);
                        if (skirmishRoll > targetStats.defense) {
                            log(`  -> ${target.name} is ROUTED by ${skirmisher.name}!`);
                            target.currentStatus = 'routed_skirmish';
                            // TODO: Implement Lancers enhancement (rout by 3+ -> destruction roll).
                        } else {
                            log(`  -> ${skirmisher.name} fails to rout ${target.name}.`);
                            // TODO: Implement Sharpshooters enhancement.
                        }
                    });
                };

                runSkirmishes(getSkirmishers(battleBrigades1), battleBrigades2, general1, general2, army1Data.name);
                runSkirmishes(getSkirmishers(battleBrigades2), battleBrigades1, general2, general1, army2Data.name);

                let winner = null;
                let battleCycleCount = 0;

                // --- MAIN BATTLE LOOP (PITCH/RALLY) ---
                while (!winner && battleCycleCount < 10) { // Safety break after 10 cycles
                    battleCycleCount++;
                    log(`<h3>--- Battle Cycle ${battleCycleCount} ---</h3>`);

                    let fighting1 = battleBrigades1.filter(b => b.currentStatus === 'fighting');
                    let fighting2 = battleBrigades2.filter(b => b.currentStatus === 'fighting');

                    if (fighting1.length === 0) { winner = army2Data.name; log(`${army1Data.name} has no brigades left!`); break; }
                    if (fighting2.length === 0) { winner = army1Data.name; log(`${army2Data.name} has no brigades left!`); break; }

                    // --- PITCH PHASE ---
                    log("<h4>--- Pitch Phase ---</h4>");
                    let pitchTally = 0;
                    for (let round = 1; round <= 3; round++) {
                        log(`<em>Pitch Round ${round}</em>`);
                        let general1PitchBonus = general1.level;
                        if (general1.trait === 'Brilliant') general1PitchBonus *= 2; // Trait: Brilliant
                        // TODO: Other general level related traits

                        let pitch1 = general1PitchBonus + fighting1.reduce((sum, b) => sum + rollD6() + getEffectiveStats(b, general1).pitch, 0);
                        
                        let general2PitchBonus = general2.level;
                        if (general2.trait === 'Brilliant') general2PitchBonus *= 2;
                        
                        let pitch2 = general2PitchBonus + fighting2.reduce((sum, b) => sum + rollD6() + getEffectiveStats(b, general2).pitch, 0);

                        log(`${army1Data.name} Pitch: ${pitch1} | ${army2Data.name} Pitch: ${pitch2}`);
                        pitchTally += (pitch1 - pitch2);
                        log(`Round ${round} Tally: ${pitchTally}`);
                    }

                    if (pitchTally >= 20) { winner = army1Data.name; log(`${army1Data.name} wins Pitch decisively! (Tally: ${pitchTally})`); break; }
                    if (pitchTally <= -20) { winner = army2Data.name; log(`${army2Data.name} wins Pitch decisively! (Tally: ${pitchTally})`); break; }

                    // --- RALLY PHASE ---
                    log("<h4>--- Rally Phase ---</h4>");
                    // TODO: Implement Inspiring Trait (reroll rally)
                    const rallyArmy = (bArmy, gen, armyName) => {
                        log(`${armyName} rallying:`);
                        bArmy.filter(b => b.currentStatus === 'fighting').forEach(b => {
                            let rallyRoll = rollD6() + getEffectiveStats(b, gen).rally;
                            log(`  ${b.name} rolls ${rallyRoll} (needs 5+)`);
                            if (rallyRoll < 5) {
                                b.currentStatus = 'routed_rally';
                                log(`    -> ${b.name} routs!`);
                            } else {
                                log(`    -> ${b.name} holds!`);
                            }
                        });
                    };
                    rallyArmy(battleBrigades1, general1, army1Data.name);
                    rallyArmy(battleBrigades2, general2, army2Data.name);
                }

                if (!winner && battleCycleCount >= 10) {
                    winner = "Draw";
                    log("Battle inconclusive after 10 cycles. Declared a Draw.");
                }
                
                // --- ACTION REPORT ---
                log("<h3>--- Action Report ---</h3>");
                if (winner && winner !== "Draw") {
                    log(`<b>Victor: ${winner}!</b>`);
                    const victorGen = winner === army1Data.name ? general1 : general2;
                    const loserGen = winner === army1Data.name ? general2 : general1;
                    const victorArmyBrigades = winner === army1Data.name ? battleBrigades1 : battleBrigades2;
                    const loserArmyBrigades = winner === army1Data.name ? battleBrigades2 : battleBrigades1;
                    
                    // TODO: Implement rerolls for victor.
                    // TODO: Implement Merciless trait (enemy destroyed 1-3).
                    // TODO: Implement Field Hospital (reroll destruction).
                    log("Casualty Rolls:");
                    [...victorArmyBrigades, ...loserArmyBrigades].forEach(b => {
                        let destructionRoll = rollD6();
                        // Simplified: No victor reroll implemented here yet.
                        let destructionThreshold = 2; 
                        if (b.army !== (winner === army1Data.name ? 1 : 2) && victorGen.trait === 'Merciless') destructionThreshold = 3;

                        if (destructionRoll <= destructionThreshold) {
                            log(`  ${b.name} (Army ${b.army}) rolled ${destructionRoll} and is DESTROYED!`);
                            b.currentStatus = 'destroyed';
                            // brigades[b.originalIndex].status = 'destroyed'; // Persist if needed
                        } else {
                            log(`  ${b.name} (Army ${b.army}) rolled ${destructionRoll} and survives.`);
                        }
                    });

                    log("General Promotion/Capture Rolls:");
                    // TODO: Implement rerolls for victor.
                    // TODO: Implement Ambitious, Lucky, Life Guard, Officer Corps effects.
                    [victorGen, loserGen].forEach(gen => {
                        let actionRoll = rollD6();
                        let promotionNeeded = 5; // Default
                        if (gen.trait === 'Ambitious') promotionNeeded = 4;

                        log(`  General ${gen.name} rolls ${actionRoll}.`);
                        if (actionRoll === 1) {
                            log(`    -> ${gen.name} is CAPTURED!`);
                            // generals[generals.findIndex(g => g.id === gen.id)].status = 'captured'; // Persist
                        } else if (actionRoll >= promotionNeeded) {
                            log(`    -> ${gen.name} is PROMOTED!`);
                            // generals[generals.findIndex(g => g.id === gen.id)].level = Math.min(10, gen.level + 1); // Persist
                        }
                    });
                     // TODO: Heroic trait logic.
                } else {
                    log("Battle ends in a Draw or was inconclusive. Standard Action Report may vary.");
                }
                log("<h3>--- Battle Simulation Ended ---</h3>");
                // Optionally, re-render lists to reflect any persistent changes made to generals/brigades
                // renderBrigades(); renderGenerals(); renderArmies(); 
            }

            // Fix the function call and remove duplicate event handlers
            // ...existing code...
        }

    }


    document.getElementById('info-link').onclick = (e) => {
        e.preventDefault();
        window.location.hash = 'info';
    };
    document.getElementById('sim-link').onclick = (e) => {
        e.preventDefault();
        window.location.hash = 'simulator';
    };

    // Hash-based routing: render correct view on hash change or page load
    function handleRoute() {
        const hash = window.location.hash.replace('#', '');
        render(hash || 'simulator');
    }
    window.addEventListener('hashchange', handleRoute);
    handleRoute(); // Initial render

    // Consolidate all onload functionalities here
    function initializeApp() {
        displayCalendar();
        renderTutorial();
        if (typeof setupDarkModeToggle === 'function') setupDarkModeToggle();
        if (typeof renderBattleStatistics === 'function') renderBattleStatistics();
        if (typeof render3DScene === 'function') render3DScene();
        setupBackgroundMusic();
    }

    if (document.readyState === 'complete' || (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
        initializeApp();
    } else {
        document.addEventListener('DOMContentLoaded', initializeApp);
    }

    // Add a calendar display to show the current day and its phase
function displayCalendar() {
    const calendarContainer = document.getElementById('calendar');
    if (!calendarContainer) return;

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const today = new Date();
    const currentDay = daysOfWeek[today.getDay() - 1]; // Adjust for Sunday being 0

    let phase;
    switch (currentDay) {
        case "Monday":
            phase = "Rest Day";
            break;
        case "Tuesday":
        case "Wednesday":
            phase = "Organization Phase";
            break;
        case "Thursday":
        case "Friday":
            phase = "Movement Phase";
            break;
        case "Saturday":
        case "Sunday":
            phase = "Battle Phase";
            break;
        default:
            phase = "Unknown Phase";
    }

    calendarContainer.innerHTML = `
        <div class="calendar" style="text-align:center; padding:1rem; background:#fff; border-radius:8px;">
            <h2 style="font-size:1.25rem; font-weight:bold;">Today is: ${currentDay}</h2>
            <p style="font-size:1.1rem;">Phase: ${phase}</p>
        </div>
    `;
}

// Fix the renderTutorial function by properly closing the img tag
function renderTutorial() {
    const tutorialContainer = document.getElementById('tutorial');
    if (!tutorialContainer) return;

    tutorialContainer.innerHTML = `
        <div class="tutorial">
            <h2>📖 Warfare Tutorial</h2>
            <section>
                <h3>The Basics</h3>
                <p>
                    <img src="images/basics.png" alt="Basics" 
                         style="width:100%;max-width:400px;display:block;margin:auto;" />
                    Learn the fundamental rules of warfare, including how to create brigades, generals, and armies.
                </p>
            </section>
        </div>
    `;
}

// All separate window.onload assignments have been consolidated into initializeApp
}
