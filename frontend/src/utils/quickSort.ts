import type { EventType } from '../types';

function getPivot(
  array: any[],
  sortBy: string,
  sortDesc = true,
  start = 0,
  end = array.length - 1,
) {
  const swap = (arr: EventType[], index1: number, index2: number) => {
    [arr[index1], arr[index2]] = [arr[index2], arr[index1]];
  };

  const pivot = array[start][sortBy];
  let swapIndex = start;

  switch (sortDesc) {
    case false:
      for (let i = start + 1; i <= end; i += 1) {
        if (pivot > array[i][sortBy]) {
          swapIndex += 1;
          swap(array, swapIndex, i);
        }
      }
      break;

    default:
      for (let i = start + 1; i <= end; i += 1) {
        if (pivot < array[i][sortBy]) {
          swapIndex += 1;
          swap(array, swapIndex, i);
        }
      }
  }

  swap(array, start, swapIndex);
  return swapIndex;
}

function quickSort(
  array: any[],
  sortBy: string,
  sortDesc = true,
  left = 0,
  right = array.length - 1,
) {
  if (left < right) {
    const pivotIndex = getPivot(array, sortBy, sortDesc, left, right);

    quickSort(array, sortBy, sortDesc, left, pivotIndex - 1);
    quickSort(array, sortBy, sortDesc, pivotIndex + 1, right);
  }

  return array;
}

export default quickSort;
