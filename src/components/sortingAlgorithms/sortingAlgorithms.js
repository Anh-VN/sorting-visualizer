export const mergeSort = (array) => {
  if (array.length <= 1) {
    return array;
  }

  const middleIndex = Math.floor(array.length / 2);
  const sortedFirstHalf = mergeSort(array.slice(0, middleIndex));
  const sortedSecondHalf = mergeSort(array.slice(middleIndex));

  let i = 0; 
  let j = 0;
  const sortedArray = [];

  while (i < sortedFirstHalf.length && j < sortedSecondHalf.length) {
    if (sortedFirstHalf[i] <= sortedSecondHalf[j]) {
      sortedArray.push(sortedFirstHalf[i++]);
    } else {
      sortedArray.push(sortedSecondHalf[j++]);
    }
  }

  while (i < sortedFirstHalf.length) {
    sortedArray.push(sortedFirstHalf[i++]);
  }

  while (j < sortedSecondHalf.length) {
    sortedArray.push(sortedSecondHalf[j++]);
  }

  return sortedArray;
}

export const bubbleSort = (array) => {
  let clonedArr = array.slice();
  let swapped;
  let swappedIndexes = [];
  let count = 0;
  do {
    swapped = false;
    for (let i = 0; i < clonedArr.length - count - 1; i++) {
      if (clonedArr[i].value > clonedArr[i + 1].value) {
        let temp = clonedArr[i];
        clonedArr[i] = clonedArr[i+1];
        clonedArr[i+1] = temp;
        swapped = true;
        swappedIndexes.push([count, i]);
      }
    }
    count++;
  } while (swapped) 

  return swappedIndexes;
}