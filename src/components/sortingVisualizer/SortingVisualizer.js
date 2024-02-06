import { useEffect, useRef, useState } from "react";
import './SortingVisualizer.css';
import { mergeSort, bubbleSort } from "../sortingAlgorithms/sortingAlgorithms";
import { toBeChecked } from "@testing-library/jest-dom/matchers";

const SortingVisualizer = () => {
  const [array, setArray] = useState([]);
  const [animationSpeed, setAnimationSpeed] = useState('slow');
  const [sortAlgor, setSortAlgor] = useState('bubbleSort'); 
  const [runningStatus, setRunningStatus] = useState(false);
  const animationTimeoutsRef = useRef([]);
  useEffect(() => {
    setArray(randomArray());
  }, []);

  function randomArray() {
    const arr = [];
    let count = 0;
    while (count < 50) {
      let number = randomIntFromInterval(10, 200);
      arr.push({'value': number});
      count++;
    }
    return arr;
  }

  function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  const handleMergeSort = () => {
    setArray(mergeSort(array));
  }

  const handleBubbleSort = () => {
    let swappedIndexes = bubbleSort(array);
    showAnimation(swappedIndexes);
  }

  const handleRandomArray = () => {
    setArray(randomArray());
  }

  function swap(array, i, j) {
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  function markSwapIndexes(array, i, j, color) {
    array[i].background = color;
    array[j].background = color;
    array.forEach((element, index) => {
      if (index !== i && index !== j && element.background != 'red') {
        element.background = '';
      }
    })
  }

  function markComplete(array, color) {
    array.forEach((element) => {
        element.background = color;
    })
  }

  function markSortedElement(array, i, color) {
    array[i].background = color;
  }

  function showAnimation(swappedIndexes) {
    let completed = false;
    let delayTime = animationSpeed === 'slow' ? 500 : 10;

    let count = 0;
    for (let i = 0; i < swappedIndexes.length; i++) {
      let index = swappedIndexes[i][1];
      let sortingTimes = swappedIndexes[i][0];

      let timeout = setTimeout(() => {
        markSwapIndexes(array, index, index+1, 'yellow');   
        setArray(array.slice());
  
        let timeout = setTimeout(() => {
          swap(array, index, index+1);
          markSwapIndexes(array, index, index+1, 'green');


          if (i === swappedIndexes.length - 1) {
            markComplete(array, 'orange');
            completed = true;
          } else if (isLastSwapOfSortingTimes(swappedIndexes, i)) {
            markSortedElement(array, array.length - 1 - sortingTimes, 'red');
          }

          setArray(array.slice());
          if (completed) {
            setRunningStatus(false);
          }
        }, delayTime/2);
        animationTimeoutsRef.current.push(timeout);
      }, delayTime*count);
      animationTimeoutsRef.current.push(timeout);
      count++;
    }
  }

  function isLastSwapOfSortingTimes(swappedIndexes, i) {
    if (i >= swappedIndexes.length - 1) {
      return true;
    }

    let count = swappedIndexes[i][0];
    let nextCount = swappedIndexes[i + 1][0];

    return nextCount > count;
  }

  const getStyle = (element) => {
    let style = { height: `${element.value}px`};
    return element.background ? {...style, background: element.background} : style;
  }
  
  const handleRunningStatus = () => {
    let currentStatus = !runningStatus;
    if (currentStatus) {
      handleBubbleSort();
    } else {
      console.log('animationTimeouts', animationTimeoutsRef.current);
      animationTimeoutsRef.current.forEach((timeout) => {
        clearTimeout(timeout);
      })
      animationTimeoutsRef.current = [];
    }
    setRunningStatus(currentStatus);
  }

  const selectSortAlgorithms = () => {
    setSortAlgor('bubbleSort');
  }

  return (
      <div>
        <div className="chart-container">
              {array.map((element, index) => {
                return <div className="bar" key={index} id={'bar_'+ index} style={getStyle(element)}></div>
              })}
        </div>
        {
          runningStatus
          ? <div className="ctrl-containter">
            <button className="btn-stop" onClick={handleRunningStatus}>Stop</button>
          </div>
          : 
          <div>
            <div className="ctrl-containter">
              <div>
                <button className="btn-stop" onClick={handleRunningStatus}>Start</button>
              </div>
              <div className="radio-group-wrapper">
                <p>Animation Speed:</p>
                <div>
                  <input type="radio" id="speed_slow" name="speed" onChange={() => {setAnimationSpeed('slow')}} checked={animationSpeed === 'slow'}/>
                  <label htmlFor="speed_slow">Slow</label>
                </div>
                <div>
                  <input type="radio" id="speed_fast" name="speed" onChange={() => {setAnimationSpeed('fast')}} checked={animationSpeed === 'fast'}/>
                  <label htmlFor="speed_fast">Fast</label>
                </div>
              </div>
              <div className="radio-group-wrapper">
                <p>Sort Algorithms: </p>
                <div onClick={() => {selectSortAlgorithms('bubbleSort')}}>
                  <input type="radio" id="algor_bubble" name="algor" defaultChecked/>
                  <label htmlFor="algor_bubble">Bubble Sort</label>
                </div>
              </div>

              <div className="button-group">
                <button onClick={handleRandomArray}>Random a new array</button>
              </div>
            </div>
          </div>
        }
      </div>
  );
}


export default SortingVisualizer;