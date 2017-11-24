const fs = require('fs');

let customKeyIdentifier = fs.readFileSync('customKeyIdentifier.txt', 'utf-8').trim();
let value = fs.readFileSync('value.txt', 'utf-8').trim();
let key = {
  "customKeyIdentifier": customKeyIdentifier,
  "keyId": process.env.APPLICATION_ID,
  "type": "AsymmetricX509Cert",
  "usage": "Verify",
  "value": value
};
console.log(JSON.stringify(key, null, "  "));
