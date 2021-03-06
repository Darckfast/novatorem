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
    fontColor: '#c9c9c9',
    margin: '5px 0 0 0',
    mixBlendMode: 'difference'
  },
  song: {
    width: '13em',
    fontSize: '24px',
    fontColor: '#9b9b9b',
    margin: '0.7em 0 0.7em 0',
    mixBlendMode: 'difference'
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
  },
  svg: {
    background: 'inherit'
  }
}

export default theme
