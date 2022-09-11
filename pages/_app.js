import PropTypes from 'prop-types'
import { ChakraProvider } from '@chakra-ui/react'

import '../styles/globals.css'

export default function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

MyApp.propTypes = {
  Component: PropTypes.element,
  pageProps: PropTypes.shape({}),
}
