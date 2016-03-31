'use strict';

var memoCounter = 0;
var counter = 0;

let threePartition = (numbers) => {
  let length = numbers.length;

  if( length % 3 !== 0){
    return false;
  }
  let memoTable = {};
  let memokey = new Array(length);
  memokey.fill(1);
  // This is for no purpose other than so we don't have to do the join
  // every time
  let EMPTYKEY = (new Array(length)).fill(0).join("");
  return threeHelper(numbers, memokey, memoTable, EMPTYKEY);
}

let threeHelper = (numbers, memokey, memoTable, EMPTYKEY) => {
  let length = numbers.length;
  let memoKeyString = memokey.join("");

  if( length === 0) {
    return 0;
  }
  for( let i = 0; i < length; ++i ) {
    if(memokey[i]) {
      for( let j = i + 1; j < length; ++j) {
        if(memokey[j]) {
          for( let k = j + 1; k < length; ++k) {
            if(memokey[k]) {
              counter++;
              let sum = numbers[i] + numbers[j] + numbers[k];

              // copy
              let key = memokey.slice(0);
              // We're not using these guys
              key[i] = 0;
              key[j] = 0;
              key[k] = 0;

              let keyString = key.join("");

              // If we have no where left to go, we win
              if( keyString === EMPTYKEY ) {
                memoTable[memoKeyString] = sum;
                return sum;
              }

              let memoVal = memoTable[keyString];


              // If it's in the table
              if(memoVal !== undefined){
                ++memoCounter;
                // and if it's our number, we win!
                if(memoVal === sum){
                  return sum;
                }
              }
              else{
                let result = threeHelper(numbers, key, memoTable, EMPTYKEY);
                if( result === sum ){
                  memoTable[memoKeyString] = sum;
                  return sum;
                }
                else{
                  memoTable[memoKeyString] = false;
                }
              }         
            }
          }
        }
      }
    }
  }
  return false;
};

let solutions = [
  [ [2,4,8,12,15,2,0,6,3,2,9,1],  16 ],
  [ [2,4,8,12,17,2,0,6,3,2,9,1],  false],
  [ [6, -1, 8, 3455, 11, 7],      false],
  [ [6, -1, 8, -3, 11, 7],        14 ],
  [ [],                           0 ],
  [ [1, 2, 3],                    6 ],
  [ [1],                          false],
  [ [1, 2],                       false],
  [ [1, 2, 3, 4],                 false],
  [ [1, 2, 3, 4, 5, 6],           false],
  [ [1, 2, 3, 4, 5, 7],           11 ],
  [ [1, 2, 3, 4, 5, 6, 7, 8, 9],  15],
  [ [1, 2, 3, 4, 5, 6, 7, 8, 10], false],
  [ [1, 2, 3, 4, 5, 6, 7, 8, 10, 1, 2, 3], 13],
  [ [1, 2, 3, 4, 5, 6, 7, 8, 10, 1, 2, 3, 4, 5, 6], false],

];

for( let i in solutions) {
  memoCounter = 0;
  counter = 0;
  let soln = solutions[i]
  let result = threePartition(soln[0]);
  if( result ^ soln[1]) {
    console.log(`${i}: Got ${result} expected ${soln[1]}`);
  }
  console.log(`Memo hits: ${memoCounter} Iterations: ${counter} Benefit: ${100 * memoCounter / counter }%`);
}