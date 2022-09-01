import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import {
  Td,
  Th,
  Tr,
  Box,
  Flex,
  Icon,
  Text,
  Badge,
  Table,
  Tbody,
  Thead,
  Button,
  Heading,
  useDisclosure,
  TableContainer,
} from '@chakra-ui/react'
import {
  TbFileText,
  TbFileUpload,
  TbChevronLeft,
  TbChevronRight,
} from 'react-icons/tb'

import ModalUploadContract from '../../components/modal-upload-contract'

import Page from '../../lib/page'
import { contractStatus } from '../../constants'
import { fetcher, formatDate } from '../../utils'
import { getLoggedUser } from '../../lib/session'

export default function Contracts({ data = {}, user }) {
  const router = useRouter()
  const uploadContract = useDisclosure()

  const columns = [
    { name: 'Nombre', id: 'name' },
    { name: 'Estado', id: 'status' },
    { name: 'Fecha de creación', id: 'createdAt' },
    { name: 'Fecha de aprobación', id: 'approvedAt' },
    { name: 'Creado por', id: 'createdBy' },
    { name: 'Visualizar', id: 'actions' },
  ]

  function handleOnCreate(contractData) {
    if (data.page === data.pages) {
      data.pages += 1
    } else if (data.contracts.length < data.perPage) {
      data.contracts = [...data.contracts, contractData]
    }

    uploadContract.onClose()
  }

  return (
    <Page user={user}>
      <ModalUploadContract
        {...uploadContract}
        user={user}
        onCreate={handleOnCreate}
      />
      <Flex mt="5" justifyContent="space-between">
        <Heading size="lg">Contratos</Heading>
        <Button
          variant="solid"
          colorScheme="green"
          onClick={uploadContract.onOpen}
          rightIcon={<Icon w="5" h="5" as={TbFileUpload} />}
        >
          Subir contrato
        </Button>
      </Flex>
      <Box mt="6" borderWidth="3px" rounded="lg" minHeight="410px">
        <TableContainer>
          <Table variant="striped" colorScheme="gray">
            <Thead>
              <Tr>
                {columns.map(column => (
                  <Th
                    key={column.id}
                    textAlign={(column.id !== 'name' && 'center') || 'left'}
                  >
                    {column.name}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {(data.contracts || []).map(contract => {
                const { id, name, status, user, createdAt, approvedAt } =
                  contract
                const [{ firstname, lastname }] = user
                return (
                  <Tr key={id}>
                    <Td>{name}</Td>
                    <Td textAlign="center">
                      {status === contractStatus.NEW && (
                        <Badge variant="outline" colorScheme="yellow">
                          Nuevo
                        </Badge>
                      )}
                      {status === contractStatus.REQUESTED_CHANGES && (
                        <Badge variant="outline" colorScheme="orange">
                          Requiere cambios
                        </Badge>
                      )}
                      {status === contractStatus.APPROVED && (
                        <Badge variant="outline" colorScheme="green">
                          Aprobado
                        </Badge>
                      )}
                      {status === contractStatus.CANCELED && (
                        <Badge variant="outline" colorScheme="red">
                          Cancelada
                        </Badge>
                      )}
                    </Td>
                    <Td textAlign="center">
                      {formatDate(createdAt, {
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Td>
                    <Td textAlign="center">
                      {!!approvedAt &&
                        formatDate(approvedAt, {
                          month: 'long',
                          day: 'numeric',
                        })}
                      {!approvedAt && (
                        <Text colorScheme="orange" color="orange.500">
                          Pendiente
                        </Text>
                      )}
                    </Td>
                    <Td textAlign="center">{`${firstname} ${lastname}`}</Td>
                    <Td textAlign="center">
                      <Button colorScheme="blue">
                        <Icon as={TbFileText} w="5" h="5" />
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
              router.push(`/contratos?page=${Math.max(data.page - 1, 1)}`)
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
              onClick={() => router.push(`/contratos?page=${page + 1}`)}
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
                `/contratos?page=${Math.min(data.page + 1, data.pages)}`,
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
    `${process.env.BASE_URL}/api/contracts?perPage=5&page=${page}`,
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
        type: user.roles.contracts,
      },
      data,
    },
  }
}

Contracts.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string,
    type: PropTypes.string,
    token: PropTypes.string,
  }),
  data: PropTypes.shape({
    page: PropTypes.number,
    pages: PropTypes.number,
    perPage: PropTypes.number,
    contracts: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        status: PropTypes.string,
        createdAt: PropTypes.string,
        description: PropTypes.string,
        user: PropTypes.arrayOf(
          PropTypes.shape({
            firstname: PropTypes.string,
            maternalSurname: PropTypes.string,
            lastname: PropTypes.string,
          }),
        ),
      }),
    ),
  }),
}
