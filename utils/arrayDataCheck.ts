export function isArrayDataUnique(arrayData: any[]): boolean {
    const set = new Set(arrayData)
    return set.size === arrayData.length;
}