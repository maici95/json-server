


// server file

const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const server = createServer();

// create json-server
function createServer() {
    this.app = express();
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({extended: true}));

    /** @type {string} filepath for db json file */
    this.jsonFilePath = './';
    /** @type {function} ini json-server */
    this.ini = ini;

    this.app.all('*', async (req, res, next) => {
        let data = {};
        const params = req.url.split('/');
        data = await JSON.parse(read());
        data2 = data[params[1]]
        const object = req.body;

        // no array for given key
        if (!data2) {
            return res.send({msg: 'not exist'});
        }

        // patch
        if (req.method === 'PATCH') {
            if (!params[2]) {
                for (let item of data2) {
                    updateObject(item, object);
                }
                data[params[1]] = data2;
                write(data);
                return res.send({msg: 'all patched'});
            }

            if (data2) {
                const index = findIndex(data2, params[2]);

                if (index === -1) {
                    return res.send({msg: 'not found'});
                }

                if (index > -1) {
                    updateObject(data2[index], object);
                    data[params[1]] = data2;
                    write(data);
                    return res.send({msg: 'item patched'});
                }
            }
        }

        // delete
        if (req.method === 'DELETE') {
            if (!params[2]) {
                data2 = [];
                data[params[1]] = data2;
                write(data);
                return res.send({msg: 'all removed'});
            }

            if (data2) {
                const index = findIndex(data2, params[2])

                if (index === -1) {
                    return res.send({msg: 'not found'});
                }

                if (index > -1) {
                    data2.splice(index, 1);
                    data2[params[1]] = data2;
                    write(data);
                    return res.send({msg: 'item deleted'});
                }
            }
        }

        // post method
        if (req.method === 'POST') {
            if (data2.length > 0) {
                object.id = (parseInt(data2[data2.length - 1].id) + 1).toString();
            } else {
                object.id = "1";
            }

            data2.push(object);
            data[params[1]] = data2;
            write(data);

            // schemes?
            return res.send({msg: 'good'});
        }

        // get method
        if (req.method === 'GET') {

            // find by id
            if (params[2]) {
                data2 = findById(data2, params[2]);
            }

            // no items in array
            if (data2.length < 1) {
                return res.send({msg: 'not found'});
            }

            // good data
            if (data2) {
                return res.send(data2);
            }
        }


    });

    return this;
}


// find by id
function findById(data, id) {
    const match = data.find(item => item.id === id);
    if (match) {
        return data = match;
    } else {
        return data = [];
    }
}

// update object
function updateObject(obj, obj2) {
    for (let key of Object.keys(obj2)) {
        obj[key] = obj2[key];
    }
}

// find by id -- return index
function findIndex(data, id) {
    return data.findIndex(item => item.id === id);
}

// read file
function read() {
    return fs.readFileSync(jsonFilePath+'db.json', 'utf8', (err, file) => {
        return JSON.parse(file);
    });
}

// write file
function write(data) {
    fs.writeFileSync(jsonFilePath+'/db.json', JSON.stringify(data, null, '\t'), (err, res) => {
        if (err)
            console.log(err);
    });
}

// check if dir contains db.json file -- if not create the file
/**
 * @param {Array<string>} keys keys for arrays 
 */
function ini(keys) {
    const jsonFile = {};

    for (let key of keys) {
        jsonFile[key] = [];
    }

    fs.readdir(jsonFilePath, 'utf8', (err, res) => {
        if (err)
            console.log(err);

        let createFile = true;

        for (let file of res) {
            if (file === 'db.json') {
                createFile = false;
            }
        }

        if (createFile) {
            write(jsonFile);
        }
    });
}


module.exports = server;
