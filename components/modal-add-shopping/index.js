import { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Flex,
  Icon,
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
import { TbCheck } from 'react-icons/tb'

import 'react-calendar/dist/Calendar.css'

export default function ModalAddShopping({ isOpen, onClose, onCreate }) {
  const [error, setError] = useState('')
  const [description, setDescription] = useState('')
  const [deliveryAt, setDeliveryAt] = useState(new Date())

  async function handleCreate(event) {
    event.preventDefault()

    const success = await onCreate({
      description,
      deliveryAt: deliveryAt.toISOString(),
    })

    if (success) {
      setDescription('')
      setDeliveryAt(new Date())
      return onClose()
    }

    setError('La fecha debe ser mayor a la fecha actual')
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom">
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent>
        <form onSubmit={handleCreate}>
          <ModalHeader>Crear orden de compra</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex mb="5" justifyContent="center">
              <Calendar
                value={deliveryAt}
                minDate={new Date()}
                onChange={setDeliveryAt}
                className="calendar"
              />
            </Flex>
            <Text fontSize="md" mb="2">
              Descripción
            </Text>
            <Textarea
              required
              minHeight="200px"
              borderWidth="2px"
              value={description}
              borderColor="blue.400"
              placeholder="Conceptos separados por saltos de línea"
              onChange={e => setDescription(e.target.value)}
            />
            <Text
              mt="1"
              mb="1"
              fontSize="sm"
              color="red.500"
              textAlign="center"
            >
              {error}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              colorScheme="green"
              leftIcon={<Icon w="5" h="5" as={TbCheck} />}
            >
              Crear
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
