import { useState } from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import {
  Td,
  Th,
  Tr,
  Box,
  Flex,
  Icon,
  Badge,
  Table,
  Tbody,
  Thead,
  Button,
  Heading,
  useDisclosure,
  TableContainer,
} from '@chakra-ui/react'
import { TbChecklist, TbChevronLeft, TbChevronRight } from 'react-icons/tb'

import ModalAddShopping from '/components/modal-add-shopping'
import ModalActionShopping from '/components/modal-action-shopping'

import Page from '/lib/page'
import { shoppingStatus } from '/constants'
import { fetcher, formatDate } from '/utils'
import { getLoggedUser } from '/lib/session'

export default function Shoppings({ data, user }) {
  const router = useRouter()
  const updateModal = useDisclosure()
  const createModal = useDisclosure()
  const [shopping, setShopping] = useState(null)

  const columns = [
    { name: 'No. Order', id: 'id' },
    { name: 'Estado', id: 'status' },
    { name: 'Fecha de creación', id: 'deliveryAt' },
    { name: 'Creado Por', id: 'userName' },
    { name: 'Visualizar', id: 'actions' },
  ]

  function handleSelectShopping(shoppingId) {
    const shopping = data.shoppings.find(({ id }) => id === shoppingId)
    setShopping(shopping)
    updateModal.onOpen()
  }

  function handleUpdate(shoppingUpdated) {
    data.shoppings = data.shoppings.map(shopping => {
      if (shopping.id === shoppingUpdated.id) {
        shopping.status = shoppingUpdated.status
      }
      return shopping
    })
  }

  function handleCreate(shopping) {
    if (data.shoppings.length < data.perPage) {
      data.shoppings = [...data.shoppings, shopping]
    } else if (data.pages === data.page) {
      data.pages += 1
    }
  }

  return (
    <Page user={user}>
      <ModalActionShopping
        {...updateModal}
        user={user}
        shopping={shopping}
        onUpdate={handleUpdate}
      />
      <ModalAddShopping {...createModal} user={user} onCreate={handleCreate} />
      <Flex mt="5" justifyContent="space-between">
        <Heading size="lg">Compras</Heading>
        <Button
          variant="solid"
          colorScheme="green"
          onClick={createModal.onOpen}
          rightIcon={<Icon w="5" h="5" as={TbChecklist} />}
        >
          Crear order
        </Button>
      </Flex>
      <Box mt="6" minHeight="410px">
        <TableContainer>
          <Table variant="striped" colorScheme="gray">
            <Thead>
              <Tr>
                {columns.map(column => (
                  <Th key={column.id} textAlign="center">
                    {column.name}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {data.shoppings.map(({ id, status, creator, deliveryAt }) => {
                return (
                  <Tr key={id}>
                    <Td textAlign="center">{id}</Td>
                    <Td textAlign="center">
                      {status === shoppingStatus.PENDING && (
                        <Badge variant="outline" colorScheme="yellow">
                          Pendiente
                        </Badge>
                      )}
                      {status === shoppingStatus.APPROVED && (
                        <Badge variant="outline" colorScheme="green">
                          Aprobado
                        </Badge>
                      )}
                      {status === shoppingStatus.CANCELED && (
                        <Badge variant="outline" colorScheme="red">
                          Cancelada
                        </Badge>
                      )}
                    </Td>
                    <Td textAlign="center">
                      {formatDate(deliveryAt, {
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Td>
                    <Td textAlign="center">
                      {`${creator?.firstname} ${creator?.lastname}`}
                    </Td>
                    <Td textAlign="center">
                      <Button
                        colorScheme="blue"
                        data-shopping-id={id}
                        onClick={() => handleSelectShopping(id)}
                      >
                        <Icon as={TbChecklist} w="5" h="5" />
                      </Button>
                    </Td>
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
      <Flex justifyContent="center" mt="6" mb="6">
        {data.page !== 1 && (
          <Button
            mr="3"
            size="sm"
            colorScheme="yellow"
            onClick={() =>
              router.push(`/compras?page=${Math.max(data.page - 1, 1)}`)
            }
          >
            <Icon w="5" h="5" as={TbChevronLeft} />
          </Button>
        )}
        {Array.from(Array(data.pages).keys()).map(page => {
          return (
            <Button
              mr="3"
              size="sm"
              colorScheme="yellow"
              key={`pagination-${page}`}
              disabled={data.page === page + 1}
              onClick={() => router.push(`/compras?page=${page + 1}`)}
            >
              {page + 1}
            </Button>
          )
        })}
        {data.page < data.pages && (
          <Button
            mr="3"
            size="sm"
            colorScheme="yellow"
            onClick={() =>
              router.push(
                `/compras?page=${Math.min(data.page + 1, data.pages)}`,
              )
            }
          >
            <Icon w="5" h="5" as={TbChevronRight} />
          </Button>
        )}
      </Flex>
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

  const page = query.page || 1
  const request = await fetcher(
    `${process.env.BASE_URL}/api/shoppings?perPage=5&page=${page}`,
    {
      headers: {
        authorization: `Bearer ${user.token}`,
      },
    },
  )

  const data = await request.json()

  return {
    props: {
      user: {
        ...user,
        type: user.roles.shoppings,
      },
      data,
    },
  }
}

Shoppings.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string,
    type: PropTypes.string,
    token: PropTypes.string,
  }),
  data: PropTypes.shape({
    page: PropTypes.number,
    pages: PropTypes.number,
    perPage: PropTypes.number,
    shoppings: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        status: PropTypes.string,
        deliveryAt: PropTypes.string,
        description: PropTypes.string,
        creator: PropTypes.shape({
          firstname: PropTypes.string,
          lastname: PropTypes.string,
        }),
      }),
    ),
  }),
}
