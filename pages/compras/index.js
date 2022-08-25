import jwt from 'jsonwebtoken'
import PropTypes from 'prop-types'
import { useState, useEffect, useReducer } from 'react'
import {
  Text,
  Grid,
  Table,
  Button,
  Spacer,
  Container,
  Pagination,
} from '@nextui-org/react'
import * as IconlyPack from 'react-iconly'

import Wrapper from '/components/wrapper'
import ModalOrderAdd from '/components/order-add'
import ModalOrderDetail from '/components/order-detail'

import { actions, reducer, initialState } from '../../states/shoppings'

export default function Shoppings(props) {
  const {
    data,
    user: { type, token },
  } = props
  const isAdmin = type === 'admin'

  const [shopping, setShopping] = useState(null)
  const [addShopping, setAddShopping] = useState(false)
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    dispatch({ payload: data, type: actions.FETCH_DATA })
  }, [data])

  const fetchShoppings = async ({ page, perPage }) => {
    const request = await fetch(
      `/api/shoppings?perPage=${perPage}&page=${page}`,
      { headers: { Authorization: `Bearer ${token}` } },
    )

    const response = await request.json()
    return dispatch({
      payload: response,
      type: actions.FETCH_DATA,
    })
  }

  const handleShoppingModal = shopping => setShopping(shopping)

  const loadPage = async page => {
    await fetchShoppings({ page, perPage: state.perPage })
  }

  const handleUpdateStatus = async (orderId, status) => {
    const request = await fetch(`/api/shoppings/check/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
      headers: { Authorization: `Bearer ${token}` },
    })

    if (request.status === 200) {
      const response = await request.json()
      dispatch({ payload: response, type: actions.UPDATE_ORDER })
    }

    handleShoppingModal(null)
  }

  const handleCreateOrder = async data => {
    const request = await fetch('/api/shoppings', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { Authorization: `Bearer ${token}` },
    })

    const response = await request.json()

    dispatch({ type: actions.CREATE_ORDER, payload: response })
    setAddShopping(false)
  }

  const columns = [
    { name: 'Orden (ID)', uid: 'id' },
    { name: 'Fecha de entrega', uid: 'deliveryAt' },
    { name: 'Creado Por', uid: 'userName' },
    { name: 'Estado', uid: 'status' },
    { name: '', uid: 'actions' },
  ]

  return (
    <Wrapper>
      <ModalOrderDetail
        isAdmin={isAdmin}
        shopping={shopping}
        onClose={() => handleShoppingModal(null)}
        onCancel={() => handleUpdateStatus(shopping?.id, 0)}
        onApprove={() => handleUpdateStatus(shopping?.id, 1)}
      />
      <ModalOrderAdd
        open={addShopping}
        onCreate={handleCreateOrder}
        onClose={() => setAddShopping(false)}
      />
      <Container sm={true}>
        <Spacer />
        <Text h3>Compras</Text>
        <Spacer />
        <Grid.Container justify="space-between">
          <Grid md={6} />
          <Grid md={3} justify="flex-end">
            <Button auto color="primary" onClick={() => setAddShopping(true)}>
              Agregar compra
            </Button>
          </Grid>
        </Grid.Container>
        <Spacer />
        {!!state.shoppings.length && (
          <Table bordered selectionMode="none">
            <Table.Header columns={columns}>
              {column => (
                <Table.Column key={column.uid}>{column.name}</Table.Column>
              )}
            </Table.Header>
            <Table.Body items={state.shoppings}>
              {shopping => {
                const { id, user, deliveryAt, colorStatus, orderStatus } =
                  shopping
                const [{ firstname, lastname }] = user
                return (
                  <Table.Row key={id}>
                    <Table.Cell>
                      <Text b size={14}>
                        {id}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size={14}>{deliveryAt}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size={14}>{`${firstname} ${lastname}`}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text b size={14} color={colorStatus}>
                        {orderStatus}
                      </Text>
                    </Table.Cell>
                    <Table.Cell align="center">
                      <Button
                        auto
                        light
                        size="xs"
                        color="primary"
                        onClick={() => handleShoppingModal(shopping)}
                        icon={
                          <IconlyPack.Show stroke="bold" fill="currentColor" />
                        }
                      />
                    </Table.Cell>
                  </Table.Row>
                )
              }}
            </Table.Body>
          </Table>
        )}
        <Spacer />
        {!!state.shoppings.length && (
          <Grid.Container justify="center">
            <Pagination
              shadow
              noMargin
              bordered
              page={state.page}
              total={state.pages}
              onChange={loadPage}
              initialPage={state.page}
            />
          </Grid.Container>
        )}
        <Spacer />
      </Container>
    </Wrapper>
  )
}

export const getServerSideProps = async ({ req }) => {
  const {
    cookies: { token },
  } = req

  if (!token) {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    }
  }

  const decoded = jwt.decode(token)
  const request = await fetch('/api/shoppings', {
    headers: { Authorization: `Bearer ${token}` },
  })
  const response = await request.json()

  return {
    props: {
      data: { ...response },
      user: { ...decoded, token },
    },
  }
}

Shoppings.propTypes = {
  data: PropTypes.shape({
    page: PropTypes.number,
    pages: PropTypes.number,
    perPage: PropTypes.number,
    shoppings: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        deliveryAt: PropTypes.string,
        colorStatus: PropTypes.string,
        orderStatus: PropTypes.string,
        user: PropTypes.shape({
          firstname: PropTypes.string,
          lastname: PropTypes.string,
        }),
      }),
    ),
  }),
  user: PropTypes.shape({
    type: PropTypes.string,
    token: PropTypes.string,
  }),
}
