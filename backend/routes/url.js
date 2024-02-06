const express = require('express');
const bodyParser = require('body-parser');
const shortid = require('shortid');
const { URL } = require("../db");

const app = express();
const PORT = 3001;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// In-memory database to store shortened URLs
const urlDatabase = {};

// API endpoint to shorten a URL
app.post('/shorten', async (req, res) => {
    const { longUrl } = req.body;


  if (!longUrl) {
    return res.status(400).json({ error: 'Long URL is required' });
  }

  const prev = await URL.find({
    longurl: longUrl
  })

  if(prev.length != 0) {
    res.json({ shortUrl: prev[0].shorturl });
  }

  // Generate a short ID
  const shortId = shortid.generate();

  // Save the mapping in the database
  urlDatabase[shortId] = longUrl;

  // Construct the shortened URL
  const shortUrl = `http://localhost:${PORT}/${shortId}`;

  const object = {
    longurl: longUrl,
    shorturl:  shortUrl,
    shortID: shortId,
    numberOfClicks: 0
  }

  const user = await URL.create(object)

  res.json({ shortUrl });
});

// Redirect to the original URL when a short URL is accessed
app.get('/:shortId', async (req, res) => {
  const { shortId } = req.params;
  const longUrl = urlDatabase[shortId];

  if (!longUrl) {
    return res.status(404).json({ error: 'Short URL not found' });
  }

  const url = await URL.findOne({shortID: shortId})
  
  await URL.findOneAndUpdate(
    {shortID: shortId}, {numberOfClicks: url.numberOfClicks + 1}
  )

  res.redirect(longUrl);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
