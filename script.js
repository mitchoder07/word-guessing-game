/**
 * Word Guessing Game (Hangman Style) – with Hints
 * Author: Yusuf Abdullah Olaniyi
 * Description: A cybersecurity-themed word guessing game with a built-in hint system.
 */

// ---------- WORD BANK (30 terms with hints) ----------
const WORDS = [
    { word: "FIREWALL", hint: "A network security system that monitors and controls incoming/outgoing traffic." },
    { word: "ENCRYPTION", hint: "The process of converting data into a secret code to prevent unauthorised access." },
    { word: "PHISHING", hint: "A fraudulent attempt to obtain sensitive information by pretending to be a trustworthy entity." },
    { word: "MALWARE", hint: "Malicious software designed to damage, disrupt, or gain unauthorised access to a system." },
    { word: "HASHING", hint: "Converting data into a fixed-size string of characters, typically for integrity checks." },
    { word: "SPYWARE", hint: "Software that secretly monitors and collects user information without their knowledge." },
    { word: "PROTOCOL", hint: "A set of rules governing the exchange of data between devices." },
    { word: "BREACH", hint: "An incident where data is accessed without authorisation." },
    { word: "PASSWORD", hint: "A secret string of characters used for user authentication." },
    { word: "TROJAN", hint: "Malware disguised as legitimate software to trick users into installing it." },
    { word: "SPOOFING", hint: "Faking the origin of communication to appear as a trusted source." },
    { word: "ROOTKIT", hint: "A stealthy type of malware that hides its presence from the operating system." },
    { word: "KEYLOGGER", hint: "A program that records every keystroke made on a computer." },
    { word: "ADWARE", hint: "Software that automatically displays unwanted advertisements." },
    { word: "RANSOMWARE", hint: "Malware that encrypts files and demands payment for their release." },
    { word: "CYBER", hint: "Relating to computers, information technology, and virtual reality." },
    { word: "AUTHENTICATION", hint: "The process of verifying the identity of a user or device." },
    { word: "VULNERABILITY", hint: "A weakness in a system that can be exploited to cause harm." },
    { word: "EXPLOIT", hint: "A piece of software or technique that takes advantage of a vulnerability." },
    { word: "BACKDOOR", hint: "A hidden method of bypassing normal authentication to access a system." },
    { word: "DDOS", hint: "A distributed denial-of-service attack that overwhelms a target with traffic." },
    { word: "PENETRATION", hint: "Testing a system's security by simulating an attack (pen testing)." },
    { word: "FORENSICS", hint: "The investigation of cyber crimes and collection of digital evidence." },
    { word: "CLOUD", hint: "Internet-based computing that provides shared resources on demand." },
    { word: "SESSION", hint: "A temporary interaction between a user and a system." },
    { word: "TOKEN", hint: "A digital key used for secure authentication or authorisation." },
    { word: "VPN", hint: "A virtual private network that encrypts internet connections for privacy." },
    { word: "WORM", hint: "A self-replicating malware that spreads without human interaction." },
    { word: "BOTNET", hint: "A network of infected computers controlled remotely by an attacker." },
    { word: "PATCH", hint: "An update designed to fix security vulnerabilities in software." }
];

// ---------- GAME STATE ----------
let currentWordObj = null;
let guessedLetters = new Set();
let remainingChances = 6;
let gameOver = false;

// ---------- DOM ELEMENTS ----------
const wordDisplayEl = document.getElementById("wordDisplay");
const chancesCountEl = document.getElementById("chancesCount");
const keyboardEl = document.getElementById("keyboard");
const messageEl = document.getElementById("message");
const hintBtn = document.getElementById("hintBtn");
const hintTextEl = document.getElementById("hintText");
const newGameBtn = document.getElementById("newGameBtn");

// ---------- HELPER FUNCTIONS ----------
function getRandomWordObj() {
    return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function updateUI() {
    // Update word display (show only guessed letters, rest as underscores)
    const display = currentWordObj.word
        .split("")
        .map(letter => guessedLetters.has(letter) ? letter : "_")
        .join(" ");
    wordDisplayEl.textContent = display;

    // Update chances
    chancesCountEl.textContent = remainingChances;
}

function checkWin() {
    return currentWordObj.word.split("").every(letter => guessedLetters.has(letter));
}

function endGame(won) {
    gameOver = true;
    if (won) {
        messageEl.textContent = `Hooray, 🎉 Keep it Up! The word was ${currentWordObj.word}.`;
        messageEl.className = "message win";
    } else {
        messageEl.textContent = `💀 Game over! The word was ${currentWordObj.word}.`;
        messageEl.className = "message lose";
    }
    // Disable all keyboard buttons
    document.querySelectorAll(".key").forEach(btn => btn.disabled = true);
}

// ---------- GAME LOGIC ----------
function handleGuess(letter, button) {
    if (gameOver) return;

    // Ignore repeated guesses
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

    // Clear any previously shown hint
    hintTextEl.textContent = "";

    updateUI();

    // Check win/loss conditions
    if (checkWin()) {
        endGame(true);
    } else if (remainingChances <= 0) {
        endGame(false);
    }
}

// ---------- BUILD KEYBOARD ----------
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

// ---------- HINT FUNCTIONALITY ----------
function showHint() {
    if (gameOver) return;
    hintTextEl.textContent = `💡 Hint: ${currentWordObj.hint}`;
    // Hint does not cost a chance
}

// ---------- RESET GAME ----------
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
}

// ---------- EVENT LISTENERS ----------
hintBtn.addEventListener("click", showHint);
newGameBtn.addEventListener("click", resetGame);

// ---------- INITIALISE ----------
resetGame();