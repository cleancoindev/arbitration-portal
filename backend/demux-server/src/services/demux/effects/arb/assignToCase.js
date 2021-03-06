function assignToCaseEffect(payload, blockInfo, context) {
    try {
        console.log('AssignToCase effect PAYLOAD:   ', payload);
        console.log('AssignToCase effect BlockInfo: ', blockInfo);   

        const post = {
            trxHash:    payload.transactionId,
            arbitrator: payload.data.arb_to_assign
        };
        context.socket.emit('assignToCaseAction', post);
    } catch (err) {
        console.error('AssignToCase effect error: ', err);
    }
}

export default assignToCaseEffect;