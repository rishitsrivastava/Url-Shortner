const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const shortid = require('shortid');
const { URL } = require("../db");
const { authMiddleware } = require("../middleware")

const app = express();
const PORT = 3001;
app.use(cors());

app.use(bodyParser.json());

app.use(authMiddleware);

const urlDatabase = {};

app.post('/shorten', async (req, res) => {
  try {
    const { longurl } = req.body;

    if (!longurl) {
      return res.status(400).json({ error: 'Long URL is required' });
    }

    const prev = await URL.find({
      longurl: longurl,
      userId: req.user.userId
    })

    if(prev.length !== 0) {
      return res.json({ shorturl: prev[0].shorturl });
    }

    const shortId = shortid.generate();

    urlDatabase[shortId] = longurl;

    const shorturl = `http://localhost:${PORT}/${shortId}`;

    const object = {
      longurl: longurl,
      shorturl:  shorturl,
      shortID: shortId,
      numberOfClicks: 0,
      userId: req.user.userId
    }

    const user = await URL.create(object)

    res.json({ shorturl });
  }

  catch(error) {
    console.log(error)
    res.status(500).json({
      error: "Internal Server Error"
    })
  }
});


app.get('/redirect', async (req, res) => {
  try {
    const { shortUrl } = req.query;

    const url = await URL.findOne({ shorturl: shortUrl });

    if (!url) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    url.numberOfClicks++;
    await url.save();

    res.redirect(url.longurl);
  } catch (error) {
    console.error("Error while redirecting:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
