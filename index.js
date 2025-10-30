const express = require('express');
const axios = require('axios');
const qs = require('querystring');
require('dotenv').config();

const app = express();
const port = 3000;
const cors = require('cors');

app.use(cors());
app.use(express.json()); // para leer req.body

app.post('/auth/callback', async (req, res) => {
  const { code, code_verifier } = req.body;

  try {
    const response = await axios.post(
      'https://api.twitter.com/2/oauth2/token',
      qs.stringify({
        code,
        grant_type: 'authorization_code',
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: process.env.REDIRECT_URI,
        code_verifier
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const accessToken = response.data.access_token;

    const userResponse = await axios.get('https://api.twitter.com/2/users/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    res.json(userResponse.data.data); // Twitter responde con { data: { ... } }
  } catch (error) {
    console.error('Error en Twitter:', error.response?.data || error.message);
res.status(500).json({ error: error.response?.data || error.message });

  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
