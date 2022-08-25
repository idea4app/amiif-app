import PropTypes from 'prop-types'
import { Text, Input, Modal, Button, Textarea } from '@nextui-org/react'

export default function ModalOrderDetail({
  isAdmin,
  onClose,
  onCancel,
  shopping,
  onApprove,
}) {
  return (
    <Modal
      closeButton
      open={shopping}
      onClose={onClose}
      aria-labelledby="modal-title"
    >
      <Modal.Header>
        <Text size={18}>{shopping?.id}</Text>
      </Modal.Header>
      <Modal.Body>
        <Input
          rounded
          readOnly
          value={shopping?.orderStatus}
          status={shopping?.colorStatus}
        />
        <Textarea
          shadow
          bordered
          readOnly
          label="Descripción"
          borderWeight="light"
          initialValue={shopping?.description}
        />
      </Modal.Body>
      {isAdmin && (
        <Modal.Footer>
          <Button auto light color="error" onClick={onCancel}>
            Cancelar
          </Button>
          <Button auto color="success" onClick={onApprove}>
            Aprobar
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  )
}

ModalOrderDetail.propTypes = {
  isAdmin: PropTypes.bool,
  onClose: PropTypes.func,
  onCancel: PropTypes.func,
  onApprove: PropTypes.func,
  shopping: PropTypes.shape({
    id: PropTypes.string,
    description: PropTypes.string,
    colorStatus: PropTypes.string,
    orderStatus: PropTypes.string,
  }),
}
