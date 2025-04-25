import { SortedArray } from '../SortedArray.js';

describe('SortedArray', () => {
  it('README example should work', () => {
    const numbers = new SortedArray<number>((a, b) => b - a);
    expect(numbers.add(3)).toBe(0);
    expect(numbers.add(1)).toBe(1);
    expect(numbers.add(2)).toBe(1);
    expect(numbers.firstIndexOf(1)).toBe(2);
    expect(numbers.firstIndexOf(2)).toBe(1);
    expect(numbers.firstIndexOf(3)).toBe(0);
    expect(numbers.firstIndexOf(4)).toBe(-1);

    expect(Array.from(numbers)).toMatchObject([3, 2, 1]);

    expect(numbers.removeFirst(2)).toBe(1);
    numbers.clear();
    expect(numbers.length).toBe(0);
  });

  it('adds items in sorted order', () => {
    const arr = new SortedArray<number>((a, b) => a - b);
    arr.add(5);
    arr.add(3);
    arr.add(8);
    arr.add(1);

    expect(Array.from(arr)).toEqual([1, 3, 5, 8]);
    expect(arr.length).toBe(4);
  });

  it('handles duplicate values correctly', () => {
    const arr = new SortedArray<number>((a, b) => a - b);
    arr.add(3);
    arr.add(3);
    arr.add(3);
    arr.add(1);
    arr.add(5);

    expect(Array.from(arr)).toEqual([1, 3, 3, 3, 5]);
    expect(arr.length).toBe(5);
    expect(arr.firstIndexOf(3)).toBe(1);
    expect(arr.lastIndexOf(3)).toBe(3);
  });

  it('removes first and last occurrences correctly', () => {
    const arr = new SortedArray<number>((a, b) => a - b);
    arr.add(1);
    arr.add(3);
    arr.add(3);
    arr.add(3);
    arr.add(5);

    expect(arr.removeFirst(3)).toBe(1);
    expect(Array.from(arr)).toEqual([1, 3, 3, 5]);

    expect(arr.removeLast(3)).toBe(2);
    expect(Array.from(arr)).toEqual([1, 3, 5]);

    expect(arr.removeFirst(10)).toBe(-1);
    expect(arr.removeLast(10)).toBe(-1);
  });

  it('removes all occurrences correctly', () => {
    const arr = new SortedArray<number>((a, b) => a - b);
    arr.add(1);
    arr.add(3);
    arr.add(3);
    arr.add(3);
    arr.add(5);

    expect(arr.removeAll(3)).toEqual([3, 2, 1]);
    expect(Array.from(arr)).toEqual([1, 5]);

    expect(arr.removeAll(10)).toEqual([]);
  });

  it('supports direct access with get method', () => {
    const arr = new SortedArray<number>((a, b) => a - b);
    arr.add(1);
    arr.add(3);
    arr.add(5);

    expect(arr.get(0)).toBe(1);
    expect(arr.get(1)).toBe(3);
    expect(arr.get(2)).toBe(5);
  });

  it('supports iteration with for...of', () => {
    const arr = new SortedArray<number>((a, b) => a - b);
    arr.add(1);
    arr.add(3);
    arr.add(5);

    const result = [];
    for (const item of arr) {
      result.push(item);
    }

    expect(result).toEqual([1, 3, 5]);
  });

  it('works with custom objects', () => {
    interface Person {
      name: string;
      age: number;
    }

    const people = new SortedArray<Person>((a, b) => a.age - b.age);
    const alice = { name: 'Alice', age: 25 };
    const bob = { name: 'Bob', age: 30 };
    const charlie = { name: 'Charlie', age: 20 };

    people.add(alice);
    people.add(bob);
    people.add(charlie);

    expect(Array.from(people)).toEqual([charlie, alice, bob]);
    expect(people.firstIndexOf(alice)).toBe(1);

    people.removeFirst(alice);
    expect(Array.from(people)).toEqual([charlie, bob]);
  });

  it('handles empty array edge cases', () => {
    const arr = new SortedArray<number>((a, b) => a - b);

    expect(arr.length).toBe(0);
    expect(arr.firstIndexOf(5)).toBe(-1);
    expect(arr.lastIndexOf(5)).toBe(-1);
    expect(arr.removeFirst(5)).toBe(-1);
    expect(arr.removeLast(5)).toBe(-1);
    expect(arr.removeAll(5)).toEqual([]);

    arr.clear(); // Should not throw on empty array
    expect(arr.length).toBe(0);
  });

  it('should be able to access like array', () => {
    const arr = new SortedArray<number>((a, b) => b - a);
    arr.add(1);
    arr.add(3);
    arr.add(5);

    expect(arr.length).toBe(3);
    expect(arr[0]).toBe(5);
    expect(arr[1]).toBe(3);
    expect(arr[2]).toBe(1);
  });
});
