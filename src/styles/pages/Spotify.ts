import styled from 'styled-components'
import theme from '../theme'

export const genRandomBar = (): string => {
  let barArray = ''
  for (let i = 0; i <= theme.bars.amount; i++) {
    barArray += `
      &:nth-child(${i}) {
        animation-duration: ${Math.floor(
          Math.floor(Math.random() * 1350) + 1000
        )}ms;
      }
    `
  }

  return barArray
}

export const ContainerMain = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: ${props => props.theme.fontFamily};

  img {
    margin: ${props => props.theme.albumCover.margin};
    box-shadow: ${props => props.theme.albumCover.boxShadow};
    width: ${props => props.theme.albumCover.width};
    border-radius: ${props => props.theme.albumCover.borderRadius};
  }
`
export const Content = styled.div`
  overflow: hidden;

  .song {
    color: ${props => props.theme.song.fontColor};
    margin: ${props => props.theme.song.margin};
    font-size: ${props => props.theme.song.fontSize};
    width: ${props => props.theme.song.width};

    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .artist {
    color: ${props => props.theme.artist.fontColor};
    font-size: ${props => props.theme.artist.fontSize};
    margin: ${props => props.theme.artist.margin};

    text-align: center;
  }

  .bars {
    height: ${props => props.theme.bars.container.height};

    display: flex;
    justify-content: center;
    align-items: center;

    .bar {
      width: ${props => props.theme.bars.width};
      height: ${props => props.theme.bars.height};

      background: ${props => props.theme.bars.color.primary};
      animation: sound 0ms -400ms linear infinite alternate;
      margin: ${props => props.theme.bars.margin};

      ${genRandomBar()}

      @keyframes sound {
        0% {
          height: 3px;
          opacity: 0.35;
        }
        100% {
          height: 20px;
          opacity: 0.95;
        }
      }
    }
  }
`
