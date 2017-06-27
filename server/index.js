var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var path = require('path');
var clientPath = path.join(__dirname, '../client');

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'chirperAdmin',
    password: 'password',
    database: 'Chirper'
});

var app = express();
app.use(express.static(clientPath));
app.use(bodyParser.json());
// Use express.static to serve the client folder
//most specific routes on top and least specific on bottom

app.get('/chirps/*/update', function(req, res) {
    res.sendFile(path.join(clientPath, 'single_update.html'));
});

app.get('/chirps', function(req, res) {
    res.sendFile(path.join(clientPath, 'list.html'));
});

app.get('/chirps/*', function(req, res) {
    res.sendFile(path.join(clientPath, '/single_view.html'));
})

app.route('/api/chirps')
    .get(function(req, res) {
        rows('getChirps')
        .then(function(chirps) {
            res.send(chirps);
        }).catch(function(err) {
            res.sendStatus(500);
        });
    }).post(function(req, res) {
        var newChirp = req.body;
        row('newChirp', [newChirp.userId, newChirp.message])
        .then(function(id) {
            res.sendStatus(201).send(id);
        }).catch(function(err) {
            console.log(err);
            res.sendStatus(500);
        });
    });
app.route('/api/chirps/:id')
    .get(function(req, res) {
        row('getChirp', [req.params.id])
        .then(function(chirp) {
            res.send(chirp);
        }).catch(function(err) {
            console.log(err);
            res.sendStatus(500);
        });
    }).put(function(req, res) {
        empty('updateChirp', [req.params.id, req.body.message])
        .then(function(chirp) {
            res.send(chirp);
        }).catch(function(err) {
            console.log(err);
            res.sendStatus(500);
        });
    }).delete(function(req, res) {
        empty('deleteChirp', [req.params.id])
        .then(function() {
            res.sendStatus(204);
        }).catch(function(err) {
            console.log(err);
            res.sendStatus(500);
        });
    });

    app.get('/api/users', function(req, res) {
        rows('GetUsers')
        .then(function(users) {
            res.send(users);
        }).catch(function(err) {
            console.log(err);
            res.sendStatus(500);
        });
    });

app.listen(3000);

function callProcedure(procedureName, args) {
    return new Promise(function(resolve, reject) {
        pool.getConnection(function(err, connection) {
            if (err) {
                reject(err);
            } else {
                var placeHolders = '';
                if(args && args.length > 0) {
                    for (var i = 0; i < args.length;i++) {
                        if (i=== args.length -1) {
                            placeHolders += '?';
                        } else {
                            placeHolders += '?,'
                        }
                    }
                }
                var callString = 'CALL ' + procedureName + '(' + placeHolders + ');';
                connection.query(callString, args, function(err, resultSets) {
                    connection.release();
                    if (err) {
                        reject(err);
                    } else {
                        resolve(resultSets);
                    }
                });
            }
        })
    })
};

function rows(procedureName, args) {
    return callProcedure(procedureName, args)
        .then(function(resultSets) {
            return resultSets[0];
        });
}

function row(procedureName, args) {
    return callProcedure(procedureName, args)
        .then(function(resultSets) {
            return resultSets[0][0];
        });
}

function empty(procedureName, args) {
    return callProcedure(procedureName, args)
        .then(function() {
            return;
        });
}
// requesting data = get
// creating data = post
// deleting data = delete
// updating data = put