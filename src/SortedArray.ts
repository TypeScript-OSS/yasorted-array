import type { ISortedArray } from './ISortedArray.js';

/** SortedArray is a generic class that maintains a sorted array of items. */
export class SortedArray<T> implements ISortedArray<T> {
  private readonly items_: T[] = [];
  private readonly comparator: (a: T, b: T) => number;

  /**
   * Creates a new SortedArray.
   *
   * @param comparator - Function to compare two items. Should return a negative number if a &lt; b, zero if a === b, or a positive number
   * if a &gt; b.  Comparisons are assumed to be consistent.
   */
  constructor(comparator: (a: T, b: T) => number) {
    this.comparator = comparator;

    return new Proxy(this, {
      get(target, prop, receiver) {
        if (typeof prop === 'string') {
          const index = Number(prop);
          if (!isNaN(index)) {
            return target.items_[index];
          }
        }

        return Reflect.get(target, prop, receiver);
      }
    });
  }

  /** Gets the number of items in the array. */
  public get length(): number {
    return this.items_.length;
  }

  /**
   * Adds a new value to the sorted array.
   *
   * Complexity: O(log(n)) for binary search + O(n) for insertion
   *
   * @param value - The value to add.
   * @returns The index at which the value was inserted.
   */
  public add(value: T): number {
    const index = this.findInsertionIndex(value);
    this.items_.splice(index, 0, value);
    return index;
  }

  /**
   * Adds multiple values to the sorted array.
   *
   * Complexity: O(M * log(n)) for finding insertion points + O(n) for rebuilding the array, where M is the number of items to add.
   *
   * @param values - The values to add.
   * @returns Array of indices, in ascending order, where the values were inserted.
   */
  public addMultiple(...values: T[]): number[] {
    if (values.length === 0) {
      return [];
    }

    values.sort(this.comparator);

    // Find insertion points for each value (some insertion indices, with respect to the original array, may be the same)
    const insertionPoints = values
      .map((value) => ({
        value,
        insertionIndex: this.findInsertionIndex(value)
      }))
      .reduce((out, { value, insertionIndex }) => {
        const existing = out.get(insertionIndex);
        if (existing !== undefined) {
          existing.push(value);
        } else {
          out.set(insertionIndex, [value]);
        }

        return out;
      }, new Map<number, T[]>());

    // Rebuilding the array with the new items
    const insertedIndices: number[] = [];
    const newItems: T[] = [];
    const originalLength = this.items_.length;
    for (let index = 0; index <= originalLength; index += 1) {
      const toBeInserted = insertionPoints.get(index);
      if (toBeInserted !== undefined) {
        for (const value of toBeInserted) {
          insertedIndices.push(newItems.length);
          newItems.push(value);
        }
      }

      if (index < originalLength) {
        newItems.push(this.items_[index]);
      }
    }
    this.items_.splice(0, originalLength, ...newItems);

    return insertedIndices;
  }

  /**
   * Finds the index of the first element that matches the provided value.
   *
   * Complexity: O(log(n))
   *
   * @param value - The value to find.
   * @returns The index of the first matching element, or `-1` if not found.
   */
  public firstIndexOf(value: T): number {
    // Binary search to find an element that matches
    let low = 0;
    let high = this.items_.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const comparison = this.comparator(this.items_[mid], value);

      if (comparison < 0) {
        low = mid + 1;
      } else if (comparison > 0) {
        high = mid - 1;
      } else {
        // Found a match, now find the first occurrence
        if (mid === 0 || this.comparator(this.items_[mid - 1], value) !== 0) {
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
  public lastIndexOf(value: T): number {
    // Binary search to find an element that matches
    let low = 0;
    let high = this.items_.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const comparison = this.comparator(this.items_[mid], value);

      if (comparison < 0) {
        low = mid + 1;
      } else if (comparison > 0) {
        high = mid - 1;
      } else {
        // Found a match, now find the last occurrence
        if (mid === this.items_.length - 1 || this.comparator(this.items_[mid + 1], value) !== 0) {
          return mid;
        }
        low = mid + 1;
      }
    }

    return -1;
  }

  /**
   * Removes the element at the specified index.
   *
   * Complexity: O(n) for removal
   *
   * @param index - The index of the element to remove.
   * @returns The index of the removed element, or `-1` if invalid (non-integer) or out of bounds.
   */
  public removeAtIndex(index: number): number {
    if (!Number.isInteger(index) || index < 0 || index >= this.items_.length) {
      return -1;
    }

    this.items_.splice(index, 1);
    return index;
  }

  /**
   * Removes the elements at the specified indices.
   *
   * Complexity: O(n) for rebuilding the array
   *
   * @param indices - The indices of the elements to remove.
   * @returns Array of former indices of the removed elements (in reverse order).
   */
  public removeAtIndices(...indices: number[]): number[] {
    const indicesSet = new Set(indices);

    const newItems: T[] = [];
    const removeIndices: number[] = [];
    for (let subindex = 0; subindex < this.items_.length; subindex += 1) {
      if (indicesSet.has(subindex)) {
        removeIndices.push(subindex);
      } else {
        newItems.push(this.items_[subindex]);
      }
    }

    this.items_.splice(0, this.items_.length, ...newItems);

    return removeIndices.reverse();
  }

  /**
   * Removes the first element that matches the provided value.
   *
   * Complexity: O(log(n)) for search + O(n) for removal
   *
   * @param value - The value to remove.
   * @returns The former index of the removed element, or `-1` if not found.
   */
  public removeFirst(value: T): number {
    return this.removeAtIndex(this.firstIndexOf(value));
  }

  /**
   * Removes the last element that matches the provided value.
   *
   * Complexity: O(log(n)) for search + O(n) for removal
   *
   * @param value - The value to remove.
   * @returns The former index of the removed element, or `-1` if not found.
   */
  public removeLast(value: T): number {
    return this.removeAtIndex(this.lastIndexOf(value));
  }

  /**
   * Removes all elements that match the provided value.
   *
   * Complexity: O(log(n)) for search + O(n) for removal
   *
   * @param value - The value to remove.
   * @returns Array of former indices of the removed elements (in reverse order).
   */
  public removeAll(value: T): number[] {
    const firstIndex = this.firstIndexOf(value);
    if (firstIndex === -1) {
      return [];
    }

    let count = 0;
    const removeIndices: number[] = [];
    // Mark all of the same values for removal
    for (let subindex = firstIndex; subindex < this.items_.length; subindex += 1) {
      if (subindex > firstIndex && this.comparator(value, this.items_[subindex]) !== 0) {
        break;
      }

      count += 1;
      removeIndices.push(subindex);
    }

    this.items_.splice(firstIndex, count);

    return removeIndices.reverse();
  }

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
  public removeMultiple(...values: T[]): number[] {
    if (values.length === 0) {
      return [];
    }

    const removeIndices: number[] = [];
    for (const value of values) {
      const index = this.firstIndexOf(value);
      if (index !== -1) {
        // Mark all of the same values for removal
        for (let subindex = index; subindex < this.items_.length; subindex += 1) {
          if (subindex > index && this.comparator(value, this.items_[subindex]) !== 0) {
            break;
          }

          removeIndices.push(subindex);
        }
      }
    }

    return this.removeAtIndices(...removeIndices);
  }

  /**
   * Clears the array, removing all elements.
   *
   * Complexity: O(1)
   */
  public clear(): void {
    this.items_.length = 0;
  }

  /**
   * Gets the item at the specified index.
   *
   * Complexity: O(1)
   *
   * @param index - The index to access.
   * @returns The item at the specified index.
   */
  public get(index: number): T {
    return this.items_[index];
  }

  /**
   * Creates a new `ISortedArray` by filtering the elements of this array using the specified predicate.
   *
   * Complexity: O(n) for filtering.  No sort comparison are performed since it's assumed all elements will be in the same relative order.
   *
   * @param predicate - The function used to test each element.
   * @returns A new `ISortedArray` containing the elements that match the predicate.
   */
  public filter(predicate: (value: T, index: number, obj: Readonly<T[]>) => boolean): ISortedArray<T> {
    const newArray = new SortedArray<T>(this.comparator);
    newArray.items_.push(...this.items_.filter(predicate));
    return newArray;
  }

  /**
   * Finds the first index of an element that matches using the specified predicate.
   *
   * Complexity: O(n) for search
   *
   * @param predicate - The function to test each element.
   * @returns The index of the first matching element, which will be `-1` if not found.
   */
  public findIndex(predicate: (value: T, index: number, obj: Readonly<T[]>) => boolean): number {
    return this.items_.findIndex(predicate);
  }

  /**
   * Finds the last index of an element that matches using the specified predicate.
   *
   * Complexity: O(n) for search
   *
   * @param predicate - The function to test each element.
   * @returns The index of the last matching element, which will be `-1` if not found.
   */
  public findLastIndex(predicate: (value: T, index: number, obj: Readonly<T[]>) => boolean): number {
    for (let index = this.items_.length - 1; index >= 0; index -= 1) {
      if (predicate(this.items_[index], index, this.items_)) {
        return index;
      }
    }

    return -1;
  }

  /**
   * Finds all indices of elements that match using the specified predicate.
   *
   * Complexity: O(n) for search
   *
   * @param predicate - The function to test each element.
   * @returns The indices of the matching elements, in ascending order, which will be empty if no matches are found.
   */
  public findIndices(predicate: (value: T, index: number, obj: Readonly<T[]>) => boolean): number[] {
    const indices: number[] = [];

    for (let index = 0; index < this.items_.length; index += 1) {
      if (predicate(this.items_[index], index, this.items_)) {
        indices.push(index);
      }
    }

    return indices;
  }

  // Iterable Methods

  /**
   * Returns an iterator for the array.
   */
  [Symbol.iterator](): Iterator<T> {
    return this.items_[Symbol.iterator]();
  }

  /**
   * Allows array-like indexing.
   */
  [index: number]: T;

  // Private Methods

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
    let high = this.items_.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const comparison = this.comparator(this.items_[mid], value);

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
