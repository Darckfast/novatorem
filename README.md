![Spotify](https://novatorem.darckfast.vercel.app/api/spotify) 

# Set Up Guide

## Spotify

* Create a [Spotify Application](https://developer.spotify.com/dashboard/applications)
* Take note of:
    * `Client ID`
    * `Client Secret`
* Click on **Edit Settings**
* In **Redirect URIs**:
    * Add `http://localhost/callback/`

## Refresh Token

* Navigate to the following URL:

```
https://accounts.spotify.com/authorize?client_id={SPOTIFY_CLIENT_ID}&response_type=code&scope=user-read-currently-playing,user-read-recently-played&redirect_uri=http://localhost/callback/
```

* After logging in, save the {CODE} portion of: `http://localhost/callback/?code={CODE}`

* Create a string combining `{SPOTIFY_CLIENT_ID}:{SPOTIFY_CLIENT_SECRET}` (e.g. `5n7o4v5a3t7o5r2e3m1:5a8n7d3r4e2w5n8o2v3a7c5`) and **encode** into [Base64](https://base64.io/).

* Then run a [curl command](https://httpie.org/run) in the form of:
```sh
curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -H "Authorization: Basic {BASE64}" -d "grant_type=authorization_code&redirect_uri=http://localhost/callback/&code={CODE}" https://accounts.spotify.com/api/token
```

* Save the Refresh token

## Vercel

* Register on [Vercel](https://vercel.com/)

* Fork this repo, then create a vercel project linked to it

* Add secret environment variables:
    * `https://vercel.com/<YourName>/<ProjectName>/settings/environment-variables`
        * `SPOTIFY_REFRESH_TOKEN`
        * `SPOTIFY_CLIENT_ID`
        * `SPOTIFY_SECRET_ID`

* Deploy!

## ReadMe

You can now use the following in your readme:

```[![Spotify](https://USER_NAME.vercel.app/api/spotify)](https://open.spotify.com/user/USER_NAME)```

## Customization

This fork uses [styled components](https://styled-components.com/) to create the Html/Css component. All customization available on file `src/styles/theme.ts`.

```js
const theme = {
  colors: {
    background: '#121214',
    backgroundLight: '#2a2a2f',
    text: '#e1e1e6',
    primary: '#8257e6',
    secondary: '#0ec63c'
  },
  bars: {
    amount: 60,
    margin: '0.5px',
    color: {
      primary: '#8257e6'
    },
    width: '4px',
    height: '3px',
    container: {
      height: '30px',
      width: '40px'
    }
  },
  artist: {
    fontSize: '20px',
    fontColor: '#e1e1e6',
    margin: '5px 0 0 0'
  },
  song: {
    width: '13em',
    fontSize: '24px',
    fontColor: '#808080',
    margin: '0.7em 0 0.7em 0'
  },
  albumCover: {
    margin: '1em',
    width: '128px',
    borderRadius: '4px',
    boxShadow: '4px 4px #8257e6;'
  },
  dimension: {
    width: '480',
    height: '164'
  },
  fontFamily: 'Roboto, sans-serif',
  placeHolder: {
    albumCover: 'https://i.imgur.com/FAMtjqN.png',
    musicName: 'No music playing now',
    artists: 'None'
  }
}

export default theme
```

## Developing 

### Requirements
* To run this app locally, you will need the [Vercel CLI](https://vercel.com/download)
* [yarn](https://classic.yarnpkg.com/en/) installed

Install all deps
```sh
$ yarn
```

This will make all files inside of `api` as a endpoint 
```sh
$ vercel dev
```

Export locally all the needed keys
```sh
$ export SPOTIFY_CLIENT_ID=c4ca4238a0b... 
$ export SPOTIFY_SECRET_ID=c81e728d9d4... 
$ export SPOTIFY_REFRESH_TOKEN=a0X54-... 
```

Test the main endpoint, it should return a html
```sh
$ curl localhost:3000/api/spotify 
```