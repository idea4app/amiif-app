import { useState } from 'react'
import PropTypes from 'prop-types'
import { Calendar } from 'react-date-range'
import { Text, Modal, Button, Textarea } from '@nextui-org/react'

import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

export default function ModalAddOrder({ open, onClose, onCreate }) {
  const currentDate = new Date()
  const [description, setDescription] = useState(
    '20 lápices de colores, 60 cuadernos, 20 blocks',
  )
  const [deliveryAt, setDeliveryAt] = useState(currentDate)

  const handleCreate = () => {
    if (description.length) {
      onCreate({
        description,
        deliveryAt: new Date(deliveryAt).toISOString(),
      })
    }
  }

  return (
    <Modal
      closeButton
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
    >
      <Modal.Header>
        <Text size={18}>Crear nueva order</Text>
      </Modal.Header>
      <Modal.Body>
        <Calendar
          date={deliveryAt}
          minDate={currentDate}
          shownDate={currentDate}
          onChange={setDeliveryAt}
        />
        <Textarea
          shadow
          bordered
          status="primary"
          label="Descripción"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button auto color="success" onClick={handleCreate}>
          Crear
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

ModalAddOrder.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onCreate: PropTypes.func,
}
