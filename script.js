const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const chatOverlay = document.getElementById('chatOverlay');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');

// --- GAME LOGIC ---
let player = { x: 400, y: 250, size: 20, speed: 4, color: '#ff4757' };
let keys = {};
let isTyping = false;

// Listen for game movement keys
window.addEventListener('keydown', (e) => { keys[e.key] = true; });
window.addEventListener('keyup', (e) => { keys[e.key] = false; });

function updateGame() {
    // ONLY move the player if they aren't currently typing in chat
    if (!isTyping) {
        if (keys['ArrowUp'] || keys['w'] || keys['W']) player.y -= player.speed;
        if (keys['ArrowDown'] || keys['s'] || keys['S']) player.y += player.speed;
        if (keys['ArrowLeft'] || keys['a'] || keys['A']) player.x -= player.speed;
        if (keys['ArrowRight'] || keys['d'] || keys['D']) player.x += player.speed;

        // Prevent player from leaving canvas boundaries
        player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
        player.y = Math.max(0, Math.min(canvas.height - player.size, player.y));
    }
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear screen
    
    // Draw a simple block player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.size, player.size);

    // Draw some instructions on canvas background
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.font = '16px sans-serif';
    ctx.fillText("Use WASD / Arrows to Move", 300, 30);
}

function gameLoop() {
    updateGame();
    drawGame();
    requestAnimationFrame(gameLoop);
}
gameLoop(); // Start the game loop


// --- OVERLAY CHAT LOGIC ---
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        if (!isTyping) {
            // 1. Open Chat Mode
            isTyping = true;
            chatOverlay.classList.add('active');
            chatInput.focus();
            // Clear movement keys so player doesn't keep sliding while typing
            keys = {}; 
        } else {
            // 2. Submit Message & Close Chat Mode
            const text = chatInput.value.trim();
            if (text !== "") {
                appendMessage("You", text);
                chatInput.value = ""; // Empty out field
            }
            isTyping = false;
            chatOverlay.classList.remove('active');
            chatInput.blur(); 
        }
    }
});

function appendMessage(sender, message) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('chat-msg');
    msgDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatMessages.appendChild(msgDiv);
    
    // Smoothly scroll to the newest message
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
