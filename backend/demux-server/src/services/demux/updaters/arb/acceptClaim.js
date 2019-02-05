async function acceptClaimHandler (state, payload, blockInfo, context) {
    try {
        console.log('AcceptClaim updater PAYLOAD:   ', payload);
        console.log('AcceptClaim updater BlockInfo: ', blockInfo);

        let case_id = payload.data.case_id;

        let caseState = await state.case.findOne({ case_id: case_id }).exec();
        if (caseState) {
            // Claim_Id
            let claim_counter = 0;
            let counters = await state.counter.findOne({}).exec();
            if (counters) {
                ({ claim_counter } = counters)
                claim_counter += 1;
                await state.counter.updateOne({}, {
                    $inc: { claim_counter: 1 }
                }, { upsert: true }).exec();
            }

            let accepted_claim;
            let unread_claims;
            let accepted_claims;
            ({ unread_claims }   = caseState)
            ({ accepted_claims } = caseState)
            for ( let claim of unread_claims ) {
                if (claim.claim_summary === payload.data.claim_hash) {
                    accepted_claim = claim;
                    claim = null;
                }
            }
            accepted_claims.push(accepted_claim);

            await state.case.findOneAndUpdate({ case_id: case_id }, {
                unread_claims:   unread_claims,
                accepted_claims: accepted_claims
            }).exec();

            await state.claim.create({
                claim_id:       claim_counter,
                claim_summary:  payload.data.claim_hash,
                decision_link:  payload.data.decision_link,
                decision_class: payload.data.decision_class
            }).exec();
        }

    } catch (err) {
        console.error('AcceptClaim updater error: ', err);
    }
}

export default acceptClaimHandler;