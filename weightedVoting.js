// weightedVoting.js

// Functional Weighted Voting System
// Based on factors: Expertise (E), Participation (P), Decision Quality (D), Alignment (A), Stake (S)

window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('votingSystem');

    // Default coefficient weights (must sum to 1)
    let coefficients = { E: 0.25, P: 0.2, D: 0.3, A: 0.15, S: 0.1 };
    let voters = [];

    // Create UI elements
    const coefForm = document.createElement('div');
    coefForm.innerHTML = `<h3 class="text-xl font-semibold mb-2">Coefficient Weights (sum = 1)</h3>
    <div class="grid grid-cols-5 gap-2 mb-4">
        ${['E','P','D','A','S'].map(f => `
        <div>
            <label for="coef_${f}" class="block font-medium">${f}</label>
            <input id="coef_${f}" type="number" min="0" max="1" step="0.01" value="${coefficients[f]}" class="border p-1 rounded w-full" />
        </div>`).join('')}
    </div>
    <button id="updateCoefs" class="bg-blue-500 text-white px-3 py-1 rounded mb-4">Update Coefficients</button>
    <div id="coefError" class="text-red-500 mb-2"></div>`;
    container.appendChild(coefForm);

    const table = document.createElement('table');
    table.className = 'w-full mb-4 border-collapse';
    table.innerHTML = `<thead>
        <tr class="bg-gray-100">
            <th class="border p-1">Name</th>
            <th class="border p-1">E (0-1)</th>
            <th class="border p-1">P (0-1)</th>
            <th class="border p-1">D (0-1)</th>
            <th class="border p-1">A (0-1)</th>
            <th class="border p-1">S (0-1)</th>
            <th class="border p-1">Vote</th>
            <th class="border p-1">Actions</th>
        </tr>
    </thead>
    <tbody id="voterList"></tbody>`;
    container.appendChild(table);

    const addBtn = document.createElement('button');
    addBtn.textContent = 'Add Voter';
    addBtn.className = 'bg-green-500 text-white px-3 py-1 rounded mr-2';
    container.appendChild(addBtn);

    const calcBtn = document.createElement('button');
    calcBtn.textContent = 'Calculate Result';
    calcBtn.className = 'bg-purple-500 text-white px-3 py-1 rounded';
    container.appendChild(calcBtn);

    const resultDiv = document.createElement('div');
    resultDiv.id = 'voteResult';
    resultDiv.className = 'mt-4 text-lg font-medium';
    container.appendChild(resultDiv);

    // Functions
    function renderVoters() {
        const tbody = document.getElementById('voterList');
        tbody.innerHTML = '';
        voters.forEach((voter, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
            <td class="border p-1"><input type="text" value="${voter.name}" class="border p-1 rounded w-full" data-idx="${idx}" data-field="name" /></td>
            ${['E','P','D','A','S'].map(f => `
            <td class="border p-1"><input type="number" min="0" max="1" step="0.01" value="${voter[f]}" class="border p-1 rounded w-full" data-idx="${idx}" data-field="${f}" /></td>`).join('')}
            <td class="border p-1">
                <select class="border p-1 rounded w-full" data-idx="${idx}" data-field="vote">
                    <option value="yes" ${voter.vote==='yes'?'selected':''}>Yes</option>
                    <option value="no" ${voter.vote==='no'?'selected':''}>No</option>
                    <option value="abstain" ${voter.vote==='abstain'?'selected':''}>Abstain</option>
                </select>
            </td>
            <td class="border p-1 text-center">
                <button class="text-red-500" data-idx="${idx}" data-action="remove">✖</button>
            </td>`;
            tbody.appendChild(tr);
        });
        // Attach listeners
        tbody.querySelectorAll('input, select').forEach(el => {
            el.addEventListener('change', e => {
                const idx = e.target.dataset.idx;
                const field = e.target.dataset.field;
                voters[idx][field] = field==='name' ? e.target.value : (field==='vote' ? e.target.value : parseFloat(e.target.value));
            });
        });
        tbody.querySelectorAll('button[data-action="remove"]').forEach(btn => {
            btn.addEventListener('click', e => {
                const idx = e.target.dataset.idx;
                voters.splice(idx, 1);
                renderVoters();
            });
        });
    }

    function addVoter() {
        voters.push({ name: `Voter ${voters.length+1}`, E: 0.5, P: 0.5, D: 0.5, A: 0.5, S: 0.5, vote: 'yes' });
        renderVoters();
    }

    function calculateResult() {
        // validate coefficients sum
        const sum = Object.keys(coefficients).reduce((s, k) => s + coefficients[k], 0);
        if (Math.abs(sum - 1) > 0.001) {
            document.getElementById('coefError').textContent = 'Coefficients must sum to 1.';
            return;
        }
        document.getElementById('coefError').textContent = '';

        // compute weights and aggregate
        let yes = 0, no = 0;
        voters.forEach(v => {
            const W = coefficients.E * v.E + coefficients.P * v.P + coefficients.D * v.D + coefficients.A * v.A + coefficients.S * v.S;
            if (v.vote === 'yes') yes += W;
            else if (v.vote === 'no') no += W;
        });
        const total = yes + no;
        const yesPct = total ? ((yes/total)*100).toFixed(1) : 0;
        const noPct = total ? ((no/total)*100).toFixed(1) : 0;
        let outcome = yes > no ? 'Passed' : yes < no ? 'Failed' : 'Tie';
        resultDiv.innerHTML = `Yes: ${yes.toFixed(2)} (${yesPct}%)<br/>No: ${no.toFixed(2)} (${noPct}%)<br/><strong>${outcome}</strong>`;
    }

    // Event listeners
    document.getElementById('updateCoefs').addEventListener('click', () => {
        const newCoefs = {};
        ['E','P','D','A','S'].forEach(f => {
            newCoefs[f] = parseFloat(document.getElementById(`coef_${f}`).value) || 0;
        });
        coefficients = newCoefs;
        renderVoters();
    });
    addBtn.addEventListener('click', addVoter);
    calcBtn.addEventListener('click', calculateResult);

    // initialize
    addVoter();
    addVoter();
});
