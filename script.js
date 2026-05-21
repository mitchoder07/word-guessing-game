/**
 * Word Guessing Game – Spaces supported, Streak Tracker
 * Author: Yusuf A.O (Upin)
 */

// ---------- WORD BANK (50+ words) ----------
const WORDS = [
    { word: "FIREWALL", hint: "A network security system that monitors and controls traffic." },
    { word: "ENCRYPTION", hint: "Scrambling data so only authorized people can read it." },
    { word: "PHISHING", hint: "Fraudulent attempt to get sensitive info by pretending to be trustworthy." },
    { word: "MALWARE", hint: "Malicious software that harms or exploits devices." },
    { word: "HASHING", hint: "Converting data into a fixed-size string for integrity checks." },
    { word: "SPYWARE", hint: "Software that secretly monitors user activity." },
    { word: "PROTOCOL", hint: "Set of rules for data exchange between devices." },
    { word: "BREACH", hint: "Unauthorized access to data." },
    { word: "PASSWORD", hint: "Secret string used for authentication." },
    { word: "TROJAN", hint: "Malware disguised as legitimate software." },
    { word: "SPOOFING", hint: "Faking communication origin to appear trusted." },
    { word: "ROOTKIT", hint: "Stealthy malware that hides its presence." },
    { word: "KEYLOGGER", hint: "Records every keystroke on a computer." },
    { word: "ADWARE", hint: "Software that displays unwanted ads." },
    { word: "RANSOMWARE", hint: "Encrypts files and demands payment." },
    { word: "CYBER", hint: "Relating to computers and information technology." },
    { word: "AUTHENTICATION", hint: "Verifying the identity of a user or device." },
    { word: "VULNERABILITY", hint: "Weakness that can be exploited." },
    { word: "EXPLOIT", hint: "Code that takes advantage of a vulnerability." },
    { word: "BACKDOOR", hint: "Hidden method to bypass authentication." },
    { word: "DDOS", hint: "Flooding a server with traffic to make it unavailable." },
    { word: "PENETRATION", hint: "Simulated attack to test defenses." },
    { word: "FORENSICS", hint: "Investigation of cyber crimes and digital evidence." },
    { word: "CLOUD", hint: "Internet-based computing resources on demand." },
    { word: "SESSION", hint: "Temporary interaction between user and system." },
    { word: "TOKEN", hint: "Digital key for secure authentication." },
    { word: "VPN", hint: "Encrypts your internet connection for privacy." },
    { word: "WORM", hint: "Self-replicating malware that spreads automatically." },
    { word: "BOTNET", hint: "Network of infected computers controlled remotely." },
    { word: "PATCH", hint: "Update that fixes security vulnerabilities." },
    { word: "ZERO DAY", hint: "Vulnerability unknown to the software vendor." },
    { word: "SOCIAL", hint: "Manipulating people to give up confidential info." },
    { word: "HONEYPOT", hint: "Decoy system to attract attackers." },
    { word: "BIOMETRICS", hint: "Using fingerprints or face for authentication." },
    { word: "WHITELIST", hint: "List of approved items allowed access." },
    { word: "BLACKLIST", hint: "List of blocked items denied access." },
    { word: "SANDBOX", hint: "Isolated environment to test suspicious code." },
    { word: "COOKIE", hint: "Small data stored by websites in your browser." },
    { word: "CERTIFICATE", hint: "Digital document verifying identity (SSL)." },
    { word: "HASH", hint: "Fixed-size output from a hash function." },
    { word: "SALT", hint: "Random data added to passwords before hashing." },
    { word: "BRUTE FORCE", hint: "Trying all possible password combinations." },
    { word: "DICTIONARY", hint: "Attack using common words to guess passwords." },
    { word: "MAN IN THE MIDDLE", hint: "Intercepting communication between two parties." },
    { word: "XSS", hint: "Injecting malicious scripts into web pages." },
    { word: "SQL INJECTION", hint: "Attacking database queries with malicious input." },
    { word: "CSRF", hint: "Tricking users into performing unwanted actions." },
    { word: "OWASP", hint: "Organization listing top web app security risks." },
    { word: "NMAP", hint: "Network scanning and discovery tool." },
    { word: "WIRESHARK", hint: "Network protocol analyzer for packet inspection." },
    { word: "METASPLOIT", hint: "Penetration testing framework for exploiting vulnerabilities." },
    { word: "BURP SUITE", hint: "Web application security testing proxy." },
    { word: "NESSUS", hint: "Vulnerability scanner by Tenable." },
    { word: "OPENVAS", hint: "Open-source vulnerability scanner." },
    { word: "HYDRA", hint: "Fast network logon cracker tool." }
];

// ---------- GAME STATE ----------
let currentWordObj = null;
let guessedLetters = new Set();
let remainingChances = 6;
let gameOver = false;
let winStreak = 0;

// ---------- DOM ELEMENTS ----------
const wordDisplayEl = document.getElementById("wordDisplay");
const chancesCountEl = document.getElementById("chancesCount");
const keyboardEl = document.getElementById("keyboard");
const messageEl = document.getElementById("message");
const hintBtn = document.getElementById("hintBtn");
const hintTextEl = document.getElementById("hintText");
const newGameBtn = document.getElementById("newGameBtn");
const streakBadge = document.getElementById("streakBadge");

// ---------- HELPER FUNCTIONS ----------
function getRandomWordObj() {
    return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function updateStreakDisplay() {
    if (winStreak > 0) {
        let text = `🔥 Streak: ${winStreak}`;
        if (winStreak >= 10) {
            text = `👑 Legendary Streak: ${winStreak}`;
        } else if (winStreak >= 5) {
            text = `⚡ Hot Streak: ${winStreak}`;
        } else if (winStreak >= 3) {
            text = `🔥 Streak: ${winStreak}`;
        }
        streakBadge.textContent = text;
    } else {
        streakBadge.textContent = "No active streak";
    }
}

function updateUI() {
    const display = currentWordObj.word
        .split("")
        .map(ch => {
            if (ch === " ") return " ";   // space shown as-is
            return guessedLetters.has(ch) ? ch : "_";
        })
        .join(" ");
    wordDisplayEl.textContent = display;
    chancesCountEl.textContent = remainingChances;
}

function checkWin() {
    return currentWordObj.word
        .split("")
        .every(ch => ch === " " || guessedLetters.has(ch));
}

function endGame(won) {
    gameOver = true;
    if (won) {
        winStreak++;
        let streakMsg = "";
        if (winStreak >= 10) {
            streakMsg = ` 👑 ${winStreak} in a row! Legendary streak!`;
        } else if (winStreak >= 5) {
            streakMsg = ` ⚡ ${winStreak} wins in a row! Unstoppable!`;
        } else if (winStreak >= 3) {
            streakMsg = ` 🔥 ${winStreak} in a row! You're on fire!`;
        } else {
            streakMsg = ` (Streak: ${winStreak})`;
        }
        messageEl.textContent = `🎉 You win! The word was ${currentWordObj.word}.${streakMsg}`;
        messageEl.className = "message win";
    } else {
        winStreak = 0;
        messageEl.textContent = `💀 Game over! The word was ${currentWordObj.word}. Streak reset.`;
        messageEl.className = "message lose";
    }
    updateStreakDisplay();
    document.querySelectorAll(".key").forEach(btn => btn.disabled = true);
}

function handleGuess(letter, button) {
    if (gameOver) return;

    if (guessedLetters.has(letter)) {
        messageEl.textContent = `You already guessed "${letter}".`;
        messageEl.className = "message";
        return;
    }

    guessedLetters.add(letter);
    button.disabled = true;
    button.style.opacity = "0.3";

    if (!currentWordObj.word.includes(letter)) {
        remainingChances--;
        messageEl.textContent = `Wrong! No "${letter}" in the word.`;
        messageEl.className = "message";
    } else {
        messageEl.textContent = `Good guess!`;
        messageEl.className = "message";
    }

    hintTextEl.textContent = "";
    updateUI();

    if (checkWin()) {
        endGame(true);
    } else if (remainingChances <= 0) {
        endGame(false);
    }
}

function createKeyboard() {
    keyboardEl.innerHTML = "";
    for (let charCode = 65; charCode <= 90; charCode++) {
        const letter = String.fromCharCode(charCode);
        const button = document.createElement("button");
        button.textContent = letter;
        button.classList.add("key");
        button.addEventListener("click", () => handleGuess(letter, button));
        keyboardEl.appendChild(button);
    }
}

function showHint() {
    if (gameOver) return;
    hintTextEl.textContent = `💡 Hint: ${currentWordObj.hint}`;
}

function resetGame() {
    currentWordObj = getRandomWordObj();
    guessedLetters.clear();
    remainingChances = 6;
    gameOver = false;

    messageEl.textContent = "";
    messageEl.className = "message";
    hintTextEl.textContent = "";

    createKeyboard();
    updateUI();
    updateStreakDisplay();
}

// ---------- EVENT LISTENERS ----------
hintBtn.addEventListener("click", showHint);
newGameBtn.addEventListener("click", resetGame);

// ---------- INITIALISE ----------
resetGame();