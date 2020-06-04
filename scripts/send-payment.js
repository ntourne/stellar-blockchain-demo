const StellarSdk = require("stellar-sdk");
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

const { account1, account2 } = require('../accounts.json');

// Get source and destination
const sourceKeys = StellarSdk.Keypair.fromSecret(account1.secret);
const destPublicKey = account2.publicKey;


/**
 * Send a payment from account1 to account2
 */
async function sendPayment() {

    try {

        console.log(`Send payment from ${account1.publicKey} to ${account2.publicKey}`);

        // Check if destination account exists
        await server.loadAccount(destPublicKey);

        // Load source account
        const sourceAccount = await server.loadAccount(sourceKeys.publicKey());

        // Create transaction
        let transaction = new StellarSdk.TransactionBuilder(
                sourceAccount,
                {
                    fee: StellarSdk.BASE_FEE,
                    networkPassphrase: StellarSdk.Networks.TESTNET
                }
            )
            .addOperation(StellarSdk.Operation.payment({
                destination: destPublicKey,
                asset: StellarSdk.Asset.native(),
                amount: "10"
            }))
            .addMemo(StellarSdk.Memo.text("Some payment"))
            .setTimeout(180)
            .build();
        
        // Sign the transaction
        transaction.sign(sourceKeys);

        // Submit transaction to the network
        const response = await server.submitTransaction(transaction);

        console.log(response);

    }
    catch(e) {
        console.error(e);
    }

}

sendPayment();