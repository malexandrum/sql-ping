Check connection to SQL servers.

# Installation:
npm install sql-ping

# Usage:

`import { ping } from 'sql-ping'`

OR

`const { ping } = require 'sql-ping'`

## Callback
```
ping({
        server: 'my.sql.server',
        database: 'master',
        user: 'sa',
        password: 'pass'
    },
    function(err, rows) {
        if (err) {
            throw(err);
        } else {
            // do something with rows
        }
    }
);
```

## Async / await
```
(async function () {
    const servers = fs.readFileSync('./integration/servers.txt', 'utf-8').split(/\r?\n/);

    const promises = []

    servers.forEach((s, i) => {
        promises.push(
            pingAsync({
                server: `${s}.domain.suffix`,
                database: 'master',
                user: 'myuser',
                password: 'mypass',
                connectTimeoutMillis: 2000,
                // query: "SELECT TOP 1 * FROM clients;" // if query is not defined, it's only testing connection
            })
        );                                
    })

    Promise.allSettled(promises).then(promisesResult => promisesResult.forEach((r, i) => {
        console.log(servers[i], r.status, r.status === 'fulfilled' ? r.value.duration : r.reason.duration, r.status === 'rejected' && r.reason.err.message)
    }))
})();
```


