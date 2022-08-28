import PropTypes from 'prop-types'
import { ChakraProvider } from '@chakra-ui/react'

export default function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

MyApp.propTypes = {
  Component: PropTypes.func,
  pageProps: PropTypes.shape({}),
}
