const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;

    if (url === '/') {
        global.users = ['Admin', 'Aaron', 'Test User'];
        res.write('<html>');
        res.write('<header><h1>Welcome! Enter Your Name</h1></header>');
        res.write('<body><form action="/create-user" method="POST"><input type="text" name="user"><button type="submit">Add New User</button></form></body>');
        res.write('</html>');
        return res.end();
    }
    if (url === '/users') {
        res.write('<html>');
        res.write('<header><h1>Users</h1></header>');
        res.write('<ul>');
        for (let i = 0; i < users.length; i++) {
            res.write('<li>');
            res.write(users[i]);
            res.write('</li>');
        }
        res.write('</ul>');
        res.write('</html>');
        return res.end();
    }
    if (url === '/create-user' && method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        });
        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const newUser = parsedBody.split('=')[1];
            users.push(newUser);
            console.log(users);
            res.statusCode = 302;
            res.setHeader('Location', '/users');
            return res.end();
        });
    }
}

exports.handler = requestHandler;