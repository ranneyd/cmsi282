'use strict';
module.exports = class Deque{
    constructor(arr){
        this.front = null;
        this.back = null;
        for(let i of arr){
            this.push(i);
        }
    }
    isEmpty(){
        return this.front === null;
    }
    push(val){
        this.push_back(val);
    }
    push_back(val){

    }
    push_front(val){

    }
    pop(){
        this.pop_back();
    }
    pop_front(){

    }
    pop_back(){

    }
}