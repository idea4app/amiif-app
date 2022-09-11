import handler from '/server/handlers/protected'
import getShoppings from '/server/shoppings/getShoppings'
import createShopping from '/server/shoppings/createShopping'
import emailNotifier from '/server/middlewares/emailNotifier'

handler.get(getShoppings)
handler.post(createShopping)
handler.use(emailNotifier)

export default handler
