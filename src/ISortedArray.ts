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
