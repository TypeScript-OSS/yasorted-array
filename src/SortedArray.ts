/** SortedArray is a generic class that maintains a sorted array of items. */
export class SortedArray<T> implements Iterable<T> {
  private readonly items: T[] = [];
  private readonly comparator: (a: T, b: T) => number;

  /**
   * Creates a new SortedArray.
   *
   * @param comparator - Function to compare two items. Should return a negative number if a &lt; b, zero if a === b, or a positive number
   * if a &gt; b.
   */
  constructor(comparator: (a: T, b: T) => number) {
    this.comparator = comparator;

    return new Proxy(this, {
      get(target, prop, receiver) {
        if (typeof prop === 'string') {
          const index = Number(prop);
          if (!isNaN(index)) {
            return target.items[index];
          }
        }

        return Reflect.get(target, prop, receiver);
      }
    });
  }

  /** Gets the number of items in the array. */
  get length(): number {
    return this.items.length;
  }

  /**
   * Adds a new value to the sorted array.
   *
   * Complexity: O(log(n)) for binary search + O(n) for insertion
   *
   * @param value - The value to add.
   * @returns The index at which the value was inserted.
   */
  add(value: T): number {
    const index = this.findInsertionIndex(value);
    this.items.splice(index, 0, value);
    return index;
  }

  /**
   * Finds the index of the first element that matches the provided value.
   *
   * Complexity: O(log(n))
   *
   * @param value - The value to find.
   * @returns The index of the first matching element, or `-1` if not found.
   */
  firstIndexOf(value: T): number {
    // Binary search to find an element that matches
    let low = 0;
    let high = this.items.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const comparison = this.comparator(this.items[mid], value);

      if (comparison < 0) {
        low = mid + 1;
      } else if (comparison > 0) {
        high = mid - 1;
      } else {
        // Found a match, now find the first occurrence
        if (mid === 0 || this.comparator(this.items[mid - 1], value) !== 0) {
          return mid;
        }
        high = mid - 1;
      }
    }

    return -1;
  }

  /**
   * Finds the index of the last element that matches the provided value.
   *
   * Complexity: O(log(n))
   *
   * @param value - The value to find.
   * @returns The index of the last matching element, or `-1` if not found.
   */
  lastIndexOf(value: T): number {
    // Binary search to find an element that matches
    let low = 0;
    let high = this.items.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const comparison = this.comparator(this.items[mid], value);

      if (comparison < 0) {
        low = mid + 1;
      } else if (comparison > 0) {
        high = mid - 1;
      } else {
        // Found a match, now find the last occurrence
        if (mid === this.items.length - 1 || this.comparator(this.items[mid + 1], value) !== 0) {
          return mid;
        }
        low = mid + 1;
      }
    }

    return -1;
  }

  /**
   * Removes the first element that matches the provided value.
   *
   * Complexity: O(log(n)) for search + O(n) for removal
   *
   * @param value - The value to remove.
   * @returns The former index of the removed element, or `-1` if not found.
   */
  removeFirst(value: T): number {
    const index = this.firstIndexOf(value);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
    return index;
  }

  /**
   * Removes the last element that matches the provided value.
   *
   * Complexity: O(log(n)) for search + O(n) for removal
   *
   * @param value - The value to remove.
   * @returns The former index of the removed element, or `-1` if not found.
   */
  removeLast(value: T): number {
    const index = this.lastIndexOf(value);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
    return index;
  }

  /**
   * Removes all elements that match the provided value.
   *
   * Complexity: O(log(n)) for search + O(n) for removal
   *
   * @param value - The value to remove.
   * @returns Array of former indices of the removed elements (in reverse order).
   */
  removeAll(value: T): number[] {
    const firstIndex = this.firstIndexOf(value);
    if (firstIndex === -1) {
      return [];
    }

    const lastIndex = this.lastIndexOf(value);
    const count = lastIndex - firstIndex + 1;
    const removedIndices: number[] = [];

    // Add indices in reverse order
    for (let i = lastIndex; i >= firstIndex; i -= 1) {
      removedIndices.push(i);
    }

    this.items.splice(firstIndex, count);
    return removedIndices;
  }

  /**
   * Clears the array, removing all elements.
   *
   * Complexity: O(1)
   */
  clear(): void {
    this.items.length = 0;
  }

  /**
   * Gets the item at the specified index.
   *
   * Complexity: O(1)
   *
   * @param index - The index to access.
   * @returns The item at the specified index.
   */
  get(index: number): T {
    return this.items[index];
  }

  /**
   * Returns an iterator for the array.
   */
  [Symbol.iterator](): Iterator<T> {
    return this.items[Symbol.iterator]();
  }

  /**
   * Allows array-like indexing.
   */
  [index: number]: T;

  /**
   * Helper method to find the index where a new value should be inserted.
   *
   * Complexity: O(log(n))
   *
   * @param value - The value to find an insertion point for.
   * @returns The index where the value should be inserted.
   */
  private findInsertionIndex(value: T): number {
    let low = 0;
    let high = this.items.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const comparison = this.comparator(this.items[mid], value);

      if (comparison < 0) {
        low = mid + 1;
      } else if (comparison > 0) {
        high = mid - 1;
      } else {
        return mid;
      }
    }

    return low;
  }
}
