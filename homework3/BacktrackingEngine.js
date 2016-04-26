'use strict';
// getNext: function that takes some kind of value as a parameter. The idea is, we will try a value,
// and when we find out it doesn't work, we need the next one. getNext takes the previous value and
// gives us what we should try next. If nothing is passed in, it should give us the first value we
// should try. It should return false if there is no next value.

// checkResults takes a results array and returns false if it fails, "partial" if it is a partial
// solution, and true if it is a complete solution.
module.exports = (getNext, checkResult) => {
    let generator = (arr) => {
        let next;
        while(next = getNext(next)) {
            arr.push(next);
            let result = checkResult(arr);
            if(result === "partial") {

            }
            else if (result) {

            }
            else {
                // Take off the one we pushed
                arr.pop();
                return false;
            }
        }
    };
}