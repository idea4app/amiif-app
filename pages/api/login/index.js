import handler from '/server/handlers/default'
import login from '/server/access/login'

handler.post(login)

export default handler
