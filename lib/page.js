import Head from 'next/head'
import PropTypes from 'prop-types'
import { Flex } from '@chakra-ui/react'

import Header from '/components/header'
import Footer from '/components/footer'

export default function Page({ user, title, children }) {
  return (
    <>
      <Head>
        <title>{title || 'AMIIF'}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Header user={user} />
      <Flex
        mt="4"
        width="100%"
        margin="0 auto"
        padding="0 50px"
        maxWidth="1200px"
        direction="column"
        minHeight="calc(100vh - 122px)"
      >
        {children}
      </Flex>
      <Footer />
    </>
  )
}

Page.propTypes = {
  title: PropTypes.string,
  user: PropTypes.shape({}),
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
}
