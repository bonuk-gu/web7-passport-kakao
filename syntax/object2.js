// array, object

var f1 = function() {
    console.log(1+1);
    console.log(1+2);
} // 데이터(값)으로서의 함수

console.log(f1);
f1();

// var i = if(true){console.log(1)};

// var w = while(true){console.log(1)};

var a = [f1]; // 배열의 원소로서의 함수
a[0]();

var o = {
    func:f1
} // 객체의 멤버로서의 함수
o.func();
