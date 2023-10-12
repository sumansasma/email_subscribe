const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;
const subscribers = [];

// Configure your email service
const transporter = nodemailer.createTransport({
  service: 'gmail.com',
  auth: {
    user: 'sijgeriaucssangha@gmail.com',
    pass: 'cukc drra ypkd viay',
  },
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Serve the HTML page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle form submission
app.post('/subscribe', (req, res) => {
  const email = req.body.email;

  if (!subscribers.includes(email)) {
    subscribers.push(email);
  }
  
  const confirmationMailOptions = {
    from: 'sijgeriaucssangha@gmail.com',
    to: email,
    subject: 'Subscription Confirmation',
    text: 'You have successfully subscribed to our page. You will receive email notifications for updates.',
  };

  transporter.sendMail(confirmationMailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error sending email.');
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send('Subscription successful. You will receive email notifications.');
    }
  });
});

// Handle event creation
app.post('/create-event', (req, res) => {
  const eventDetails = req.body;

  // Save the event to your database or storage mechanism

  // Send event notifications to all subscribers
  sendEventNotifications(eventDetails);

  res.status(200).send('Event created and notifications sent.');
});

// Handle both GET and POST requests for /notify-event
app.all('/notify-event', (req, res) => {
  if (req.method === 'POST') {
    // Handle POST request to trigger event notifications
    const eventDetails = req.body;

    // Send event notifications to all subscribers
    sendEventNotifications(eventDetails);

    res.status(200).send('Event notifications sent.');
  } else {
    // Handle GET request if needed
    res.status(200).send('GET request received. This route is for POST requests.');
  }
});

// Function to send event notifications to all subscribers
function sendEventNotifications(eventDetails) {
  subscribers.forEach((subscriber) => {
    const eventMailOptions = {
      from: 'sijgeriaucssangha@gmail.com',
      to: subscriber,
      subject: 'New Event Notification',
      text: `A new event has been created: ${eventDetails.title}\nDate: ${eventDetails.date}\nDescription: ${eventDetails.description}`,
    };

    transporter.sendMail(eventMailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Event notification email sent: ' + info.response);
      }
    });
  }
}


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
