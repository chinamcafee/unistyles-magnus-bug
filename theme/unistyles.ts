import { breakpoints } from './breakpoints'
import { pinkTheme, blueTheme } from './themes'
import { StyleSheet } from 'react-native-unistyles'

type AppBreakpoints = typeof breakpoints
type AppThemes = {
  pinkTheme: typeof pinkTheme,
  blueTheme: typeof blueTheme
}

declare module 'react-native-unistyles' {
  export interface UnistylesBreakpoints extends AppBreakpoints {}
  export interface UnistylesThemes extends AppThemes {}
}

StyleSheet.configure({
  themes: {
    pinkTheme: pinkTheme,
    blueTheme: blueTheme,
  },
  breakpoints,
  settings: {
      initialTheme: "pinkTheme"
  }
})

