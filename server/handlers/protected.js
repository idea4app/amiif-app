import defaultHandler from './default'
import withSession from '../middlewares/withSession'

// to prevent unauthenticated requests
defaultHandler.use(withSession)

export default defaultHandler
