import React from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider } from 'styled-components'
import Home from './components/spotify'
import theme from './styles/theme'
import GlobalStyle from './styles/global'

const musicInfo = {
  albumCover: 'https://i.imgur.com/FAMtjqN.png',
  musicName: '',
  artists: ''
}

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <React.StrictMode>
      <Home albumCover={musicInfo.albumCover} artists={''} musicName={''} />
    </React.StrictMode>
    <GlobalStyle />
  </ThemeProvider>,
  document.getElementById('root')
)
