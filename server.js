const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 3000;

// Your list of subscribers
const subscribers = [];

// Configure your email service
const transporter = nodemailer.createTransport({
  service: 'gmail.com', // Replace with your email service (e.g., Gmail)
  auth: {
    user: 'sijgeriaucssangha@gmail.com', // Replace with your email address
    pass: 'cukc drra ypkd viay', // Replace with your email password
  },
  debug: true,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Handle new subscriptions
app.post('/subscribe', (req, res) => {
  const { email } = req.body;

  if (email) {
    // Check if the email is not already subscribed
    if (!subscribers.includes(email)) {
      subscribers.push(email); // Add the new subscriber's email to the list
    }

    res.sendStatus(200); // Send a response indicating success
  } else {
    res.sendStatus(400); // Send a response indicating a bad request (missing email)
  }
});

// Handle event notifications
app.post('/notify-event', (req, res) => {
  const eventDetails = req.body;

  // Send notifications to subscribers
  subscribers.forEach((subscriber) => {
    const eventMailOptions = {
      from: 'sijgeriaucssangha@gmail.com', // Replace with your email address
      to: subscriber,
      subject: 'New Event Notification',
      text: `A new event has been created: ${eventDetails.title}\nDate: ${eventDetails.date}\nDescription: ${eventDetails.description}`,
    };

    transporter.sendMail(eventMailOptions, (error, info) => {
      if (error) {
         console.error("Error sending email:", error);
      } else {
        console.log('Event notification email sent: ' + info.response);
      }
    });
  });

  res.sendStatus(200); // Send a response indicating success
});

app.get('/subscribers', (req, res) => {
  res.json(subscribers); // Return the list of subscribers as JSON
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
