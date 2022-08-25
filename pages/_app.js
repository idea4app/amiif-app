import PropTypes from 'prop-types'
import { NextUIProvider, createTheme } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

import '/styles/globals.module.css'

const lightTheme = createTheme({
  type: 'light',
  theme: {
    colors: {
      primaryBg: '#ffffff',
      secondaryBg: '#f7f7f7',
      primaryText: '#382d41',
      lightBorder: '#f1f1f1',
      sidebarBg: '#1457ff',
      sidebarText: '#ffffff',
      sidebarUnreadText: '#ffffff',
      sidebarTextHoverBg: '#4578bf',
      sidebarTextActiveBorder: '#579eff',
      sidebarTextActiveColor: '#ffffff',
      sidebarHeaderBg: '#1153ab',
      sidebarTeamBarBg: '#0b428c',
      sidebarHeaderTextColor: '#ffffff',
      onlineIndicator: '#06d6a0',
      awayIndicator: '#ffbc42',
      dndIndicator: '#f74343',
      mentionBg: '#ffffff',
      mentionBj: '#ffffff',
      mentionColor: '#145dbf',
      centerChannelBg: '#ffffff',
      centerChannelColor: '#3d3c40',
      newMessageSeparator: '#ff8800',
      linkColor: '#2389d7',
      buttonBg: '#166de0',
      buttonColor: '#ffffff',
      errorTextColor: '#fd5960',
      mentionHighlightBg: '#ffe577',
      mentionHighlightLink: '#166de0',
    },
  },
})

const darkTheme = createTheme({
  type: 'dark',
  theme: {
    colors: {
      primaryBg: '#111219',
      secondaryBg: '#171c2c',
      primaryText: '#dddddd',
      lightBorder: '#33363c',
      sidebarBg: '#2f3136',
      sidebarText: '#ffffff',
      sidebarUnreadText: '#ffffff',
      sidebarTextHoverBg: '#33363c',
      sidebarTextActiveBorder: '#66cfa0',
      sidebarTextActiveColor: '#ffffff',
      sidebarHeaderBg: '#27292c',
      sidebarHeaderTextColor: '#ffffff',
      onlineIndicator: '#43b581',
      awayIndicator: '#faa61a',
      dndIndicator: '#f04747',
      mentionBg: '#6e84d2',
      mentionBj: '#6e84d2',
      mentionColor: '#ffffff',
      centerChannelBg: '#36393f',
      centerChannelColor: '#dddddd',
      newMessageSeparator: '#6e84d2',
      linkColor: '#2095e8',
      buttonBg: '#43b581',
      buttonColor: '#ffffff',
      errorTextColor: '#ff6461',
      mentionHighlightBg: '#3d414f',
      mentionHighlightLink: '#6e84d2',
    },
  },
})

export default function MyApp({ Component }) {
  return (
    <NextThemesProvider
      defaultTheme="system"
      attribute="class"
      value={{
        light: lightTheme.className,
        dark: darkTheme.className,
      }}
    >
      <NextUIProvider>
        <Component />
      </NextUIProvider>
    </NextThemesProvider>
  )
}

MyApp.propTypes = {
  Component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  pageProps: PropTypes.shape({}),
}
