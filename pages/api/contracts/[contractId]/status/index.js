import handler from '/server/handlers/protected'
import updateStatus from '/server/contracts/updateStatus'

handler.put(updateStatus)

export default handler
