'use strict';

class Polynomial {
    constructor(coefficients) {
        this.coefficients = coefficients;
        this.max = Math.max(...Object.keys(coefficients));

        // If a coefficient isn't provided, it's 0
        // We know we have the coefficient for the maximum one, so -1
        for( let i = this.max - 1; i >= 0; --i) {
            if( !coefficients[i] ){
                coefficients[i] = 0;
            }
        }
    }
    evaluate(x) {
        let i = this.max;
        let result = 0;
        while(i >= 0) {
            // Get the coefficient
            let a = this.coefficients[i--];
            // Multiply x by what we got last time
            let b = result * x;
            // The result is the sum
            result = a + b;
        }
        return result;
    }
}

let solutions = [
    [
        {0:1},  // coefficients
        1,      // x
        1       // result
    ],
    [
        {0:1},  // coefficients
        2,      // x
        1       // result
    ],
    [
        {3:1, 2:-6, 1:11, 0:-6},// coefficients
        2,                      // x
        0                       // result
    ],
    [
        {3:2, 2:-6, 1:2, 0:-1}, // coefficients
        3,                      // x
        5                       // result
    ],
    [
        {4:1, 3:3, 2:5, 1:7, 0:9},  // coefficients
        2,                          // x
        83                          // result
    ],
    [
        {3:2, 1:-3, 0:-5},  // coefficients
        -2,                 // x
        -15                 // result
    ]
];

for( let i in solutions) {
    let soln = solutions[i]
    let poly = new Polynomial(soln[0]);
    let result = poly.evaluate(soln[1]);
    if( result !== soln[2]) {
        console.log(`${i}: Got ${result} expected ${soln[2]}`);
    }
}