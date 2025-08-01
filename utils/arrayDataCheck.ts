export function binarySearch(array: string[], target: string): number {
    let low =0;
    let high = array.length-1;

    while (low <= high) {
        let mid = Math.floor((low + high)/2);
        if (array[mid] === target) return mid

        if (array[mid]> target) {
            high = mid -1
        } else { // array[mid]> target
            low = mid +1
        }
    }
    return -1   
}

export function isArrayDataUnique(arrayData: any[]): boolean {
    const set = new Set(arrayData)
    return set.size === arrayData.length;
}