import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import {
  Box,
  Flex,
  Grid,
  Icon,
  Link,
  Text,
  Input,
  Image,
  Button,
  Spacer,
  Heading,
  FormLabel,
  InputGroup,
  FormControl,
  FormErrorMessage,
  InputLeftElement,
  useColorModeValue,
} from '@chakra-ui/react'
import { TbUser, TbMail, TbLock } from 'react-icons/tb'

import { fetcher } from '/utils'
import { httpStatus } from '/constants'

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

  async function onSubmit({ email, password, lastname, firstname }) {
    const request = await fetcher('/api/register', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        lastname,
        firstname,
      }),
    })

    if (request.status === httpStatus.HTTP_201_CREATED) {
      router.push('/')
    } else if (request.status === httpStatus.HTTP_409_CONFLICT) {
      setError('email', {
        message: 'Email existente o inválido',
      })
    } else if (request.status === httpStatus.HTTP_400_BAD_REQUEST) {
      setError('passoword', {
        message: 'Contraseña insegura',
      })
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
        maxWidth="550px"
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
          Crea tu cuenta
        </Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex mb="6">
            <FormControl isInvalid={errors.firstname} mr="6">
              <FormLabel htmlFor="firstname">Nombre</FormLabel>
              <InputGroup>
                <Input
                  id="firstname"
                  placeholder="Tu Nombre"
                  {...register('firstname', {
                    required: 'Nombre es requerido',
                  })}
                />
                <InputLeftElement>
                  <Icon color="blue.400" w="5" h="5" as={TbUser} />
                </InputLeftElement>
              </InputGroup>
              <FormErrorMessage>
                {errors.firstname && errors.firstname.message}
              </FormErrorMessage>
            </FormControl>
            <Spacer />
            <FormControl isInvalid={errors.lastname} mr="6">
              <FormLabel htmlFor="lastname">Apellidos</FormLabel>
              <InputGroup>
                <Input
                  id="lastname"
                  placeholder="Tus Apellidos"
                  {...register('lastname', {
                    required: 'Apellidos es requerido',
                  })}
                />
                <InputLeftElement>
                  <Icon color="blue.400" w="5" h="5" as={TbUser} />
                </InputLeftElement>
              </InputGroup>
              <FormErrorMessage>
                {errors.lastname && errors.lastname.message}
              </FormErrorMessage>
            </FormControl>
          </Flex>
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
                <Icon color="blue.400" w="5" h="5" as={TbMail} />
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
                <Icon color="blue.400" w="5" h="5" as={TbLock} />
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
            Crear cuenta
          </Button>
        </form>
        <Flex textAlign="center" mt="6" justifyContent="space-evenly">
          <Text>¿Ya tienes cuenta?</Text>
          <NextLink href="/login" passHref>
            <Link color="blue.400">Inicia sesión</Link>
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
