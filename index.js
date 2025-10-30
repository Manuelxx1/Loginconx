const express = require('express');
const axios = require('axios');
require('dotenv').config();


const app = express();
const port = 3000;
const cors = require('cors');
app.use(cors());


app.get('/auth/callback', async (req, res) => {
  const { code } = req.query;

  try {
    const response = await axios.post('https://api.twitter.com/2/oauth2/token', null, {
      params: {
        code,
        grant_type: 'authorization_code',
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: process.env.REDIRECT_URI,
        code_verifier: 'challenge123'
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const accessToken = response.data.access_token;

    // Ahora obtenemos el perfil del usuario
    const userResponse = await axios.get('https://api.twitter.com/2/users/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    res.json(userResponse.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.status(500).send('Error en el login con X');
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
