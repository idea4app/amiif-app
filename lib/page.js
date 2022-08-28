import Head from 'next/head'
import PropTypes from 'prop-types'
import { Grid } from '@chakra-ui/react'

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
      <Grid mt="4" minHeight="calc(100vh - 116px)">
        {children}
      </Grid>
      <Footer />
    </>
  )
}

Page.propTypes = {
  title: PropTypes.string,
  user: PropTypes.shape({}),
  children: PropTypes.element,
}
