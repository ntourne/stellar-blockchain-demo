const StellarSdk = require("stellar-sdk");
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

const { account1 } = require('../accounts.json');


async function changeAccountAuthorization() {

    try {

        console.log('Change account authorization');

        // Get keys
        const issuingKeys = StellarSdk.Keypair.fromSecret(account1.secret);

        // Get fee
        const fee = await server.fetchBaseFee();

        // Load issuing account
        const issuingAccount = await server.loadAccount(issuingKeys.publicKey());
    
        // Create transaction
        const transaction = new StellarSdk.TransactionBuilder(issuingAccount, { fee, networkPassphrase: StellarSdk.Networks.TESTNET })
            .addOperation(StellarSdk.Operation.setOptions({
                setFlags: StellarSdk.AuthRevocableFlag | StellarSdk.AuthRequiredFlag
            }))
            .setTimeout(100)
            .build();

        // Sign the transaction
        transaction.sign(issuingKeys);

        // Submit the transaction
        const response = await server.submitTransaction(transaction);
        console.log(response);
        
    }
    catch(err) {
        console.error(err);
    }
}

changeAccountAuthorization();