import formatDate from '../utils/formatDate'

export const initialState = {
  page: 1,
  pages: 1,
  perPage: 5,
  shoppings: [],
}

const orderStatus = {
  PENDING: 'Pendiente',
  APPROVED: 'Aprobada',
  CANCELED: 'Cancelada',
}

const colorStatus = {
  CANCELED: 'error',
  PENDING: 'warning',
  APPROVED: 'success',
}

export const actions = {
  FETCH_DATA: 'FETCH_DATA',
  UPDATE_ORDER: 'UPDATE_ORDER',
  CREATE_ORDER: 'CREATE_ORDER',
}

function formatShopping(shopping) {
  return {
    ...shopping,
    deliveryAt: formatDate(shopping.deliveryAt),
    orderStatus: orderStatus[shopping.status],
    colorStatus: colorStatus[shopping.status],
  }
}

export function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_DATA: {
      const shoppings = action.payload.shoppings.map(formatShopping)
      return {
        ...state,
        ...action.payload,
        shoppings,
      }
    }
    case actions.UPDATE_ORDER: {
      const updatedOrder = action.payload
      const newShoppings = state.shoppings.map(shopping => {
        const status =
          (shopping.id === updatedOrder.id && updatedOrder.status) ||
          shopping.status

        return {
          ...shopping,
          status,
          orderStatus: orderStatus[status],
          colorStatus: colorStatus[status],
        }
      })

      return {
        ...state,
        shoppings: newShoppings,
      }
    }
    case actions.CREATE_ORDER: {
      if (
        state.page === state.pages &&
        state.shoppings.length < state.perPage
      ) {
        const shoppings = [...state.shoppings, formatShopping(action.payload)]
        return { ...state, shoppings }
      }

      return { ...state }
    }
    default:
      return state
  }
}
