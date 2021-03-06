import { NowRequest, NowResponse } from '@vercel/node'
import { request, get } from 'https'
import { stringify } from 'querystring'
import { renderToString } from 'react-dom/server'
import { ServerStyleSheet } from 'styled-components'

import Home from '../src/components/spotify'
import theme from '../src/styles/theme'

export interface MusicInfo {
  musicName: string
  artists: string
  albumCover: string
}

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
  return currentlyPlaying().then(musicInfo => {
    const sheet = new ServerStyleSheet()
    try {
      const html = renderToString(sheet.collectStyles(Home(musicInfo)))
      const styles = sheet.getStyleTags()

      res.setHeader('Content-Type', 'image/svg+xml')

      res.status(200).send(`
        <svg 
          width="${theme.dimension.width}" 
          height="${theme.dimension.height}" 
          style="background:${theme.svg.background}"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink">
          
          <foreignObject width="${theme.dimension.width}" height="${theme.dimension.height}" style="background:${theme.svg.background}">
            <div xmlns="http://www.w3.org/1999/xhtml">
              ${styles}
              ${html}
            </div>
          </foreignObject>
        </svg>
      `)
    } catch (e) {
      console.log(e)
    } finally {
      sheet.seal()
    }
  })
}

const genAuthToken = async () => {
  return new Promise((resolve, reject) => {
    const authToken = Buffer.from(
      `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_SECRET_ID}`
    ).toString('base64')

    const options = {
      hostname: 'accounts.spotify.com',
      port: 443,
      path: '/api/token',
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + authToken,
        'content-type': 'application/x-www-form-urlencoded'
      }
    }

    const req = request(options, res => {
      console.log('authentication status code:', res.statusCode)

      let chunk = ''
      res.on('data', d => {
        chunk += d
      })

      res.on('end', () => {
        // eslint-disable-next-line camelcase
        const { access_token } = JSON.parse(chunk)
        resolve(access_token)
      })
    })

    req.on('error', e => {
      reject(e)
    })

    req.write(
      stringify({
        grant_type: 'refresh_token',
        refresh_token: process.env.SPOTIFY_REFRESH_TOKEN
      })
    )

    req.end()
  })
}

const currentlyPlaying = (): Promise<MusicInfo> => {
  return new Promise<MusicInfo>((resolve, reject) => {
    genAuthToken().then(token => {
      const req = get(
        'https://api.spotify.com/v1/me/player/currently-playing',
        {
          headers: {
            Authorization: 'Bearer ' + token,
            'content-type': 'application/x-www-form-urlencoded'
          }
        },
        async res => {
          console.log('currently-playing status code:', res.statusCode)

          let chunk = ''
          res.on('data', d => {
            chunk += d
          })

          res.on('end', async () => {
            if (res.statusCode !== 200) {
              resolve({
                musicName: '',
                artists: '',
                albumCover: await getPlaceHolderImage()
              })

              return
            }

            const data = JSON.parse(chunk)

            const arts = data.item.album.artists
              .map((val: { name: string }) => val.name)
              .reduce((acc: string, val: string) => (acc += ', ' + val))

            console.log('music fetch:', data.item.name)

            const musicInfo = {
              musicName: data.item.name,
              artists: arts,
              albumCover: await getAlbumCover(data.item.album.images[0].url)
            }

            resolve(musicInfo)
          })
        }
      )

      req.on('error', e => {
        reject(e)
      })

      req.end()
    })
  })
}

const getPlaceHolderImage = async () => {
  return new Promise<string>(resolve => {
    const req = get(theme.placeHolder.albumCover, res => {
      res.setEncoding('base64')
      if (res.statusCode !== 200) {
        resolve(null)
      }

      let chunk = ''
      res.on('data', d => {
        chunk += d
      })

      res.on('end', () => {
        resolve('data:' + res.headers['content-type'] + ';base64,' + chunk)
      })
    })

    req.end()
  })
}

const getAlbumCover = async (url: string) => {
  return new Promise<string>(resolve => {
    const req = get(url, res => {
      res.setEncoding('base64')
      if (res.statusCode !== 200) {
        resolve(null)
      }

      let chunk = ''
      res.on('data', d => {
        chunk += d
      })

      res.on('end', () => {
        resolve('data:' + res.headers['content-type'] + ';base64,' + chunk)
      })
    })

    req.end()
  })
}
