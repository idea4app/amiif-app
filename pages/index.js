import { Flex, Grid, Heading } from '@chakra-ui/react'

import { getLoggedUser } from '/lib/session'

export default function Home({ user }) {
  return (
    <Grid height="100vh" placeContent="center">
      <Flex direction="column" textAlign="center">
        <Heading>AMIIF App</Heading>
        <Heading size="lg">In progress section</Heading>
      </Flex>
    </Grid>
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
