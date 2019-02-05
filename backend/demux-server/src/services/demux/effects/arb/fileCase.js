function fileCaseEffect(payload, blockInfo, context) {
    try {
        console.log('FileCase effect PAYLOAD:   ', payload);
        console.log('FileCase effect BlockInfo: ', blockInfo);
        
        const post = {
            trxHash:    payload.transactionId,
            claimant:   payload.data.claimant,
            claim_link: payload.data.claim_link
        };
        context.socket.emit('fileCaseAction', post);
    } catch (err) {
        console.error('FileCase effect error: ', err);
    }
}

export default fileCaseEffect;