import Link from 'next/link'
import { Danger } from 'react-iconly'

import styles from '/styles/404.module.css'

import Wrapper from '/components/wrapper'

export default function NotFound() {
  return (
    <Wrapper>
      <div className={styles.error}>
        <h1>
          <Danger /> 404
        </h1>
        <p>Sorry, Esta página no existe</p>
        <Link href="/">Volver al inicio</Link>
      </div>
    </Wrapper>
  )
}
