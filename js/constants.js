// Discord Lanyard API Setup
const DISCORD_USER_ID = '742692894292443187'; // <--- UID DISCORD
const LANYARD_API_URL = `https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`;

// Typing Effect Data
const texts = ["Developer", "REN"];

let isMuted = true;
let textIndex = 0, charIndex = 0, isDeleting = false;
