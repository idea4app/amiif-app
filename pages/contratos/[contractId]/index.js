import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import {
  Box,
  Tag,
  Flex,
  Grid,
  Icon,
  Text,
  Button,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  VStack,
  Badge,
  FormControl,
  FormLabel,
  InputGroup,
  Input,
  InputLeftElement,
  FormErrorMessage,
  Avatar,
} from '@chakra-ui/react'
import {
  TbX,
  TbCheck,
  TbRepeat,
  TbBallpen,
  TbFileText,
  TbChevronDown,
  TbExternalLink,
} from 'react-icons/tb'

import Page from '../../../lib/page'
import { contractStatus, httpStatus } from '../../../constants'
import { fetcher, formatDate } from '../../../utils'
import { getLoggedUser } from '../../../lib/session'

export default function Contracts({ data = {}, user }) {
  const [{ firstname, lastname }] = data.user

  const fileForm = useForm()
  const commentForm = useForm()

  async function onCreateComment({ comment }) {
    const request = await fetcher(`/api/contracts/${data.id}/comment`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${user.token}` },
      body: JSON.stringify({ comment, contractId: data.id }),
    })

    if (request.status !== httpStatus.HTTP_201_CREATED) {
      commentForm.setError('comment', {
        message:
          'Ocurrió un problema al agregar comentario, intenta nuevamente.',
      })
    }

    const response = await request.json()
    data.comments = [response, ...data.comments]

    return commentForm.reset()
  }

  async function onUpdateFile({ file }) {
    const formData = new FormData()
    formData.append('file', file[0])

    const request = await fetch(`/api/contracts/${data.id}/update-file`, {
      method: 'PUT',
      body: formData,
      headers: { Authorization: `Bearer ${user.token}` },
    })

    if (request.status !== httpStatus.HTTP_201_CREATED) {
      return fileForm.setError('file', {
        type: 'network',
        message: 'No se pudo subir el contrato, intenta nuevamente',
      })
    }

    const response = await request.json()
    data.documents = [response, ...data.documents]
    fileForm.reset()
  }

  return (
    <Page user={user}>
      <Heading mt="5" size="lg">
        Detalle de contrato
      </Heading>
      <Flex mt="5" mb="5" justifyContent="space-between" alignItems="center">
        {/* <Button
          variant="solid"
          colorScheme="green"
          onClick={uploadContract.onOpen}
          rightIcon={<Icon w="5" h="5" as={TbRefresh} />}
        >
          Actualizar versión
        </Button> */}
        <Heading size="md">{data.name}</Heading>
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<Icon as={TbChevronDown} />}
            colorScheme="blue"
          >
            Cambiar estado
          </MenuButton>
          <MenuList padding="10px">
            <VStack>
              <Button
                w="100%"
                colorScheme="green"
                justifyContent="flex-start"
                leftIcon={<Icon as={TbCheck} />}
              >
                Aprobar
              </Button>

              <Button
                w="100%"
                colorScheme="orange"
                justifyContent="flex-start"
                leftIcon={<Icon as={TbRepeat} />}
              >
                Requiere cambios
              </Button>

              <Button
                w="100%"
                colorScheme="red"
                justifyContent="flex-start"
                leftIcon={<Icon as={TbX} />}
              >
                Cancelar
              </Button>
            </VStack>
          </MenuList>
        </Menu>
      </Flex>
      <Grid
        gridGap="4"
        padding="20px 0"
        alignItems="center"
        borderTopWidth="2px"
        borderBottomWidth="2px"
        templateColumns="repeat(3, 1fr)"
      >
        <Box>
          <Text>Estado del contrato:</Text>
          <Text fontWeight="bold">
            {data.status === contractStatus.NEW && (
              <Badge colorScheme="yellow">Nuevo</Badge>
            )}
            {data.status === contractStatus.REQUESTED_CHANGES && (
              <Badge colorScheme="orange">Requiere cambios</Badge>
            )}
            {data.status === contractStatus.CANCELED && (
              <Badge colorScheme="red">Cancelado</Badge>
            )}
            {data.status === contractStatus.APPROVED && (
              <Badge colorScheme="green">Aprobado</Badge>
            )}
          </Text>
        </Box>
        <Box>
          <Text>Creado por:</Text>
          <Text fontWeight="bold">
            {firstname} {lastname}
          </Text>
        </Box>
        <Box>
          <Text>Última versión:</Text>
          <Text fontWeight="bold">
            {'Versión: '}
            {data.lastVersion}
          </Text>
        </Box>
        <Box>
          <Text>Fecha de creación:</Text>
          <Text fontWeight="bold">
            {formatDate(data.createdAt, {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>
        </Box>
        <Box>
          <Text>Última actualización</Text>
          <Text fontWeight="bold">
            {formatDate(data.updatedAt, {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>
        </Box>
        <Box>
          <Text>Fecha de aprobación:</Text>
          <Text fontWeight="bold">
            {!!data.approvedAt &&
              formatDate(data.approvedAt, {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            {!data.approvedAt && <Tag colorScheme="yellow">Pendiente</Tag>}
          </Text>
        </Box>
      </Grid>
      <Grid mt="6" mb="6" gridGap="5%" gridTemplateColumns="65% 30%">
        <Flex flexDirection="column">
          <Heading size="md" textAlign="left">
            Comentarios
          </Heading>
          <Box borderTopWidth="2px" mt="6" pt="6">
            <form onSubmit={commentForm.handleSubmit(onCreateComment)}>
              <FormControl
                mb="6"
                isInvalid={commentForm.formState.errors.comment}
              >
                <FormLabel htmlFor="comment">Agregar comentario</FormLabel>
                <InputGroup>
                  <Input
                    id="comment"
                    placeholder="Agrega tu comentario"
                    {...commentForm.register('comment', {
                      required: 'Comentario requerido',
                    })}
                  />
                  <InputLeftElement>
                    <Icon color="blue.400" w="5" h="5" as={TbBallpen} />
                  </InputLeftElement>
                  <Button
                    ml="3"
                    type="submit"
                    colorScheme="green"
                    isLoading={commentForm.formState.isSubmitting}
                  >
                    Comentar
                  </Button>
                </InputGroup>
                <FormErrorMessage>
                  {commentForm.formState.errors.comment &&
                    commentForm.formState.errors.comment.message}
                </FormErrorMessage>
              </FormControl>
            </form>
          </Box>
          <Flex mt="4" flexDirection="column" justifyContent="flex-start">
            {data.comments.map(comment => {
              return (
                <Flex
                  mb="3"
                  padding="2"
                  rounded="md"
                  borderWidth="1px"
                  alignItems="center"
                  key={comment.commentId}
                >
                  <Avatar
                    mr="3"
                    size="sm"
                    name={`${comment.user.firstname} ${comment.user.lastname}`}
                  />
                  <Box>
                    <Text>{comment.comment}</Text>
                    <Text color="gray.500" fontSize="xs">
                      {formatDate(comment.createdAt, {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </Text>
                  </Box>
                </Flex>
              )
            })}
          </Flex>
        </Flex>
        <Flex flexDirection="column">
          <Heading size="md" textAlign="left">
            Historial de archivos
          </Heading>
          <Box borderTopWidth="2px" mt="6" pt="6">
            <form onSubmit={fileForm.handleSubmit(onUpdateFile)}>
              <FormControl mb="6" isInvalid={fileForm.formState.errors.file}>
                <FormLabel htmlFor="file">Subir nuevo contrato</FormLabel>
                <InputGroup>
                  <Input
                    pt="1"
                    id="file"
                    type="file"
                    {...fileForm.register('file', {
                      required: 'El archivo es requerido',
                    })}
                  />
                  <Button
                    ml="3"
                    type="submit"
                    colorScheme="green"
                    isLoading={fileForm.formState.isSubmitting}
                  >
                    Subir
                  </Button>
                </InputGroup>
                <FormErrorMessage>
                  {fileForm.formState.errors.file &&
                    fileForm.formState.errors.file.message}
                </FormErrorMessage>
              </FormControl>
            </form>
          </Box>
          <Flex mt="4" flexDirection="column" justifyContent="flex-start">
            {data.documents.map(({ fileName, version }) => {
              return (
                <Flex
                  mb="3"
                  padding="2"
                  rounded="md"
                  key={version}
                  borderWidth="2px"
                  alignItems="center"
                  borderColor="red.400"
                  justifyContent="space-between"
                >
                  <Flex alignItems="center">
                    <Icon w="7" h="7" as={TbFileText} color="red.500" mr="2" />
                    <Text fontSize="sm" fontWeight="bold">
                      {fileName}
                    </Text>
                  </Flex>
                  <Icon
                    w="7"
                    h="7"
                    mr="2"
                    color="blue.500"
                    as={TbExternalLink}
                  />
                </Flex>
              )
            })}
          </Flex>
        </Flex>
      </Grid>
    </Page>
  )
}

export const getServerSideProps = async ({ req, query }) => {
  const user = await getLoggedUser(req)

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  const { contractId } = query

  const request = await fetch(
    `${process.env.BASE_URL}/api/contracts/${contractId}`,
    {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    },
  )

  const data = await request.json()

  return {
    props: {
      user: {
        ...user,
        type: user.roles.contracts,
      },
      data,
    },
  }
}

Contracts.propTypes = {
  user: PropTypes.shape({
    comment: PropTypes.string,
    type: PropTypes.string,
    token: PropTypes.string,
  }),
  data: PropTypes.shape({
    id: PropTypes.string,
    status: PropTypes.string,
    createdAt: PropTypes.string,
    description: PropTypes.string,
    user: PropTypes.arrayOf(
      PropTypes.shape({
        firstname: PropTypes.string,
        lastname: PropTypes.string,
      }),
    ),
    comments: PropTypes.arrayOf(
      PropTypes.shape({
        comment: PropTypes.string,
        user: PropTypes.shape({
          firstname: PropTypes.string,
          lastname: PropTypes.string,
        }),
        commentId: PropTypes.number,
        createdAt: PropTypes.string,
      }),
    ),
  }),
}
