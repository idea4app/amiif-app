import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import {
  Box,
  Flex,
  Grid,
  Link,
  Text,
  Input,
  Image,
  Button,
  Heading,
  FormLabel,
  InputGroup,
  FormControl,
  FormErrorMessage,
  InputLeftElement,
  useColorModeValue,
} from '@chakra-ui/react'
import { LockIcon, EmailIcon } from '@chakra-ui/icons'

import { httpStatus } from '/constants'
import { fetcher, createCookie } from '/utils'

export default function Login() {
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  const router = useRouter()

  const boxBackground = useColorModeValue('gray.50', 'gray.700')
  const loginBackground = useColorModeValue('gray.200', 'gray.800')

  async function onSubmit({ email, password }) {
    const request = await fetcher('/api/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
    })

    if (request.status === httpStatus.HTTP_200_OK) {
      const response = await request.json()
      const { token, expirationInSeconds } = response
      createCookie({
        value: token,
        name: 'session',
        ageInSeconds: expirationInSeconds,
      })
      router.push('/')
    } else if (request.status === httpStatus.HTTP_403_FORBIDDEN) {
      const customError = {
        type: 'credentials',
        message: 'Credenciales inválidas',
      }
      setError('email', customError)
      setError('password', customError)
    }
  }

  return (
    <Grid
      height="100vh"
      placeContent="center"
      justifyContent="center"
      background={loginBackground}
      gridTemplateColumns="minmax(30%, 1fr)"
    >
      <Box
        rounded="lg"
        width="100%"
        padding="40px"
        margin="0 auto"
        maxWidth="450px"
        direction="column"
        background={boxBackground}
      >
        <Image
          height="60px"
          loading="lazy"
          margin="0 auto"
          alt="AMIIF logo"
          src="/images/logo-amiif-border.png"
        />
        <Heading mb="5" mt="5" textAlign="center" size="lg">
          Inicia sesión
        </Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={errors.email} mb="6">
            <FormLabel htmlFor="email">Email</FormLabel>
            <InputGroup>
              <Input
                id="email"
                type="email"
                placeholder="tuemail@amiif.org"
                {...register('email', {
                  required: 'Email requerido',
                })}
              />
              <InputLeftElement>
                <EmailIcon />
              </InputLeftElement>
            </InputGroup>
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.password} mb="10">
            <FormLabel htmlFor="password">Contraseña</FormLabel>
            <InputGroup>
              <Input
                id="password"
                type="password"
                placeholder="**********"
                {...register('password', {
                  required: 'Contraseña requerida',
                })}
              />
              <InputLeftElement>
                <LockIcon />
              </InputLeftElement>
            </InputGroup>
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>
          <Button
            size="lg"
            width="100%"
            type="submit"
            colorScheme="blue"
            isLoading={isSubmitting}
          >
            Iniciar sesión
          </Button>
        </form>
        <Flex textAlign="center" mt="5" justifyContent="space-around">
          <Text>¿Aún no tienes cuenta?</Text>
          <NextLink href="/registro" passHref>
            <Link color="blue.400">Crea una cuenta</Link>
          </NextLink>
        </Flex>
      </Box>
    </Grid>
  )
}

export async function getServerSideProps({ req }) {
  const {
    cookies: { session },
  } = req

  if (session) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    }
  }

  return {
    props: {},
  }
}
