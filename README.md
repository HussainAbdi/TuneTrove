TuneTrove is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) but using a dedicated Node.js server and Express.js to handle routing and requests. It's created to match and mimic the Spotify UI (thanks to the folks at [newline.co](https://www.newline.co/)) and shows you your Spotify "profile" but with some twists!

You can see your Top Artists and Top Tracks from the last month, 6 months, all time - and ✨ create playlists ✨ around this data. You can also see your public playlists and sort them based on some of Spotify's track properties (danceability, tempo, energy). More features to come soon!

TuneTrove is deployed using Heroku at [hussainabdi.com](https://www.hussainabdi.com). Currently, due to Spotify API limitations only those with early access can use it. I'm working on getting it approved for public use but in the meanwhile you can request early access [here](mailto:hussain.abdi@uwaterloo.ca).

## Getting Started locally
You will need a Spotify _Client ID_ and _Client Secret_ which you can get by creating your own Spotify app following the instructions [here](https://developer.spotify.com/documentation/web-api/tutorials/getting-started#create-an-app). While following these instructions, set your _Redirect URI_ to ```http://localhost:8888/callback```.

Create a ```.env.local.``` file at the root directory of this project and add your _Client ID_ and _Client Secret_ to it following ```.env.local.example```. All that's left is to run the app!

First, run the node server:

```bash
npm run start-server-dev
# or
yarn start-server-dev
```

Next, run next (no pun intended):
```bash
npm run start-dev
# or
yarn start-dev
```

Open [http://localhost:8888](http://localhost:8888) with your browser to see the result! You can now ✨ _v i s u a l i z e_ ✨ your music listening and listen to the songs you enjoy by creating playlists. If you want to allow your friends to check it out, you will need to add the email they use to log into Spotify under your Spotify app's dashboard (User Management). Happy creating!
