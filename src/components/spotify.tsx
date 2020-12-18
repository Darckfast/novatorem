import React from 'react'
import { ThemeProvider } from 'styled-components'
import { Content, ContainerMain } from '../styles/pages/Spotify'
import theme from '../styles/theme'

interface Props {
  albumCover: string
  musicName: string
  artists: string
}

const Home: React.FC<Props> = ({ albumCover, musicName, artists }) => {
  const Bars = () => {
    const bars = []
    for (let i = 0; i < theme.bars.amount; i++) {
      bars.push(
        <div key={i} className={musicName ? 'bar' : 'bar-no-animation'}></div>
      )
    }

    return bars
  }

  return (
    <ThemeProvider theme={theme}>
      <ContainerMain>
        <a>
          <img src={albumCover} />
        </a>
        <Content>
          <div className="song">{musicName || 'No music playing now'}</div>
          <div className="artist">{artists || 'None'}</div>
          <div className="bars">{Bars()}</div>
        </Content>
      </ContainerMain>
    </ThemeProvider>
  )
}

export default Home
