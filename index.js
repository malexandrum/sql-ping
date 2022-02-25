const { Connection, Request } = require('tedious');

module.exports.ping = function ({ server, database, user, password, encrypt = true, reqTimeoutMillis = 10000, connectTimeoutMillis = 10000, authenticationType = 'default', trustServerCertificate = true, query }, callback) {
    const errors = [];
    if (!server) {
        errors.push('server is required');
    }
    if (!database) {
        errors.push('database is required');
    }
    if (!user) {
        errors.push('user is required');
    }
    if (!password) {
        errors.push('password is required');
    }
    if (errors.length > 0) {
        throw (errors.join('\n'));
    }

    const config = {
        server,
        authentication: {
            type: authenticationType,
            options: {
                userName: user,
                password
            }
        },
        options: {
            encrypt,
            database,
            requestTimeout: reqTimeoutMillis,
            connectTimeout: connectTimeoutMillis,
            trustServerCertificate,
            rowCollectionOnRequestCompletion: true
        }
    };

    let start = (new Date()).getTime();
    const conn = new Connection(config);

    conn.on('connect', function (err) {

        const duration = (new Date()).getTime() - start;
        if (err) {
            conn.close();
            callback(err, null, duration);
            return
        }
        if (query) {
            const r = new Request(query, function (err, _, rows) {
                const duration = (new Date()).getTime() - start;
                conn.close();
                callback(err, rows, duration)
            });
            r.setTimeout(reqTimeoutMillis);            
            conn.execSql(r)
        } else {
            conn.close();
            callback(err, undefined, duration);
        }
    });

    conn.connect();
}

module.exports.pingAsync = async function ({ server, database, user, password, encrypt, reqTimeoutMillis, connectTimeoutMillis, authenticationType, trustServerCertificate, query }) {
    return new Promise((resolve, reject) => {
        module.exports.ping({ server, database, user, password, encrypt, reqTimeoutMillis, connectTimeoutMillis, authenticationType, trustServerCertificate, query }, function (err, rows, duration) {
            if (err) {
                reject({err, duration});
            } else {
                resolve({rows, duration});
            }
        });
    });
}