import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  Card,
  Grid,
  Link,
  Text,
  Input,
  Button,
  Spacer,
  useInput,
} from '@nextui-org/react'
import { httpStatus } from '/constants'
import { createCookie, validateEmail } from '/utils'

export default function Login() {
  const [error, setError] = useState('')
  const { register, handleSubmit } = useForm()
  const { value, reset, bindings } = useInput('')

  const helper = useMemo(() => {
    if (!value) return { color: 'primary' }
    const isValid = validateEmail(value)
    return { color: isValid ? 'primary' : 'error' }
  }, [value])

  async function onSubmit({ email, password }) {
    setError('')

    const request = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    })

    if (request.status === httpStatus.HTTP_200_OK) {
      const response = await request.json()
      const { token, expirationInSeconds } = response
      createCookie({
        value: token,
        name: 'token',
        ageInSeconds: expirationInSeconds,
      })
      location.reload()
    } else {
      setError('Credenciales inválidas')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid.Container
        justify="center"
        alignItems="center"
        css={{ height: '100vh' }}
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
                Inicia sesión
              </Text>
              <Spacer />
              <Input
                required
                bordered
                clearable
                name="email"
                type="email"
                label="Email"
                color={helper.color}
                onClearClick={reset}
                status={helper.color}
                placeholder="Ingresa tu email"
                {...register('email', { ...bindings })}
              />
              <Spacer />
              <Input.Password
                required
                bordered
                color="primary"
                name="password"
                label="Contraseña"
                placeholder="Ingresa tu contraseña"
                {...register('password')}
              />
              <Spacer />
              <Text small color="error" css={{ m: '0 auto' }} size="">
                {error}
              </Text>
              <Spacer />
              <Button color="primary" auto>
                Iniciar sesion
              </Button>
            </Card.Body>
            <Card.Footer css={{ justifyContent: 'center' }}>
              <Text small>¿No tienes cuenta?</Text>
              <Button auto light color="primary">
                <Link href="/registro">Crea tu cuenta</Link>
              </Button>
            </Card.Footer>
          </Card>
        </Grid>
      </Grid.Container>
    </form>
  )
}

export async function getServerSideProps({ req }) {
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
