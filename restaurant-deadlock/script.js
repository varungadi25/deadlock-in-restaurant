// Global State
let state = {
    chefs: {
        1: { utensils: [], needs: 2, waiting: false },
        2: { utensils: [], needs: 2, waiting: false },
        3: { utensils: [], needs: 2, waiting: false },
        4: { utensils: [], needs: 2, waiting: false }
    },
    deadlockDetected: false
};

// Drag and Drop Functions
function allowDrop(event) {
    event.preventDefault();
    event.target.closest('.chef').classList.add('drag-over');
}

function drag(event) {
    const utensil = event.target.dataset.utensil;
    event.dataTransfer.setData("utensil", utensil);
    event.dataTransfer.setData("utensilId", event.target.id);
}

function drop(event) {
    event.preventDefault();
    const chef = event.target.closest('.chef');
    chef.classList.remove('drag-over');
    
    const utensilType = event.dataTransfer.getData("utensil");
    const utensilId = event.dataTransfer.getData("utensilId");
    const chefNum = chef.dataset.chef;
    
    // Check if utensil is already assigned
    const utensilElement = document.getElementById(utensilId);
    if (utensilElement.classList.contains('assigned')) {
        alert("This utensil is already in use!");
        return;
    }
    
    // Assign utensil to chef
    assignUtensil(chefNum, utensilType, utensilId);
}

// Assign Utensil to Chef
function assignUtensil(chefNum, utensilType, utensilId) {
    // Add to chef's utensils
    state.chefs[chefNum].utensils.push(utensilType);
    
    // Update UI
    const chefUtensilsDiv = document.getElementById(`chef${chefNum}-utensils`);
    const utensilClone = document.createElement('span');
    utensilClone.textContent = getUtensilEmoji(utensilType);
    utensilClone.style.fontSize = '2em';
    chefUtensilsDiv.appendChild(utensilClone);
    
    // Mark utensil as assigned
    document.getElementById(utensilId).classList.add('assigned');
    
    // Update chef needs
    const remaining = state.chefs[chefNum].needs - state.chefs[chefNum].utensils.length;
    document.getElementById(`chef${chefNum}-needs`).textContent = `${remaining} more utensils`;
    
    // Update status
    if (remaining > 0) {
        document.getElementById(`chef${chefNum}-status`).textContent = "Waiting for more...";
        state.chefs[chefNum].waiting = true;
        document.querySelector(`[data-chef="${chefNum}"]`).classList.add('waiting');
    } else {
        document.getElementById(`chef${chefNum}-status`).textContent = "Cooking! 🎉";
        state.chefs[chefNum].waiting = false;
        document.querySelector(`[data-chef="${chefNum}"]`).classList.remove('waiting');
    }
    
    // Check for deadlock
    setTimeout(checkDeadlock, 500);
}

// Get Utensil Emoji
function getUtensilEmoji(type) {
    const emojis = {
        knife: '🔪',
        pan: '🍳',
        spatula: '🥄',
        bowl: '🥣'
    };
    return emojis[type] || '🍴';
}

// Check for Deadlock
function checkDeadlock() {
    // Count waiting chefs
    let waitingCount = 0;
    let allHaveOne = true;
    
    for (let chef in state.chefs) {
        if (state.chefs[chef].waiting) {
            waitingCount++;
        }
        if (state.chefs[chef].utensils.length === 0) {
            allHaveOne = false;
        }
    }
    
    // Deadlock: All chefs waiting and each has at least one utensil
    if (waitingCount === 4 && allHaveOne) {
        state.deadlockDetected = true;
        showDeadlockAlert();
        updateCircularWaitCondition(true);
    }
}

// Show Deadlock Alert
function showDeadlockAlert() {
    const alert = document.getElementById('deadlockAlert');
    alert.style.display = 'block';
    
    // Show circular chain
    const chain = "Chef A → Chef B → Chef C → Chef D → Chef A";
    document.getElementById('circularChain').textContent = chain;
    
    // Update status badge
    const statusBadge = document.querySelector('.status-badge');
    statusBadge.textContent = '🚨 DEADLOCK!';
    statusBadge.className = 'status-badge deadlock';
    
    // Add visual effects
    document.querySelectorAll('.chef').forEach(chef => {
        chef.style.border = '3px solid #ef4444';
    });
}

// Update Circular Wait Condition
function updateCircularWaitCondition(isCircular) {
    const circularLi = document.getElementById('circular');
    if (isCircular) {
        circularLi.innerHTML = '🔴 Circular Wait - DETECTED!';
        circularLi.style.color = '#ef4444';
        circularLi.style.fontWeight = 'bold';
    } else {
        circularLi.innerHTML = '⏳ Circular Wait - Not Yet';
        circularLi.style.color = '#666';
        circularLi.style.fontWeight = 'normal';
    }
}

// Create Deadlock Scenario
function createDeadlock() {
    resetKitchen();
    
    setTimeout(() => {
        // Chef A gets knife
        assignUtensil('1', 'knife', 'knife');
    }, 500);
    
    setTimeout(() => {
        // Chef B gets pan
        assignUtensil('2', 'pan', 'pan');
    }, 1000);
    
    setTimeout(() => {
        // Chef C gets spatula
        assignUtensil('3', 'spatula', 'spatula');
    }, 1500);
    
    setTimeout(() => {
        // Chef D gets bowl
        assignUtensil('4', 'bowl', 'bowl');
    }, 2000);
    
    setTimeout(() => {
        alert("Now each chef is waiting for another utensil that someone else has!\nThis creates a DEADLOCK! 🚨");
    }, 2500);
}

// Reset Kitchen
function resetKitchen() {
    // Reset state
    for (let chef in state.chefs) {
        state.chefs[chef].utensils = [];
        state.chefs[chef].waiting = false;
        
        // Clear UI
        document.getElementById(`chef${chef}-utensils`).innerHTML = '';
        document.getElementById(`chef${chef}-needs`).textContent = '2 utensils';
        document.getElementById(`chef${chef}-status`).textContent = 'Idle';
        document.querySelector(`[data-chef="${chef}"]`).classList.remove('waiting');
        document.querySelector(`[data-chef="${chef}"]`).style.border = '3px dashed transparent';
    }
    
    // Reset utensils
    document.querySelectorAll('.utensil').forEach(utensil => {
        utensil.classList.remove('assigned');
    });
    
    // Hide deadlock alert
    document.getElementById('deadlockAlert').style.display = 'none';
    
    // Reset status badge
    const statusBadge = document.querySelector('.status-badge');
    statusBadge.textContent = 'System Ready';
    statusBadge.className = 'status-badge ready';
    
    // Reset circular wait
    updateCircularWaitCondition(false);
    
    state.deadlockDetected = false;
}

// Prevention Methods

function showResourceOrdering() {
    const modal = document.getElementById('explanationModal');
    document.getElementById('modalTitle').textContent = '📋 Resource Ordering Prevention';
    document.getElementById('modalBody').innerHTML = `
        <p><strong>Concept:</strong> Assign a global order to all resources and require processes to request resources in that order.</p>
        
        <p><strong>In Our Kitchen:</strong></p>
        <ul>
            <li><strong>Order:</strong> Knife (1) → Pan (2) → Spatula (3) → Bowl (4)</li>
            <li>Rule: Chefs MUST request utensils in this order</li>
            <li>Chef cannot request Spatula before getting Pan</li>
        </ul>
        
        <p><strong>How it Prevents Deadlock:</strong></p>
        <p>Breaks the <strong>Circular Wait</strong> condition. If everyone follows the same order, circular dependencies cannot form.</p>
        
        <p><strong>Example:</strong></p>
        <ul>
            <li>Chef A: Gets Knife(1), wants Pan(2) ✅</li>
            <li>Chef B: Gets Pan(2), wants Spatula(3) ✅</li>
            <li>Chef C: Cannot get Spatula(3) before Pan(2)</li>
            <li>No circular wait possible!</li>
        </ul>
        
        <p style="background: #d1fae5; padding: 10px; border-radius: 5px; margin-top: 15px;">
            <strong>Result:</strong> Deadlock is impossible with resource ordering!
        </p>
    `;
    modal.style.display = 'block';
}

function showTimeout() {
    const modal = document.getElementById('explanationModal');
    document.getElementById('modalTitle').textContent = '⏱️ Timeout Prevention';
    document.getElementById('modalBody').innerHTML = `
        <p><strong>Concept:</strong> If a process cannot acquire all needed resources within a time limit, it releases held resources and tries again later.</p>
        
        <p><strong>In Our Kitchen:</strong></p>
        <ul>
            <li>Set timeout: 30 seconds per utensil wait</li>
            <li>If Chef waits too long, release current utensil</li>
            <li>Wait random time, then retry</li>
        </ul>
        
        <p><strong>How it Prevents Deadlock:</strong></p>
        <p>Breaks the <strong>Hold and Wait</strong> condition. Processes don't indefinitely hold resources while waiting.</p>
        
        <p><strong>Example Scenario:</strong></p>
        <ol>
            <li>Chef A has Knife, waiting for Pan (30 sec)</li>
            <li>Timeout expires → Chef A releases Knife</li>
            <li>Chef B can now get Knife</li>
            <li>Chef A waits and retries later</li>
        </ol>
        
        <p style="background: #fef3c7; padding: 10px; border-radius: 5px; margin-top: 15px;">
            <strong>Trade-off:</strong> May reduce efficiency (processes restart), but prevents permanent deadlock.
        </p>
    `;
    modal.style.display = 'block';
}

function showBankerAlgorithm() {
    const modal = document.getElementById('explanationModal');
    document.getElementById('modalTitle').textContent = '🏦 Banker\'s Algorithm';
    document.getElementById('modalBody').innerHTML = `
        <p><strong>Concept:</strong> Only grant resource requests if the system will remain in a "safe state" after allocation.</p>
        
        <p><strong>Safe State:</strong> A state where there exists at least one sequence of resource allocation that allows all processes to complete.</p>
        
        <p><strong>In Our Kitchen:</strong></p>
        <ul>
            <li><strong>Available:</strong> Total utensils in storage</li>
            <li><strong>Maximum Need:</strong> Each chef needs 2 utensils</li>
            <li><strong>Currently Allocated:</strong> What each chef has</li>
            <li><strong>Remaining Need:</strong> Max - Allocated</li>
        </ul>
        
        <p><strong>Algorithm Steps:</strong></p>
        <ol>
            <li>Chef requests utensil</li>
            <li>System checks: "If I grant this, can all chefs eventually finish?"</li>
            <li>Run simulation to find safe sequence</li>
            <li>If safe sequence exists → Grant request ✅</li>
            <li>If no safe sequence → Deny request ❌ (chef waits)</li>
        </ol>
        
        <p><strong>Example:</strong></p>
        <div style="background: #f3f4f6; padding: 10px; border-radius: 5px; margin: 10px 0;">
            <strong>Scenario:</strong><br>
            • Available: Knife, Pan (2 utensils)<br>
            • Chef A has: Bowl (needs 1 more)<br>
            • Chef B has: Spatula (needs 1 more)<br>
            • Chef C has: Nothing (needs 2)<br><br>
            
            <strong>Safe Sequence Check:</strong><br>
            1. Give Knife to Chef A → A finishes, releases Bowl + Knife<br>
            2. Now available: Bowl, Knife, Pan (3 utensils)<br>
            3. Give Pan to Chef B → B finishes, releases Spatula + Pan<br>
            4. Now available: Bowl, Knife, Pan, Spatula (4 utensils)<br>
            5. Give 2 to Chef C → C finishes<br>
            ✅ Safe sequence found: A → B → C
        </div>
        
        <p style="background: #dbeafe; padding: 10px; border-radius: 5px; margin-top: 15px;">
            <strong>Result:</strong> Deadlock is avoided by ensuring system always stays in safe state!
        </p>
        
        <p><strong>Breaks Condition:</strong> Prevents <strong>Circular Wait</strong> through intelligent resource allocation.</p>
    `;
    modal.style.display = 'block';
}

// Close Modal
function closeModal() {
    document.getElementById('explanationModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('explanationModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Initialize on load
window.onload = function() {
    console.log("Restaurant Kitchen Simulator Loaded!");
    console.log("Drag utensils to chefs to see deadlock in action!");
};

// Add keyboard shortcuts
document.addEventListener('keydown', function(event) {
    if (event.key === 'r' || event.key === 'R') {
        resetKitchen();
    }
    if (event.key === 'd' || event.key === 'D') {
        createDeadlock();
    }
    if (event.key === 'Escape') {
        closeModal();
        document.getElementById('deadlockAlert').style.display = 'none';
    }
});

// Add visual feedback
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to chefs
    document.querySelectorAll('.chef').forEach(chef => {
        chef.addEventListener('dragenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        chef.addEventListener('dragleave', function() {
            this.style.transform = 'scale(1)';
        });
        
        chef.addEventListener('drop', function() {
            this.style.transform = 'scale(1)';
        });
    });
});