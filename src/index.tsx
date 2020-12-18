import React from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider } from 'styled-components'
import Home from './components/spotify'
import theme from './styles/theme'
import GlobalStyle from './styles/global'

const musicInfo = {
  albumCover:
    'https://i.scdn.co/image/ab67616d0000b273c31e9cab40d0210bca9a44e3',
  musicName:
    'At Wit&#x27;s End - From &quot;Pirates of the Caribbean: At World&#x27;s End&quot;/Score',
  artists: 'Fabio Brazza'
}

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <React.StrictMode>
      <Home
        albumCover={musicInfo.albumCover}
        artists={musicInfo.artists}
        musicName={musicInfo.musicName}
      />
    </React.StrictMode>
    <GlobalStyle />
  </ThemeProvider>,
  document.getElementById('root')
)
