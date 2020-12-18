import { NowRequest, NowResponse } from '@vercel/node'
import { request } from 'https'
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

export default async (req: NowRequest, res: NowResponse): Promise<any> => {
  return currentlyPlaying().then(musicInfo => {
    const sheet = new ServerStyleSheet()
    try {
      const html = renderToString(sheet.collectStyles(Home(musicInfo)))
      const styles = sheet.getStyleTags()

      res.setHeader('Content-Type', 'image/svg+xml')
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate')

      res.status(200).send(`
        <svg 
          width="${theme.dimension.width}" 
          height="${theme.dimension.height}" 
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink">
          
          <foreignObject width="${theme.dimension.width}" height="${theme.dimension.height}">
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
      console.log('statusCode:', res.statusCode)

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
      const options = {
        hostname: 'api.spotify.com',
        port: 443,
        path: '/v1/me/player/currently-playing',
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
          'content-type': 'application/x-www-form-urlencoded'
        }
      }

      const req = request(options, async res => {
        console.log(res.statusCode)

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
          console.log(data.item.name, arts, data.item.album.images[0].url)

          const musicInfo = {
            musicName: data.item.name,
            artists: arts,
            albumCover: await getAlbumCover(data.item.album.images[0].url)
          }

          resolve(musicInfo)
        })
      })

      req.on('error', e => {
        reject(e)
      })

      req.end()
    })
  })
}

const getPlaceHolderImage = async () => {
  return new Promise<string>(resolve => {
    const options = {
      hostname: 'i.imgur.com',
      port: 443,
      path: '/FAMtjqN.png',
      method: 'GET'
    }

    const req = request(options, res => {
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
    const imageId = url.split('/')[4]

    const options = {
      hostname: 'i.scdn.co',
      port: 443,
      path: `/image/${imageId}`,
      method: 'GET'
    }

    const req = request(options, res => {
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
