const fs = require('fs');
const crypto = require('crypto');

// Generate a random API key
const apiKey = crypto.randomBytes(32).toString('hex');

// Print the API key to the console
console.log('Generated API key:', apiKey);

// Write the API key to a file
fs.writeFileSync('api-key.txt', apiKey);

console.log('API key generated and saved successfully.');
