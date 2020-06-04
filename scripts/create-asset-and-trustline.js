const StellarSdk = require("stellar-sdk");
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

const { account1, account2, account3 } = require('../accounts.json');

// Stellar Testnet passphrase
const passphrase = 'Test SDF Network ; September 2015';


async function createAssetAndTrustline() {

    try {

        console.log('Create assets');

        // Get keys
        const issuingKeys = StellarSdk.Keypair.fromSecret(account1.secret);
        const receivingKeys1 = StellarSdk.Keypair.fromSecret(account2.secret);
        const receivingKeys2 = StellarSdk.Keypair.fromSecret(account3.secret);

        // Create Assets
        const USD = new StellarSdk.Asset('USD', issuingKeys.publicKey());
        const GBP = new StellarSdk.Asset('GBP', issuingKeys.publicKey());
        const EUR = new StellarSdk.Asset('EUR', issuingKeys.publicKey());

        // Get fee
        const fee = await server.fetchBaseFee();

        // Load receiving account
        const receivingAccount1 = await server.loadAccount(receivingKeys1.publicKey());

        // Create transaction
        const transaction = new StellarSdk.TransactionBuilder(receivingAccount1, { fee, networkPassphrase: passphrase })
            .addOperation(StellarSdk.Operation.changeTrust({
                asset: USD,
                limit: '1000000',
                source: receivingKeys1.publicKey()
            }))
            .addOperation(StellarSdk.Operation.changeTrust({
                asset: GBP,
                limit: '1000000',
                source: receivingKeys1.publicKey()
            }))
            .addOperation(StellarSdk.Operation.changeTrust({
                asset: EUR,
                limit: '1000000',
                source: receivingKeys1.publicKey()
            }))
            .setTimeout(100)
            .build();

        // Sign transaction
        transaction.sign(receivingKeys1);

        // Submit transaction
        const response = await server.submitTransaction(transaction);
        console.log(response);
 
    }
    catch(err) {
        console.error(err);
    }


}

createAssetAndTrustline();
