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

## Interface

The `SortedArray` class implements the `ISortedArray` interface, which is as follows.

```typescript
export interface ISortedArray<T> extends Iterable<T> {
  /** Gets the number of items in the array. */
  readonly length: number;

  /**
   * Adds a new value to the sorted array.
   *
   * Complexity: O(log(n)) for binary search + O(n) for insertion
   *
   * @param value - The value to add.
   * @returns The index at which the value was inserted.
   */
  add(value: T): number;

  /**
   * Adds multiple values to the sorted array.
   *
   * Complexity: O(M * log(n)) for finding insertion points + O(n) for rebuilding the array, where M is the number of items to add.
   *
   * @param values - The values to add.
   * @returns Array of indices, in ascending order, where the values were inserted.
   */
  addMultiple(...values: T[]): number[];

  /**
   * Finds the index of the first element that matches the provided value.
   *
   * Complexity: O(log(n))
   *
   * @param value - The value to find.
   * @returns The index of the first matching element, or `-1` if not found.
   */
  firstIndexOf(value: T): number;

  /**
   * Finds the index of the last element that matches the provided value.
   *
   * Complexity: O(log(n))
   *
   * @param value - The value to find.
   * @returns The index of the last matching element, or `-1` if not found.
   */
  lastIndexOf(value: T): number;

  /**
   * Removes the element at the specified index.
   *
   * Complexity: O(n) for removal
   *
   * @param value - The value to remove.
   * @returns The index of the removed element, or `-1` if invalid (non-integer) or out of bounds.
   */
  removeAtIndex(index: number): number;

  /**
   * Removes the elements at the specified indices.
   *
   * Complexity: O(n) for rebuilding the array
   *
   * @param indices - The indices of the elements to remove.
   * @returns Array of former indices of the removed elements (in reverse order).
   */
  removeAtIndices(...indices: number[]): number[];
  
  /**
   * Removes the first element that matches the provided value.
   *
   * Complexity: O(log(n)) for search + O(n) for removal
   *
   * @param value - The value to remove.
   * @returns The former index of the removed element, or `-1` if not found.
   */
  removeFirst(value: T): number;

  /**
   * Removes the last element that matches the provided value.
   *
   * Complexity: O(log(n)) for search + O(n) for removal
   *
   * @param value - The value to remove.
   * @returns The former index of the removed element, or `-1` if not found.
   */
  removeLast(value: T): number;

  /**
   * Removes all elements that match the provided value.
   *
   * Complexity: O(log(n)) for search + O(n) for removal
   *
   * @param value - The value to remove.
   * @returns Array of former indices of the removed elements (in reverse order).
   */
  removeAll(value: T): number[];

  /**
   * Removes multiple values from the sorted array.
   *
   * If specified values are duplicated in the array, all occurrences are removed.
   *
   * Complexity: O(M * log(n)) for finding values + O(n) for rebuilding the array, where M is the number of items to remove.
   *
   * @param values - The values to remove.
   * @returns Array of indices, in descending order, of the items that were removed.
   */
  removeMultiple(...values: T[]): number[];

  /**
   * Clears the array, removing all elements.
   *
   * Complexity: O(1)
   */
  clear(): void;

  /**
   * Gets the item at the specified index.
   *
   * Complexity: O(1)
   *
   * @param index - The index to access.
   * @returns The item at the specified index.
   */
  get(index: number): T;
}
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
