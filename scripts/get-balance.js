const StellarSdk = require("stellar-sdk");
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

const { account1 } = require('../accounts.json');


/**
 * Get the balance from an account
 */
async function getBalance() {
    try {
        
        console.log(`Get balance of ${account1.publicKey}`);

        const account = await server.loadAccount(account1.publicKey);
        
        // Print all different balances (native and others - if any)
        account.balances.forEach( (balance) => {
            console.log(balance);
        })
    
    }
    catch(e) {
        console.log(`Account doesn't exist`, e);
    }
}

getBalance();

