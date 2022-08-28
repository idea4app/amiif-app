import PropTypes from 'prop-types'

import Header from '/components/header'

export default function Page({ children, user }) {
  return (
    <>
      <Header user={user} />
      {children}
    </>
  )
}

Page.propTypes = {
  user: PropTypes.shape({}),
  children: PropTypes.element,
}
