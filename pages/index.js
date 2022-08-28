import PropTypes from 'prop-types'
import { Flex, Grid, Heading } from '@chakra-ui/react'

import Page from '/lib/page'
import { getLoggedUser } from '/lib/session'

export default function Home({ user }) {
  return (
    <Page user={user}>
      <Grid placeContent="center">
        <Flex direction="column" textAlign="center">
          <Heading>AMIIF App</Heading>
          <Heading size="lg">In progress section</Heading>
        </Flex>
      </Grid>
    </Page>
  )
}

export const getServerSideProps = async ({ req }) => {
  const user = await getLoggedUser(req)

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: {
      user,
    },
  }
}

Home.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string,
    type: PropTypes.string,
  }),
}
