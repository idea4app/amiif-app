import handler from '/server/handlers/default'
import logout from '/server/access/logout'

handler.post(logout)

export default handler
