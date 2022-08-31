import { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Flex,
  Text,
  Modal,
  Button,
  Textarea,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalContent,
  ModalOverlay,
  ModalCloseButton,
} from '@chakra-ui/react'
import Calendar from 'react-calendar'

import 'react-calendar/dist/Calendar.css'

export default function ModalAddShopping({ isOpen, onClose, onCreate }) {
  const [deliveryAt, setDeliveryAt] = useState(new Date())
  const [description, setDescription] = useState('')

  function handleCreate(event) {
    event.preventDefault()

    onCreate({
      description,
      deliveryAt: deliveryAt.toISOString(),
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom">
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleCreate}>
          <ModalHeader>Crear orden de compra</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex mb="5" justifyContent="center">
              <Calendar
                value={deliveryAt}
                minDate={deliveryAt}
                onChange={setDeliveryAt}
                className="calendar"
              />
            </Flex>
            <Text fontSize="md" mb="2">
              Descripción
            </Text>
            <Textarea
              resize="none"
              borderWidth="2px"
              value={description}
              borderColor="blue.400"
              onChange={e => setDescription(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button type="submit" colorScheme="green">
              Aceptar
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

ModalAddShopping.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onCreate: PropTypes.func,
}
