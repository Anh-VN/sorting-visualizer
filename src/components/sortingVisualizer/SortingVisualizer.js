import { useEffect, useRef, useState } from "react";
import './SortingVisualizer.css';
import { mergeSort, bubbleSort } from "../sortingAlgorithms/sortingAlgorithms";

const SortingVisualizer = () => {
  const [array, setArray] = useState([]);
  const [animationSpeed, setAnimationSpeed] = useState('fast');
  const [sortAlgor, setSortAlgor] = useState('bubbleSort'); 
  const [runningStatus, setRunningStatus] = useState('new');
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
    setRunningStatus('new');
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
      if (index !== i && index !== j && element.background !== 'red') {
        element.background = '';
      }
    })
  }

  function markComplete(array, color) {
    array.forEach((element) => {
        element.background = color;
    })
  }

  function clearMarkColor(array) {
    array.forEach((element) => {
        element.background = '';
    })
  }

  function markSortedElement(array, i, color) {
    array[i].background = color;
  }

  function showAnimation(swappedIndexes) {
    let delayTime = animationSpeed === 'slow' ? 500 : 10;

    let count = 0;
    for (let i = 0; i < swappedIndexes.length; i++) {
      let index = swappedIndexes[i][1];
      let sortingTimes = swappedIndexes[i][0];

      let timeout = setTimeout(() => {
        let lastSwap = i === swappedIndexes.length - 1;
        markSwapIndexes(array, index, index+1, 'yellow');   
        setArray(array.slice());
  
        let timeout = setTimeout(() => {
          swap(array, index, index+1);
          markSwapIndexes(array, index, index+1, 'green');


          if (lastSwap) {
            markComplete(array, 'orange');
          } else if (isLastSwapOfSortingTimes(swappedIndexes, i)) {
            markSortedElement(array, array.length - 1 - sortingTimes, 'red');
          }

          setArray(array.slice());
          if (lastSwap) {
            setRunningStatus('completed');
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
  
  const handleRunningStatus = (status) => {
    if (status === 'running') {
      handleBubbleSort();
    } else if (status === 'stopped') {
      console.log('animationTimeouts', animationTimeoutsRef.current);
      animationTimeoutsRef.current.forEach((timeout) => {
        clearTimeout(timeout);
      })
      animationTimeoutsRef.current = [];
      clearMarkColor(array);
    }
    setRunningStatus(status);
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
          runningStatus === 'running'
          ? <div className="ctrl-containter">
            <button className="btn-stop" onClick={() => handleRunningStatus('stopped')}>Stop</button>
          </div>
          : 
          (<div className="ctrl-containter">
            { runningStatus !== 'completed' &&
              <>
                <div>
                  <button className="btn-stop" onClick={() => handleRunningStatus('running')}>Start</button>
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
              </>}

            <div>
              <button className="btn-random-array" onClick={handleRandomArray}>Random a new array</button>
            </div>
          </div>)
        }
      </div>
  );
}


export default SortingVisualizer;