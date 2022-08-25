import PropTypes from 'prop-types'
import Header from '../header'

export default function Wrapper({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  )
}

Wrapper.propTypes = {
  children: PropTypes.element,
}
