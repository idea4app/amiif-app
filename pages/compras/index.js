import PropTypes from 'prop-types'
import { Flex, Grid, Heading } from '@chakra-ui/react'

import { getLoggedUser } from '/lib/session'
import Page from '/lib/page'

export default function Home({ user }) {
  return (
    <Page user={user}>
      <Flex direction="column" textAlign="center">
        <Heading>AMIIF App</Heading>
        <Heading size="lg">In progress section</Heading>
      </Flex>
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
