const StellarSdk = require("stellar-sdk");

const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

const { account1, account2 } = require('../accounts.json');

console.log(`Listen payments received in ${account2.publicKey}`)

// Create an API call to query payments involving the account
const payments = server.payments().forAccount(account2.publicKey);


// If some payments have already been handled, start the results from the
// last seen payment (see below in `handlePayment` where it gets saved)
const lastToken = loadLastPagingToken();
if (lastToken) {
    payments.cursor(lastToken);
}


// `stream` will send each recorded payment, one by one, then keep the
// connection open and continue to send you new payments as they occur.
payments.stream({

    onmessage: function(payment) {

        // Record the paging token so we can start from here the next time
        savePagingToken(payment.paging_token);

        // The payments stream includes both sent and received payments. We only
        // want to process received payments here
        if (payment.to !== account2.publicKey) {
            return;
        }

        // In Stellar’s API, Lumens are referred to as the “native” type. Other
        // asset types have more detailed information.
        const asset = (payment.asset_type === 'native')
                        ? 'lumnes'
                        : payment.asset_code + ':' + payment.asset_issuer;

        console.log(payment.amount + ' ' + asset + ' from ' + payment.from);

    },

    onerror: function(error) {
        console.error('Error in payment stream');
        console.error(error);
    }

})



// In most cases, you should save this to a local database or file so that
// you can load it next time you stream new payments
function savePagingToken(token) {

    console.log(`token: ${token}`);

}

// Get the last paging token from a local database or file
function loadLastPagingToken() {

}


// Request payments in groups, or pages. Once you’ve processed each page 
// of payments, you’ll need to request the next one until there are none left
/*
payments.call().then(function handlePage(paymentsPage) {

    paymentsPage.records.forEach((payment) => {
        // handle payment
    })

    return paymentsPage.next().then(handlePage);
})
*/