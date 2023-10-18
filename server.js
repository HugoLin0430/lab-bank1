

const express = require('express');
const exphbs  = require('express-handlebars');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Users Data
const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'user.json'), 'utf8'));

// Middleware
app.engine('.handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock Session Data
let loggedInUser = null;

app.get('/', (req, res) => res.render('login', { error: '' }));

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    if(!users[username]) {
        return res.render('login', { error: 'Not a registered username' });
    }
    
    if(users[username] !== password) {
        return res.render('login', { error: 'Invalid password' });
    }

    loggedInUser = username;
    res.redirect('/banking');
});

app.get('/banking', (req, res) => {
    if (!loggedInUser) {
        return res.redirect('/');
    }

    res.render('banking', { username: loggedInUser });
});

app.post('/banking', (req, res) => {
    if (!loggedInUser) {
        return res.redirect('/');
    }

    const { accountNumber, action } = req.body;

    if (action === 'balance') {
        res.render('message', { 
            message: 'Displaying balance for account ' + accountNumber, 
            redirectUrl: '/banking' 
        });
    } else if (action === 'deposit') {
        res.render('message', { 
            message: 'Processing deposit for account ' + accountNumber, 
            redirectUrl: '/banking' 
        });
    } else {
        res.redirect('/banking');
    }
});

app.get('/logout', (req, res) => {
    loggedInUser = null;
    res.redirect('/');
});

app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));