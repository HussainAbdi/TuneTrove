import 'dotenv/config';
import express from 'express';
import next from 'next';
import axios from 'axios';
import querystring from 'query-string';

import { Buffer } from 'buffer';
import path from 'path';
import { fileURLToPath } from 'url';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.prepare().then(() => {

  const CLIENT_ID = process.env.CLIENT_ID;
  const CLIENT_SECRET = process.env.CLIENT_SECRET;
  const REDIRECT_URI = process.env.REDIRECT_URI;
  const PORT = process.env.PORT || 8888;

  const server = express();

  // Priority serve any static files
  server.use(express.static(path.resolve(__dirname, './client/build')));
  server.use(express.json());

  /**
   * Generates a random string of numbers and letters
   * @param {number} length The length of the string
   * @return {string} The generated string
   */
  const generateRandomString = length => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random()*possible.length));
    }
    return text;
  };

  const stateKey = 'spotify_auth_state';

  server.get('/login', (req, res) => {
    const staticProfile = req.query.static_profile || null;

    if (staticProfile) {
      res.redirect(`/?static_profile=true`);
    } else {
      const state = generateRandomString(16);
      res.cookie(stateKey, state);

      const scope = [
        'user-read-private',
        'user-read-email', 
        'user-top-read',
        'playlist-modify-public',
        'playlist-modify-private'
      ].join(' ');

      const queryParams = querystring.stringify({
        client_id: CLIENT_ID,
        response_type: 'code',
        redirect_uri: REDIRECT_URI,
        state: state,
        scope: scope
      });
      
      res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
    }
  });

  server.get('/callback', (req, res) => {
    const code = req.query.code || null;

    axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: querystring.stringify({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`
      }
    })
      .then(response => {
        if (response.status === 200){

          const {access_token, token_type, refresh_token, expires_in} = response.data;
          
          const queryParams = querystring.stringify({
            access_token,
            refresh_token,
            expires_in
          });
          
          //Redirect to React app and pass along tokens in query params
          res.redirect(`/?${queryParams}`);

        } else {
          res.redirect(`/?${querystring.stringify({
            error: 'invalid_token' 
          })}`);
        }
      })
      .catch(error => {
        res.send(error);
      });
  });

  server.get('/refresh_token', (req, res) => {
    const { refresh_token } = req.query;

    axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`
      }
    })
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        res.send(error);
      });

  });

  server.post('/create_playlist', (req, res) => {
    const { user_id } = req.query;
    const postData = req.body;
    const headers = req.headers;

    axios({
      method: 'post',
      url: `https://api.spotify.com/v1/users/${user_id}/playlists`,
      data: postData,
      headers: {
        'Content-Type': headers['content-type'],
        Authorization: headers.authorization
      }
    })
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        res.send(error);
      });
  });

  server.post('/add_tracks_playlist', (req, res) => {
    const { playlist_id } = req.query;
    const postData = req.body;
    const headers = req.headers;

    axios({
      method: 'post',
      url: `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
      data: postData,
      headers: {
        'Content-Type': headers['content-type'],
        Authorization: headers.authorization
      }
    })
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        res.send(error);
      });
  });

  // All other GET requests not handled before will be handled by next
  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(PORT, () => {
    console.log(`Express app listening at http://localhost:${PORT}`);
  });

});

