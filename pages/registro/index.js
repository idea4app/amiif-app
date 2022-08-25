import { useForm } from 'react-hook-form'
import {
  Card,
  Grid,
  Text,
  Link,
  Input,
  Button,
  Spacer,
  useInput,
  NextUIProvider,
} from '@nextui-org/react'

import { httpStatus } from '/constants'
import { createCookie, validateEmail, validatePassword } from '/utils'

export default function Register() {
  const { reset } = useInput('')
  const {
    register,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm()

  async function onSubmit({ firstname, lastname, email, password }) {
    const request = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({
        email,
        lastname,
        password,
        firstname,
      }),
    })

    if (request.status === httpStatus.HTTP_409_CONFLICT) {
      return setError('email', { message: 'Email existente' })
    }

    if (request.status === httpStatus.HTTP_201_CREATED) {
      const response = await request.json()
      const { token, expirationInSeconds } = response
      createCookie({
        value: token,
        name: 'token',
        ageInSeconds: expirationInSeconds,
      })
      location.reload()
    }
  }

  function handleValidateField(fieldName, validate, value, message = '') {
    const isValid = validate(value)
    if (!isValid) setError(fieldName, { focus: true, message })
  }

  console.log(errors.email)
  return (
    <NextUIProvider>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid.Container
          justify="center"
          alignItems="center"
          css={{ height: '100vh', background: '#eee' }}
        >
          <Grid xs={11} sm={8} md={4} lg={4} xl={4}>
            <Card variant="bordered" css={{ padding: '1.5rem' }}>
              <Card.Image
                alt="AMIIF"
                width={160}
                height={60}
                objectFit="contain"
                src="/images/logo-amiif-border.png"
              />
              <Card.Body>
                <Text h3 color="warning" margin="0 auto">
                  Crea tu cuenta
                </Text>
                <Spacer />
                <Input
                  bordered
                  required
                  name="name"
                  label="Nombre"
                  color="primary"
                  placeholder="Ingresa tu nombre"
                  {...register('firstname', { required: true })}
                />
                <Spacer />
                <Input
                  bordered
                  required
                  color="primary"
                  name="lastname"
                  label="Apellidos"
                  placeholder="Ingresa tus apellidos"
                  {...register('lastname', { required: true })}
                />
                <Spacer />
                <Input
                  {...register('email', { required: true })}
                  bordered
                  clearable
                  name="email"
                  type="email"
                  label="Email"
                  onClearClick={reset}
                  placeholder="Ingresa tu email"
                  helperText={errors.email?.message}
                  color={(errors.email && 'error') || 'primary'}
                  status={(errors.email && 'error') || 'primary'}
                  helperColor={(errors.email && 'error') || 'primary'}
                  onFocus={() => clearErrors('email')}
                  onBlur={event => {
                    const { value } = event.currentTarget
                    if (value) {
                      handleValidateField(
                        'email',
                        validateEmail,
                        value,
                        'Email Inválido',
                      )
                    } else {
                      clearErrors('email')
                    }
                  }}
                />
                <Spacer />
                <Input.Password
                  {...register('password', { required: true })}
                  bordered
                  name="password"
                  label="Contraseña"
                  placeholder="Ingresa una contraseña segura"
                  color={(errors.password && 'error') || 'primary'}
                  status={(errors.password && 'error') || 'primary'}
                  helperText={errors.password && 'Contraseña insegura'}
                  helperColor={(errors.password && 'error') || 'primary'}
                  onFocus={() => clearErrors('password')}
                  onBlur={event => {
                    const { value } = event.currentTarget
                    if (value) {
                      handleValidateField('password', validatePassword, value)
                    } else {
                      clearErrors('password')
                    }
                  }}
                />
                <Spacer y={2} />
                <Button color="primary" auto>
                  Crear cuenta
                </Button>
              </Card.Body>
              <Card.Footer css={{ justifyContent: 'center' }}>
                <Button auto light color="primary">
                  <Link href="/login">Inicia sesión</Link>
                </Button>
              </Card.Footer>
            </Card>
          </Grid>
        </Grid.Container>
      </form>
    </NextUIProvider>
  )
}

export async function getServerSideProps({ req, res }) {
  const {
    cookies: { token },
  } = req

  if (token) {
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
