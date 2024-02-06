const express = require('express');
const bodyParser = require('body-parser');
const shortid = require('shortid');
const { URL } = require("../db");
const { authMiddleware } = require("../middleware")

const app = express();
const PORT = 3001;

app.use(bodyParser.json());

app.use(authMiddleware);

const urlDatabase = {};

app.post('/shorten', async (req, res) => {
  try {
    const { longUrl } = req.body;

    if (!longUrl) {
      return res.status(400).json({ error: 'Long URL is required' });
    }

    const prev = await URL.find({
      longurl: longUrl,
      userId: req.user.userId
    })

    if(prev.length != 0) {
      res.json({ shortUrl: prev[0].shorturl });
    }

    const shortId = shortid.generate();

    urlDatabase[shortId] = longUrl;

    const shortUrl = `http://localhost:${PORT}/${shortId}`;

    const object = {
      longurl: longUrl,
      shorturl:  shortUrl,
      shortID: shortId,
      numberOfClicks: 0,
      userId: req.user.userId
    }

    const user = await URL.create(object)

    res.json({ shortUrl });
  }

  catch(error) {
    res.status(500).json({
      error: "Internal Server Error"
    })
  }
});

app.get('/:shortId', async (req, res) => {
  try {
    const { shortId } = req.params;
    const longUrl = urlDatabase[shortId];
  
    if (!longUrl) {
      return res.status(404).json({ error: 'Short URL not found' });
    }
  
    const url = await URL.findOne({shortID: shortId, userId: req.body.userId})
    
    await URL.findOneAndUpdate(
      {shortID: shortId}, {numberOfClicks: url.numberOfClicks + 1}
    )
  
    res.redirect(longUrl);
  }
  catch(error) {
    res.status(500).json({error: 'Internal Server Error'})
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
