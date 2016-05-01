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

class Leaf{
    constructor(parent, fill){
        this.parent = parent;
        this.fill = fill;
        this.children = [];
    }
    spawnChild(){
        return new Leaf(this, this.fill.slice());
    }
    toString(){
        return this.fill.join("/");
    }
    getLineage(){
        let str = this.toString();
        let parent = this.parent;
        while(parent){
            str = parent.toString() + "\n" + str;
            parent = parent.parent;
        }
        return str;
    }
    isWinner(){
        // for each possible end result
        for(let end of ENDS){
            let pass = true;
            for(let i = 0; i < NUM_JUGS; ++i){
                let endJug = end[i];
                // If the key doesn't have -1, but the number doesn't match our number, we lose
                if(endJug > -1 && endJug !== this.fill[i]){
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
    }
}

class PourTree{
    constructor(root){
        this.root = root;
        this.leaves = [root];
        this.usedStates = {};
        this.usedStates[root.toString()] = true;
    }
    useState(state){
        this.usedStates[state.toString()] = true;
    }
    isUsed(state){
        return !!this.usedStates[state.toString()];
    }
}


const startLeaf = new Leaf(null, STARTING_FILL);
const tree = new PourTree(startLeaf);

const getAdj = (leaf) => {
    let results = [];
    // For every jug
    for(let i = 0; i < NUM_JUGS; ++i) {
        let jugFill = leaf.fill[i];
        // Is it non-empty?
        if(jugFill){
            // Get every way we can pour it into the other jugs
            for(let j = 0; j < NUM_JUGS; ++j){
                // Is it not ourself, and is the destination not full?
                if(j !== i && leaf.fill[j] < JUG_SIZES[j]) {
                    let combined = leaf.fill[i] + leaf.fill[j];
                    // copy
                    let result = leaf.spawnChild();

                    // Would we overflow if we poured all of it?
                    if(combined > JUG_SIZES[j]){
                        let overflow = combined - JUG_SIZES[j];
                        // pour out, but only enough to fill it up
                        result.fill[i] = overflow;
                        // fill it up
                        result.fill[j] = JUG_SIZES[j];
                    }
                    else{
                        // pour out
                        result.fill[i] = 0;
                        result.fill[j] = combined;
                    }

                    // Have we not already hit this adjacency?
                    if(!tree.isUsed(result)){
                        results.push(result);
                        tree.useState(result.toString());
                    }
                }
            }
        }
    }
    return results;
};

let findPath = () => {
    let leaves = tree.leaves;
    // First check if any of our leaves are the winner
    for(let leaf of leaves){
        // Winner?
        if(leaf.isWinner()){
            // chicken dinner
            return leaf;
        }
    }

    // So we have no winners. Let's get some new leaves
    let newLeaves = [];
    for(let leaf of leaves){
        let adj = getAdj(leaf);
        newLeaves = newLeaves.concat(adj);
    }
    // If there are no legal adjacencies, it wasn't possible
    if(!newLeaves.length){
        return false;
    }
    tree.leaves = newLeaves;
    return findPath();
}

let leaf = findPath();

if(leaf){
    console.log(leaf.getLineage());
}
else{
    console.log("fail");
}

