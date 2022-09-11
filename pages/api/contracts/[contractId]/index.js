import handler from '/server/handlers/protected'
import getContract from '/server/contracts/getContract'

handler.get(getContract)

export default handler
