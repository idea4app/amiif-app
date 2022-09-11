import handler from '/server/handlers/protected'
import createComment from '/server/contracts/createComment'

handler.post(createComment)

export default handler
