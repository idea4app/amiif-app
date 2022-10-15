import handler from '/server/handlers/protected'
import getShoppings from '/server/shoppings/getShoppings'
import createShopping from '/server/shoppings/createShopping'

handler.get(getShoppings)
handler.post(createShopping)

export default handler
