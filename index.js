const express = require('express');
const app = express();
const port = 3000;
const { numberOfDestinations, topFiveDestinations, whenBookingsAreMade } = require('./holiday-analysis');

// Route handler for the first route
app.get('/route1', (req, res) => {
  res.send('Hello from Route 1!');
});

app.get('/numberOfDestinations', async (req, res) => {
  const destinationCount = await numberOfDestinations();
  res.json(destinationCount);
});

app.get('/topFiveDestinations', async (req, res) => {
  const topFive = await topFiveDestinations();
  res.json(topFive);
});

app.get('/whenBookingsAreMade', async (req, res) => {
  const bookings = await whenBookingsAreMade();
  res.json(bookings);
});

app.use((req, res) => {
  res.status(404).send('Not found');
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
