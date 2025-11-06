export default (score, numDigits) => {
    const scoreAsText = score.toString();
    let zerosToAdd = 0;
    if(scoreAsText.length < numDigits) {
        zerosToAdd = numDigits - scoreAsText.length;
    }
    let zeroes = '';
    for(let i = 0; i < zerosToAdd; i++) {
        zeroes += 0;
    }

    return zeroes + String(score);
}