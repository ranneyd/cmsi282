'use strict';

const N = 50;
const ZERO_TO_THIS = 2;


let getNext = (elem) => {
    if(elem !== undefined){
        if(elem > ZERO_TO_THIS) {
            return false;
        }
        return elem + 1;
    }
    return 0;
};

// Illustrative example:
// 010210 has no substrings. Let's add a 2 to the end then check for substrings
// ^ - front, | - back
//
//    0 1 0 2 1 0 2
// 0            ^ |  ok
// 1        ^   |    ok
// 2    ^   |        X
//
// What if we tried a 1:
//
//    0 1 0 2 1 0 1
// 0            ^ |  ok
// 1        ^   |    ok
// 2    ^     |      ok
//
// Story checks out
//

// TODO: Should be a way to memoize though, where we realize that we have 102 and 10, so a 2 break
// it and we only have to check for 2 instead of rechecking the rest of the substring.


let checkResult = (results) => {
    let len = results.length;
    let end = len - 1;
    let odd = len % 2;

    let back = end;
    let front = end -1;
    while(front >= 0){
        let isAdjSub = true;
        for(let i = 0; back + i < len; ++i) {
            if(results[front + i] !== results[back + i]){
                isAdjSub = false;
                break;
            }
        }
        if(isAdjSub){
            return 'fail';
        }
        front -= 2;
        back  -= 1;
    }
    return len === N ? "pass" : "partial";
}

let neas = require("./BacktrackingEngine")(getNext, checkResult);

console.log(neas.join(""));
