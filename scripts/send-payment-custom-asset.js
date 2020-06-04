const StellarSdk = require("stellar-sdk");
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

const { account1, account2 } = require('../accounts.json');


/**
 * Send custom assets from account1 (issuer) to account2
 */
async function sendPaymentCustomAsset() {

    try {

        console.log('Payment using custom assets');

        // Get keys
        const issuingKeys = StellarSdk.Keypair.fromSecret(account1.secret);

        // Load asset
        const USD = new StellarSdk.Asset('USD', issuingKeys.publicKey());

        // Get fee
        const fee = await server.fetchBaseFee();

        // Load issuer account
        const issuerAccount = await server.loadAccount(issuingKeys.publicKey());

        const transaction = new StellarSdk.TransactionBuilder(issuerAccount, { fee, networkPassphrase: StellarSdk.Networks.TESTNET })
            .addOperation(StellarSdk.Operation.payment({
                asset: USD,
                amount: "1200",
                destination: account2.publicKey
            }))
            .setTimeout(100)
            .build();

        // Sign transaction
        transaction.sign(issuingKeys);

        // Submit transaction
        const response = await server.submitTransaction(transaction);
        console.log(response);

    }
    catch(e) {
        console.error(e);
    }

}

sendPaymentCustomAsset();