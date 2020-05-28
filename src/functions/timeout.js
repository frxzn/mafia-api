const handleRoundEnd = require('./handleRoundEnd')

const startTimeout = (partyId, prevRound, roundDurationMS) => {
    setTimeout(() => {
        handleRoundEnd.handleRoundEnd(partyId, prevRound)
    }, roundDurationMS)
}

module.exports.startTimeout = startTimeout