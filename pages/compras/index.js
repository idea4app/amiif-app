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
  TableContainer,
} from '@chakra-ui/react'
import { FaEye, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

import Page from '/lib/page'
import { shoppingStatus } from '/constants'
import { fetcher, formatDate } from '/utils'
import { getLoggedUser } from '/lib/session'

export default function Shoppings({ data, user }) {
  const router = useRouter()

  const columns = [
    { name: 'Orden (ID)', id: 'id' },
    { name: 'Fecha de entrega', id: 'deliveryAt' },
    { name: 'Creado Por', id: 'userName' },
    { name: 'Estado', id: 'status' },
    { name: '', id: 'actions' },
  ]

  return (
    <Page user={user}>
      <Flex mt="5" justifyContent="space-between">
        <Heading size="lg">Compras</Heading>
        <Button colorScheme="blue" variant="solid">
          Agregar
        </Button>
      </Flex>
      <Box mt="6" borderWidth="3px" rounded="lg" minHeight="410px">
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
              {data.shoppings.map(shopping => {
                const { id, status, user, deliveryAt } = shopping
                const [{ firstname, paternalSurname }] = user
                return (
                  <Tr key={id}>
                    <Td textAlign="center">{id}</Td>
                    <Td textAlign="center">
                      {formatDate(deliveryAt, {
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Td>
                    <Td textAlign="center">{`${firstname} ${paternalSurname}`}</Td>
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
                      <Button colorScheme="blue">
                        <Icon as={FaEye} />
                      </Button>
                    </Td>
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
      <Flex justifyContent="center" mt="6">
        {data.page !== 1 && (
          <Button
            mr="3"
            size="sm"
            colorScheme="yellow"
            onClick={() =>
              router.push(`/compras?page=${Math.max(data.page - 1, 1)}`)
            }
          >
            <Icon as={FaChevronLeft} />
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
            <Icon as={FaChevronRight} />
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
      user,
      data,
    },
  }
}

Shoppings.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string,
    type: PropTypes.string,
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
        user: PropTypes.arrayOf(
          PropTypes.shape({
            firstname: PropTypes.string,
            maternalSurname: PropTypes.string,
            paternalSurname: PropTypes.string,
          }),
        ),
      }),
    ),
  }),
}
