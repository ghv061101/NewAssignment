function secondLargestUnique(arr) {
    const hash = {};
    const unique = [];

    
    for (let value of arr) {
        if (!hash[value]) {
            hash[value] = true;
            unique.push(value);
        }
    }

    
    if (unique.length < 2) {
        return -1;
    }
    unique.sort();

    
    return unique[unique.length - 2];
}

console.log(secondLargestUnique([3, 5, 2, 5, 6, 6, 1]));
console.log(secondLargestUnique([7,7,7]));
console.log(secondLargestUnique([1,2,3]));