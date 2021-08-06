var members = ['bonwook', 'dahyeon', 'jiyoung'];
console.log(members[1]);
var i = 0;
while(i < members.length) {
    console.log('array loop:', members[i]);
    i = i + 1;
}

var roles = {
    'programmer':'bonwook',
    'ceo':'dahyeon',
    'database':'jiyoung'
}
console.log(roles.database);
console.log(roles['database']);

for (var name in roles) {
    console.log('object loop:', name, ', value:', roles[name]); // key
}