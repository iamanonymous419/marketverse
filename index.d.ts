import anoverse from 'anoverse';

const utils = anoverse();

console.log(utils.generateOTP(6)); // ✅ typed and working
console.log(utils.generateRandomAlpha(10)); // ✅ typed and working
console.log(utils.generateRandomAlphaNumeric(10)); // ✅ typed and working
console.log(utils.generateRandomNumber(1, 100)); // ✅ typed and working
console.log(utils.getRandomBoolean()); // ✅ typed and working
console.log(utils.getRandomItem([1, 2, 3, 4, 5])); // ✅ typed and working
console.log(utils.shuffleArray([1, 2, 3, 4, 5])); // ✅ typed and working

// more details types are in /src/types/randverse.d.ts
