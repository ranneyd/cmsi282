'use strict';
// getNext: function that takes some kind of value as a parameter. The idea is, we will try a value,
// and when we find out it doesn't work, we need the next one. getNext takes the previous value and
// gives us what we should try next. If nothing is passed in, it should give us the first value we
// should try. It should return false if there is no next value.

// checkResults takes a results array and returns "fail" if it fails, "partial" if it is a partial
// solution, and "pass" if it is a complete solution.
module.exports = (getNext, checkResult) => {
    let generator = (arr) => {
        let next;
        while((next = getNext(next)) !== false) {
            arr.push(next);
            let result = checkResult(arr);
            if(result === "pass"){
                return arr;
            }
            if(result === "partial") {
                // move on to the next one
                result = generator(arr);
                if(result){
                    return result;
                }
                // if it didn't work, go down to the undo pop
            }
            // Take off the one we pushed
            arr.pop();
        }
        // None of the options worked. :(
        return false;
    };
    return generator([]);
}