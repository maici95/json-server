



const server = require('./lib/server');
const axios = require('axios');


const s = server;

s.jsonFilePath = '../';
s.ini(['users', 'test', 'abc']);

s.app.listen(3000);



// testing
axios.get('http://localhost:3000/test')
    .then(res => {
        if (res.data.length > 5) {
            axios.delete('http://localhost:3000/test');
        }
    });

const object = {
    username: 'yo boi'
}

axios.post('http://localhost:3000/test', object)
    .then(res => {

    });
/* 
axios.delete('http://localhost:3000/test/3')
    .then(res => {
        console.log(res.data);
    }); */

const uObject = {
    username: 'hgaha',
    test: 'wef'
}

axios.patch('http://localhost:3000/test/2', uObject)
    .then(res => {
        console.log(res.data);
    });


