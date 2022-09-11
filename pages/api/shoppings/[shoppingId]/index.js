import handler from '/server/handlers/protected'
import updateShopping from '/server/shoppings/updateShopping'
import emailNotifier from '/server/middlewares/emailNotifier'

handler.put(updateShopping)
handler.use(emailNotifier)

export default handler
