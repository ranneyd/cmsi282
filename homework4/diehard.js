'use strict';

// Set these to your liking
const JUG_SIZES = [10, 7, 4];
const STARTING_FILL = [0, 7, 4];
const ENDS = [
    [-1, 2, -1],
    [-1, -1, 2],
];

// Computed constants
const NUM_JUGS = JUG_SIZES.length;
const adjTable = {};

const getAdj = (fill) => {
    let results = [];
    // For every jug
    for(let i = 0; i < NUM_JUGS; ++i) {
        let jugFill = fill[i];
        // Is it non-empty?
        if(jugFill){
            // Get every way we can pour it into the other jugs
            for(let j = 0; j < NUM_JUGS; ++j){
                // Is it not ourself, and is the destination not full?
                if(j !== i && fill[j] < JUG_SIZES[j]) {
                    let combined = fill[i] + fill[j];
                    // Would we overflow if we poured all of it?
                    if(combined > JUG_SIZES[j]){
                        let overflow = combined - JUG_SIZES[j];
                        // copy
                        let result = fill.slice();
                        // pour out, but only enough to fill it up
                        result[i] = overflow;
                        // fill it up
                        result[j] = JUG_SIZES[j];
                        results.push(result);
                    }
                    else{
                        // copy
                        let result = fill.slice();
                        // pour out
                        result[i] = 0;
                        result[j] = combined;
                        results.push(result);
                    }
                }
            }
        }
    }
    return results;
};

const goalMet = (fill) => {
    // for each possible end result
    for(let end of ENDS){
        let pass = true;
        for(let i = 0; i < NUM_JUGS; ++i){
            let endJug = end[i];
            // If the key doesn't have -1, but the number doesn't match our number, we lose
            if(endJug > -1 && endJug !== fill[i]){
                pass = false;
                break;
            }
        }
        if(pass){
            return true;
        }
    }
    // If we never passed, we lose
    return false;
};

const findPath = () => {

}
