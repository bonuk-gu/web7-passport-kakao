console.log(Math.round(1.6)); // 반올림, 2
console.log(Math.round(1.4)); // 1

function sum(a, b) {
    console.log('a'); // 출력됨
    return a + b;
    console.log('b'); // 출력안됨
}

console.log(sum(2, 4));