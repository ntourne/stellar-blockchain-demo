const StellarSdk = require("stellar-sdk");
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

const { account1 } = require('../accounts.json');
const sourceKeys = StellarSdk.Keypair.fromSecret(account1.secret);

/**
 * Create a Stellar account using another account as master
 */
async function createAccountUsingMaster() {

    try {

        console.log(`Load account used as master (${account1.publicKey})`)

        // Load master account
        const masterAccount = await server.loadAccount(account1.publicKey);
        
        const fee = await server.fetchBaseFee();
        
        // Create key pair for the new account
        const newPair = StellarSdk.Keypair.random();
        console.log('Generate new key pairs');
        console.log(`publicKey: ${newPair.publicKey()}`);
        console.log(`secret: ${newPair.secret()}`);
        
        // Create transaction
        const transaction = new StellarSdk.TransactionBuilder(masterAccount, { fee, networkPassphrase: StellarSdk.Networks.TESTNET })
            .addOperation(StellarSdk.Operation.createAccount({
                source: masterAccount.account_id,
                destination: newPair.publicKey(),
                startingBalance: "500" 
            }))
            .setTimeout(30)
            .build();

        // Sign the transaction
        transaction.sign(sourceKeys);

        // Submit transaction to the network
        const response = await server.submitTransaction(transaction);

        console.log(response);

    }
    catch(err) {
        console.error(err);
    }

}

createAccountUsingMaster();