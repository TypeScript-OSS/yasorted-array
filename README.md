# yasorted-array

[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]

An efficient sorted array.

Provided as:

- CommonJS
- ES Module

## Usage Examples

```typescript
// Basics
const numbers = new SortedArray<number>((a,b) => b - a);
console.log(numbers.add(3)); // 0
console.log(numbers.add(1)); // 1
console.log(numbers.add(2)); // 1
console.log(numbers.firstIndexOf(1)); // 2
console.log(numbers.firstIndexOf(2)); // 1
console.log(numbers.firstIndexOf(3)); // 0
console.log(numbers.firstIndexOf(4)); // -1

for (const element of numbers) {
  console.log(element)
} // 3, 2, 1

numbers.removeFirst(2); // 1
numbers.clear();

// Add Multiple
console.log(numbers.addMultiple(3, 1, 2)); // [0, 1, 2]
console.log(numbers.firstIndexOf(1)); // 2
console.log(numbers.firstIndexOf(2)); // 1
console.log(numbers.firstIndexOf(3)); // 0
console.log(Array.from(numbers)); // [3, 2, 1]

console.log(numbers.addMultiple(0, 0.5, 1.5, 2.5, 3.5)); // [0, 2, 4, 6, 7]
console.log(Array.from(numbers)); // [3.5, 3, 2.5, 2, 1.5, 1, 0.5, 0]

// Remove Multiple
console.log(numbers.removeMultiple(0, 2)); // [7, 3]
console.log(Array.from(numbers)); // [3.5, 3, 2.5, 1.5, 1, 0.5]
```

[API Docs](https://typescript-oss.github.io/yasorted-array/)

## Thanks

Thanks for checking it out.  Feel free to create issues or otherwise provide feedback.

Be sure to check out our other [TypeScript OSS](https://github.com/TypeScript-OSS) projects as well.

<!-- Definitions -->

[downloads-badge]: https://img.shields.io/npm/dm/yasorted-array.svg

[downloads]: https://www.npmjs.com/package/yasorted-array

[size-badge]: https://img.shields.io/bundlephobia/minzip/yasorted-array.svg

[size]: https://bundlephobia.com/result?p=yasorted-array
