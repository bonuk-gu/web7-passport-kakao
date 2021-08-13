var mysql = require('mysql');

var dbconnInfo = {
    local: {
        host: 'localhost',
        port: '3308',
        user: 'root',
        password: '895252',
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