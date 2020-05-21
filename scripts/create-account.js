const StellarSdk = require("stellar-sdk");
const fetch = require("node-fetch");

// Create a new keypair.
const pair = StellarSdk.Keypair.random();



/**
 * Create an account in TestNet
 */
async function createTestAccount() {
    try {

        console.log('Funding a new account on the test network (takes a few seconds)...');
    
        // Create account in TestNet using friendbot
        const response = await fetch(`https://friendbot.stellar.org?addr=${pair.publicKey()}`);
        const data = await response.json();
        console.log('data', data);

        console.log('publicKey: ' + pair.publicKey());
        console.log('secret: ' + pair.secret());

        console.log('Success! You have a funded Testnet account');

    } catch (e) {
        console.error("Oh no! Something went wrong:", e);
    }
}

createTestAccount();