const express = require('express');

const app = express();
const port = 3000;

const { loginUser } = require('../model/mongoDB');
const { addNewUser } = require('../model/mongoDB');
const { deleteExistingUser } = require('../model/mongoDB');
const { getUser } = require('../model/mongoDB');

app.use(express.static('public'));
app.use(express.json()); 


app.get('/customer', async (req, res) => {
    const user = await getUser();
    res.json(user);
});

  

app.delete('/customer/:username', async (req, res) => {
    const username = req.params.username;
    try {
        const result = await deleteExistingUser(username);
        if (result.deletedCount === 0) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.json({ message: 'User deleted successfully!' });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user from the database' });
    }
});


app.post('/customer', async (req, res) => {
    const user = req.body; // Assuming the request body contains the dish data
    try {
        const result = await addNewUser(user);
        res.json({ message: 'user added successfully!', result });
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ error: 'Failed to add user to the database' });
    }
});


app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const loginResult = await loginUser(username, password);
      res.json(loginResult);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  });


app.post('/customer', async (req, res) => {
    const user = req.body; // Assuming the request body contains the user data
    try {
        const result = await addNewUser(user);

        // If the user doesn't have a defined username, send an email
        if (!user.username) {
            const emailContent = `
                Name: ${user.name}
                Password: ${user.password}
                Please add this user to the system.
            `;
            
            const mailOptions = {
                from: 'eladt1010@gmail.com', 
                to: 'eladt1010@gmail.com', 
                subject: 'New User Request',
                text: emailContent
            };
            
            await transporter.sendMail(mailOptions);
        }

        res.json({ message: 'User added successfully!', result });
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ error: 'Failed to add user to the database' });
    }
});



