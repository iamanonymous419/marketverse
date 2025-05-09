declare module 'anoverse' {
  export interface anoverse {
    generateRandomNumber: (length: number) => number;
    isValidLength: (length: number) => boolean;
    getRange: (length: number) => { min: number; max: number } | null;
    generateRandomAlpha: (length: number) => string;
    generateRandomAlphaNumeric: (length: number) => string;
    generateRandomSymbol: (length: number) => string;
    generateOTP: (length?: number) => string;
    generateUUID: () => string;
    getRandomBoolean: () => boolean;
    getRandomItem: <T>(array: T[]) => T | null;
    shuffleArray: <T>(array: T[]) => T[] | null;
    getRandomDate: (start?: Date, end?: Date) => Date;
  }

  const anoverse: () => anoverse;
  export default anoverse;
}
