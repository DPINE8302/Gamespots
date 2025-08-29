const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

if (!html.includes('<h1>Game Center</h1>')) {
  console.error('Missing header');
  process.exit(1);
}

const cardCount = (html.match(/class="game-card"/g) || []).length;
if (cardCount !== 3) {
  console.error(`Expected 3 game cards, found ${cardCount}`);
  process.exit(1);
}

console.log('All tests passed.');
