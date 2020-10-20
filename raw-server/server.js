const http = require('http');
const fs = require('fs');
const { userInfo } = require('os');

const users = [];

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;

    if (url === '/') {
        return renderForm(res);
    }

    if (url === '/users') {
        return renderUsers(res);
    }

    if (url === '/create-user' && method === 'POST') {
        createUser (req, res)
    }
});



const createUser = ((req, res) => {
    const body = [];
    
    req.on('data', chunk => {
        body.push(chunk);
    });

    req.on('end', () => {
        const parsedBody = Buffer.concat(body).toString();
        const user = parsedBody.split('=')[1];
        
        users.push(user);

        res.statusCode = 302;
        res.setHeader('Location', '/users');
        return res.end();
    });
});

const renderUsers = ((res) => {
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>Registered users</title></head>');
    res.write('<body><ul>');

    users.forEach(function(item, index) {
        console.log(item, index)
        res.write('<li>' + item + '</li>');
      })

    res.write('</ul></body>');
    res.write('</html>');
    return res.end();
});

const renderForm = ((res) => {
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>Assignment 1</title></head>');
    res.write(
        '<body><form action="/create-user" method="POST"><input type="text" name="username"><button type="submit">Create user</button></form></body>'
    );
    res.write('</html>');
    return res.end();
});


server.listen(3000);