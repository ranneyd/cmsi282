'use strict';

const N = 8;


const N_SQUARED = N * N;

let printQueens = (queens) => {
    console.log("-".repeat(2 * N + 3));
    for(let i = 0; i < N; ++i) {
        let str = "| "
        for(let j = 0; j < N; ++j) {
            str += queens[i * N + j] + " ";
        }
        console.log(str + "|");
    }
    console.log("-".repeat(2 * N + 3));
};

let getNext = (elem) => {
    if(elem === 1){
        return 0;
    }
    if(elem === 0){
        return false;
    }
    return 1;
};

let checkResult = (results) => {
    let blankPlaces = N_SQUARED - results.length;

    // We alternate 1/0. If the last thing in our results array is a 0, that means we just pushed a
    // zero. At any stage, if we're trying something, everything up until this queen placement is
    // valid. Adding a zero never invalidates a placement UNLESS it's full and there aren't enough
    // queens.
    if(results[results.length - 1] === 0) {
        // If we're full
        if(!blankPlaces) {
            // We have to reduce, which isn't free, but obviously preferable to doing the whole
            // check just to find the number of queens
            let numQueens = results.reduce((prev, current) => prev + current);
            //Do we have enough queens? If so, we win, otherwise we lose
            return numQueens < N ? "fail" : "pass";
        }
        return "partial";
    }

    let blanks = new Array(blankPlaces);
    blanks.fill(0);
    results = results.concat(blanks);

    let illegal = new Array(N_SQUARED);
    illegal.fill(0);
    let numQueens = 0;

    for(let i = 0; i < N; ++i){
        for(let j = 0; j < N; ++j){
            let index = i * N + j;
            // Only do stuff if we have a queen
            if(results[index]) {
                numQueens++;
                // we know the numQueens can't be more than N. So that's a freebie. Otherwise, we
                // know we can't place the queen if this spot is illegal
                if(numQueens > N || illegal[index]) {
                    return 'fail';
                }
                // Otherwise, we need to mark all the bad places

                // self
                illegal[index] = 1;
                // row
                let rowN = i * N;
                for(let col = 0; col < N; ++col){
                    illegal[rowN + col] = 1;
                }
                // col
                rowN = 0;
                for(let row = 0; row < N; ++row){
                    illegal[rowN + j] = 1;
                    rowN += N;
                }
                // nw
                let row = i - 1;
                let col = j - 1;
                rowN = row * N;
                while(row >= 0 && col >= 0){
                    illegal[rowN + col] = 1;
                    rowN -= N;
                    col -= 1;
                }
                // ne
                row = i - 1;
                col = j + 1;
                rowN = row * N;
                while(row >= 0 && col < N){
                    illegal[rowN + col] = 1;
                    rowN -= N;
                    col += 1;
                }
                // se
                row = i + 1;
                col = j + 1;
                rowN = row * N;
                while(row < N && col < N){
                    illegal[rowN + col] = 1;
                    rowN += N;
                    col += 1;
                }
                // sw
                row = i + 1;
                col = j -1;
                rowN = row * N;
                while(row < N && col >= 0){
                    illegal[rowN + col] = 1;
                    rowN += N;
                    col -= 1;
                }
            }
        }
    }
    // If we don't have enough queens and we're full, RIP
    if(!blankPlaces && numQueens < N){
        return 'fail';
    }
    // No problems? We win!
    return blankPlaces ? "partial" : "pass";
}

let queens = require("./BacktrackingEngine")(getNext, checkResult);

printQueens(queens);
