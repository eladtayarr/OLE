const express = require('express');

const app = express();
const port = 3000;

const { loginUser } = require('../model/mongoDB');
const { addNewDish } = require('../model/mongoDB');
const { getDish } = require('../model/mongoDB');
const { updateDish } = require('../model/mongoDB');
const { updateAllDish } = require('../model/mongoDB');
const { addNewOpinion } = require('../model/mongoDB');
const { getOpinion } = require('../model/mongoDB');
const { addNewUser } = require('../model/mongoDB');
const { deleteExistingUser } = require('../model/mongoDB');
const { getUser } = require('../model/mongoDB');
const { addNewCoupon } = require('../model/mongoDB');
const { getCoupon } = require('../model/mongoDB');
const { getLastItem } = require('../model/mongoDB');

const nodemailer = require('nodemailer');

app.use(express.static('public'));
app.use(express.json()); 

app.get('/DishesDetails', async (req, res) => {
    const dishes = await getDish();
    res.json(dishes);
});

// This route will handle the POST request to add a new dish
app.post('/DishesDetails', async (req, res) => {
    const dishes = req.body; // Assuming the request body contains the dish data
    try {
        const result = await addNewDish(dishes);
        res.json({ message: 'Dish added successfully!', result });
    } catch (error) {
        console.error('Error adding dish:', error);
        res.status(500).json({ error: 'Failed to add dish to the database' });
    }
});



app.post('/updateDiscount', async (req, res) => {
    const { specific, discount } = req.body;
  
    try {
      const updatedDishs = await updateDish(specific, discount);
      res.json(updatedDishs);
    } catch (error) {
      console.error('Error updating dishes:', error);
      res.status(500).json({ error: 'Failed to update dishes in the database' });
    }
  });


app.put('/updateAllDishs', async (req, res) => {
  const discount = req.body.discount;

  try {
    const updatedDishs = await updateAllDish(discount);
    res.json({ message: 'All dish prices updated successfully!', dishes: updatedDishs });
  } catch (error) {
    console.error('Error updating dish prices:', error);
    res.status(500).json({ error: 'Failed to update dish prices in the database' });
  }
});

app.get('/opinion', async (req, res) => {
    const opinion = await getOpinion();
    res.json(opinion);
});

// This route will handle the POST request to add a new opinion
app.post('/opinion', async (req, res) => {
    const opinion = req.body; 
    try {
        const result = await addNewOpinion(opinion);
        res.json({ message: 'opinion added successfully!', result });
    } catch (error) {
        console.error('Error adding opinion:', error);
        res.status(500).json({ error: 'Failed to add opinion to the database' });
    }
});


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


const transporter = nodemailer.createTransport({
    service: 'Gmail', 
    auth: {
        user: 'eladt1010@gmail.com', 
        pass: 'shebnouqreidnctk' 
    }
});

app.post('/submitFeedback', async (req, res) => {
    const formData = req.body;

    try {
        const emailContent = `
            Name: ${formData.name}
            Email: ${formData.email}
            Feedback: ${formData.feedback}
        `;

        const mailOptions = {
            from: 'eladt1010@gmail.com', 
            to: 'eladt1010@gmail.com', 
            subject: 'New Feedback Received',
            text: emailContent
        };

        await transporter.sendMail(mailOptions);

        console.log('Feedback email sent successfully'); 

        res.json({ message: 'Feedback submitted successfully!' });
    } catch (error) {
        console.error('Error sending feedback email:', error);
        res.status(500).json({ error: 'Failed to send feedback email' });
    }
});


// coupon

app.get('/coupon', async (req, res) => {
    const coupon = await getCoupon();
    res.json(coupon);
});

// This route will handle the POST request to add a new coupon
app.post('/coupon', async (req, res) => {
    const coupon = req.body; // Assuming the request body contains the coupon data
    try {
        const result = await addNewCoupon(coupon);
        res.json({ message: 'coupon added successfully!', result });
    } catch (error) {
        console.error('Error adding coupon:', error);
        res.status(500).json({ error: 'Failed to add coupon to the database' });
    }
});


app.get('/coupon', async (req, res) => {
    try {
      const latestCoupon = await getLastItem(); // Call the getLastItem function
      res.json(latestCoupon);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

