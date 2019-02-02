//NOTE: Balance tracking on eosio.arb is not implemented.

async function transferHandler (state, payload, blockInfo, context) {
    try {
        // Set eosio.token transfer action schema
        let from     = payload.data.from;
        let to       = payload.data.to;
        let quantity = payload.data.quantity;
        let value    = quantity.split(' ')[0];
        let symbol   = quantity.split(' ')[1];

        if (to === 'eosio.arb' && symbol === 'TLOS') {
            console.log('Creating a new transfer action record in db');
            await state.transfer.create({ 
                trxHash:  payload.transactionId,
                from:     payload.data.from,
                to:       payload.data.to,
                quantity: payload.data.quantity,
                memo:     payload.data.memo
            });

            console.log(`Upserting Balance of ${from} account_name`);
            const account = await state.balance.findOne({ owner: from }).exec();
            let escrow = 0;
            if (account) {
                ({ escrow } = account)
            }
            let newBalance = escrow - value;
            await state.balance.updateOne({ owner: from }, {
                id:       blockInfo.blockNumber,
                owner:    from,
                escrow:   newBalance
            }, { upsert: true }).exec();
        }

        if (from === 'eosio.arb' && symbol === 'TLOS') {
            console.log('Creating a new transfer action record in db');
            await state.transfer.create({ 
                trxHash:  payload.transactionId,
                from:     payload.data.from,
                to:       payload.data.to,
                quantity: payload.data.quantity,
                memo:     payload.data.memo
            });

            console.log(`Upserting Balance of ${to} account_name`);
            const account = await state.balance.findOne({ owner: to }).exec();
            let escrow = 0;
            if (account) {
                ({ escrow } = account)
            }
            let newBalance = escrow + value;
            await state.balance.updateOne({ owner: to }, {
                id:       blockInfo.blockNumber,
                owner:    to,
                escrow:   newBalance
            }, { upsert: true }).exec();
        }
    } catch (err) {
        console.error('Transfer updater error: ', err);
    }
}

export default transferHandler;