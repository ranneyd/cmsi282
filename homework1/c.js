'use strict';

let count = 0;

let c = (n, k) => {
    count++;
    if( k === 0 || k === n) {
        return 1;
    }
    return c( n - 1, k) + c( n - 1, k - 1);
}

let memo = {};

let cMemo = (n, k) => {
    count++;
    if( k === 0 || k === n) {
        return 1;
    }

    //console.log(`n k ${n} ${k}`);
    let key = "" + ( n - 1) + "|" + k;
    let memoVal = memo[key];

    //console.log(`1 key ${key} value ${memoVal}`);

    let one;
    if( memoVal ) {
        //console.log("1 yay hit");
        one = memoVal;
    }
    else{
        one = cMemo( n - 1, k);
        memo[key] = one;
    }

    key = "" + ( n - 1) + "|" + ( k - 1 );
    memoVal = memo[key];
    
    //console.log(`2 key ${key} value ${memoVal}`);

    let two;
    if( memoVal ) {
        //console.log("2 yay hit");
        two = memoVal;
    }
    else{
        two = cMemo( n - 1, k - 1);
        memo[key] = two;
    }

    return one + two;
}

let solns = [
    [ [0, 0], 1],
    [ [42, 0], 1],
    [ [42, 42], 1],
    [ [2, 1], 2],
    [ [2, 1], 2],
    [ [20, 11], 167960],
    [ [40, 30], 847660528],
    [ [50, 40], 847660528],
];

for( let i in solns) {
    count = 0;
    let soln = solns[i]
    let result = c(...soln[0]);
    
    if( result !== soln[1]) {
        console.log(`${i}: Got ${result} expected ${soln[1]}`);
    }
    console.log(`${i}: Function calls: ${count}`);

    let noMemo = count;
    count = 0;
    result = cMemo(...soln[0]);

    if( result !== soln[1]) {
        console.log(`${i}: (memo) Got ${result} expected ${soln[1]}`);
    }
    console.log(`${i}: (memo) Function calls: ${count}; Ratio nomemo/memo: ${noMemo / count}`);
}