import { SortedArray } from '../SortedArray.js';

describe('SortedArray', () => {
  it('README example should work', () => {
    // Basics
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

    // Add Multiple
    expect(numbers.addMultiple(3, 1, 2)).toMatchObject([0, 1, 2]);
    expect(numbers.firstIndexOf(1)).toBe(2);
    expect(numbers.firstIndexOf(2)).toBe(1);
    expect(numbers.firstIndexOf(3)).toBe(0);
    expect(Array.from(numbers)).toMatchObject([3, 2, 1]);

    expect(numbers.addMultiple(0, 0.5, 1.5, 2.5, 3.5)).toMatchObject([0, 2, 4, 6, 7]);
    expect(Array.from(numbers)).toMatchObject([3.5, 3, 2.5, 2, 1.5, 1, 0.5, 0]);

    // Remove Multiple
    expect(numbers.removeMultiple(0, 2)).toMatchObject([7, 3]);
    expect(Array.from(numbers)).toMatchObject([3.5, 3, 2.5, 1.5, 1, 0.5]);
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

  it('remove at specified index correctly', () => {
    const arr = new SortedArray<number>((a, b) => a - b);
    arr.add(1);
    arr.add(3);
    arr.add(3);
    arr.add(3);
    arr.add(5);

    expect(arr.removeAtIndex(1)).toBe(1);
    expect(Array.from(arr)).toEqual([1, 3, 3, 5]);

    expect(arr.removeAtIndex(2)).toBe(2);
    expect(Array.from(arr)).toEqual([1, 3, 5]);

    expect(arr.removeAtIndex(-1)).toBe(-1);
    expect(arr.removeAtIndex(3.14)).toBe(-1);
    expect(arr.removeAtIndex(10)).toBe(-1);
    expect(arr.removeAtIndex(NaN)).toBe(-1);
  });

  it('remove multiple items at specified indices correctly', () => {
    const arr = new SortedArray<number>((a, b) => a - b);
    arr.add(1);
    arr.add(3);
    arr.add(3);
    arr.add(3);
    arr.add(5);

    expect(arr.removeAtIndices(1, 2)).toMatchObject([2, 1]);
    expect(Array.from(arr)).toEqual([1, 3, 5]);

    expect(arr.removeAtIndices(-1, 3.14, 10, NaN)).toMatchObject([]);
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

  describe('addMultiple', () => {
    it('adds multiple items in correct order', () => {
      const arr = new SortedArray<number>((a, b) => a - b);
      const indices = arr.addMultiple(5, 3, 8, 1);

      expect(indices).toEqual([0, 1, 2, 3]);
      expect(Array.from(arr)).toEqual([1, 3, 5, 8]);
      expect(arr.length).toBe(4);
    });

    it('handles adding multiple items to existing array', () => {
      const arr = new SortedArray<number>((a, b) => a - b);
      arr.add(4);
      arr.add(7);

      const indices = arr.addMultiple(1, 9, 6, 2);

      expect(indices).toEqual([0, 1, 3, 5]);
      expect(Array.from(arr)).toEqual([1, 2, 4, 6, 7, 9]);
    });

    it('handles duplicate values in addMultiple', () => {
      const arr = new SortedArray<number>((a, b) => a - b);
      const indices = arr.addMultiple(3, 3, 1, 5, 3);

      expect(indices).toEqual([0, 1, 2, 3, 4]);
      expect(Array.from(arr)).toEqual([1, 3, 3, 3, 5]);
    });

    it('returns empty array when addMultiple is called with no arguments', () => {
      const arr = new SortedArray<number>((a, b) => a - b);
      arr.add(1);

      const indices = arr.addMultiple();

      expect(indices).toEqual([]);
      expect(Array.from(arr)).toEqual([1]);
    });

    it('correctly handles addMultiple with custom comparator', () => {
      const arr = new SortedArray<string>((a, b) => b.localeCompare(a)); // reverse order
      const indices = arr.addMultiple('apple', 'banana', 'cherry');

      expect(indices).toEqual([0, 1, 2]);
      expect(Array.from(arr)).toEqual(['cherry', 'banana', 'apple']);
    });
  });

  describe('removeMultiple', () => {
    it('removes multiple items correctly', () => {
      const arr = new SortedArray<number>((a, b) => a - b);
      arr.addMultiple(1, 2, 3, 4, 5, 6, 7);

      const removedIndices = arr.removeMultiple(2, 5, 7);

      expect(removedIndices).toEqual([6, 4, 1]);
      expect(Array.from(arr)).toEqual([1, 3, 4, 6]);
    });

    it('handles removing values that do not exist', () => {
      const arr = new SortedArray<number>((a, b) => a - b);
      arr.addMultiple(1, 3, 5);

      const removedIndices = arr.removeMultiple(2, 4, 6);

      expect(removedIndices).toEqual([]);
      expect(Array.from(arr)).toEqual([1, 3, 5]);
    });

    it('removes duplicate values', () => {
      const arr = new SortedArray<number>((a, b) => a - b);
      arr.addMultiple(1, 2, 2, 2, 3, 4);

      const removedIndices = arr.removeMultiple(2);

      expect(removedIndices).toEqual([3, 2, 1]);
      expect(Array.from(arr)).toEqual([1, 3, 4]);
    });

    it('removes multiple duplicate values', () => {
      const arr = new SortedArray<number>((a, b) => a - b);
      arr.addMultiple(1, 2, 2, 3, 3, 3, 4);

      const removedIndices = arr.removeMultiple(2, 3);

      expect(removedIndices).toEqual([5, 4, 3, 2, 1]);
      expect(Array.from(arr)).toEqual([1, 4]);
    });

    it('returns empty array when removeMultiple is called with no arguments', () => {
      const arr = new SortedArray<number>((a, b) => a - b);
      arr.addMultiple(1, 2, 3);

      const removedIndices = arr.removeMultiple();

      expect(removedIndices).toEqual([]);
      expect(Array.from(arr)).toEqual([1, 2, 3]);
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
      const david = { name: 'David', age: 35 };

      people.addMultiple(alice, bob, charlie, david);

      const removedIndices = people.removeMultiple(alice, david);

      expect(removedIndices).toEqual([3, 1]);
      expect(Array.from(people)).toEqual([charlie, bob]);
    });
  });

  describe('filtering', () => {
    it('should filter elements correctly', () => {
      const arr = new SortedArray<number>((a, b) => a - b);
      arr.addMultiple(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

      const evenNumbers = arr.filter((n) => n % 2 === 0);

      expect(evenNumbers.length).toBe(5);
      expect(Array.from(evenNumbers)).toEqual([2, 4, 6, 8, 10]);
    });

    it('should maintain the original sort order after filtering', () => {
      // Descending order
      const arr = new SortedArray<number>((a, b) => b - a);
      arr.addMultiple(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

      const evenNumbers = arr.filter((n) => n % 2 === 0);

      // Should still be in descending order
      expect(Array.from(evenNumbers)).toEqual([10, 8, 6, 4, 2]);
    });

    it('should return an empty array when no elements match', () => {
      const arr = new SortedArray<number>((a, b) => a - b);
      arr.addMultiple(1, 2, 3, 4, 5);

      const filtered = arr.filter((n) => n > 10);

      expect(filtered.length).toBe(0);
      expect(Array.from(filtered)).toEqual([]);
    });

    it('should return a new array with all elements when all match', () => {
      const arr = new SortedArray<number>((a, b) => a - b);
      arr.addMultiple(1, 2, 3, 4, 5);

      const filtered = arr.filter(() => true);

      expect(filtered.length).toBe(5);
      expect(Array.from(filtered)).toEqual([1, 2, 3, 4, 5]);
      expect(filtered).not.toBe(arr); // Should be a new instance
    });

    it('should work with custom objects', () => {
      interface Person {
        name: string;
        age: number;
      }

      const people = new SortedArray<Person>((a, b) => a.age - b.age);
      const alice = { name: 'Alice', age: 25 };
      const bob = { name: 'Bob', age: 30 };
      const charlie = { name: 'Charlie', age: 20 };
      const david = { name: 'David', age: 35 };

      people.addMultiple(alice, bob, charlie, david);

      const adults = people.filter((p) => p.age >= 25);

      expect(adults.length).toBe(3);
      expect(Array.from(adults)).toEqual([alice, bob, david]);
    });

    it('should provide correct indices and array to predicate', () => {
      const arr = new SortedArray<number>((a, b) => a - b);
      arr.addMultiple(10, 20, 30);

      const calls: Array<[number, number, Readonly<number[]>]> = [];

      arr.filter((value, index, array) => {
        calls.push([value, index, array]);
        return false;
      });

      expect(calls.length).toBe(3);
      expect(calls[0][0]).toBe(10);
      expect(calls[0][1]).toBe(0);
      expect(calls[1][0]).toBe(20);
      expect(calls[1][1]).toBe(1);
      expect(calls[2][0]).toBe(30);
      expect(calls[2][1]).toBe(2);
    });
  });

  describe('finding indices', () => {
    it('should find index correctly using predicate', () => {
      const arr = new SortedArray<number>((a, b) => a - b);
      arr.addMultiple(1, 3, 5, 7, 9);

      const index = arr.findIndex((item) => item > 4);
      expect(index).toBe(2); // index of 5

      const noMatch = arr.findIndex((item) => item > 10);
      expect(noMatch).toBe(-1);
    });

    it('should find last index correctly using predicate', () => {
      const arr = new SortedArray<number>((a, b) => a - b);
      arr.addMultiple(1, 3, 5, 7, 9);

      const index = arr.findLastIndex((item) => item < 6);
      expect(index).toBe(2); // index of 5

      const noMatch = arr.findLastIndex((item) => item < 0);
      expect(noMatch).toBe(-1);
    });

    it('should find all indices correctly using predicate', () => {
      const arr = new SortedArray<number>((a, b) => a - b);
      arr.addMultiple(1, 2, 3, 4, 5, 6, 7, 8, 9);

      const indices = arr.findIndices((item) => item % 2 === 0);
      expect(indices).toEqual([1, 3, 5, 7]); // indices of 2, 4, 6, 8

      const noMatches = arr.findIndices((item) => item > 10);
      expect(noMatches).toEqual([]);
    });

    it('should provide correct element indices and array to predicate', () => {
      const arr = new SortedArray<number>((a, b) => a - b);
      arr.addMultiple(10, 20, 30);

      const calls: Array<[number, number, Readonly<number[]>]> = [];

      arr.findIndex((value, index, array) => {
        calls.push([value, index, array]);
        return false;
      });

      expect(calls.length).toBe(3);
      expect(calls[0][0]).toBe(10);
      expect(calls[0][1]).toBe(0);
      expect(calls[1][0]).toBe(20);
      expect(calls[1][1]).toBe(1);
      expect(calls[2][0]).toBe(30);
      expect(calls[2][1]).toBe(2);
    });

    it('should work with object arrays', () => {
      interface Person {
        name: string;
        age: number;
      }

      const people = new SortedArray<Person>((a, b) => a.age - b.age);
      const alice = { name: 'Alice', age: 25 };
      const bob = { name: 'Bob', age: 30 };
      const charlie = { name: 'Charlie', age: 20 };
      const david = { name: 'David', age: 35 };

      people.addMultiple(alice, bob, charlie, david);

      const youngPerson = people.findIndex((p) => p.age < 25);
      expect(youngPerson).toBe(0); // charlie

      const oldPersonLast = people.findLastIndex((p) => p.age > 25);
      expect(oldPersonLast).toBe(3); // david

      const middleAgedPeople = people.findIndices((p) => p.age >= 25 && p.age < 35);
      expect(middleAgedPeople).toEqual([1, 2]); // alice and bob
    });
  });
});
