import React from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider } from 'styled-components'
import Home from './components/spotify'
import theme from './styles/theme'
import GlobalStyle from './styles/global'

const musicInfo = {
  albumCover: theme.placeHolder.albumCover,
  musicName: '',
  artists: ''
}

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <React.StrictMode>
      <svg
        width={theme.dimension.width}
        height={theme.dimension.height}
        style={theme.svg}
      >
        <foreignObject
          width={theme.dimension.width}
          height={theme.dimension.height}
          style={theme.svg}
        >
          <Home albumCover={musicInfo.albumCover} artists={''} musicName={''} />
        </foreignObject>
      </svg>
    </React.StrictMode>
    <GlobalStyle />
  </ThemeProvider>,
  document.getElementById('root')
)
