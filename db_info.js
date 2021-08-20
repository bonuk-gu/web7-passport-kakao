var mysql = require('mysql');

var dbconnInfo = {
    local: {
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: 'secpass6180',
        database: 'google_passport'
    }
}

var dbconnection = {
    init:function() {
        return mysql.createConnection(dbconnInfo.local);
    },
    dbopen:function(con) {
        con.connect(function(err) {
            if(err) {
                console.log('error: ', err);
            } else {
                console.log('mysql connection successfully.');
            }
        })
    }
};

module.exports = dbconnection;