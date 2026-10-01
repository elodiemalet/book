// Chiffres romains, pour numéroter les parties (I, II, III…)
export function toRoman(value: number): string {
    const numerals: [number, string][] = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'],
        [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
    let rest = value;
    let result = '';
    for (const [amount, numeral] of numerals) {
        while (rest >= amount) {
            result += numeral;
            rest -= amount;
        }
    }
    return result;
}
