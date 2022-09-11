import { useState } from 'react'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import {
  Flex,
  Icon,
  Text,
  Modal,
  Button,
  Textarea,
  useToast,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalContent,
  ModalOverlay,
  ModalCloseButton,
} from '@chakra-ui/react'
import Calendar from 'react-calendar'
import { TbCheck } from 'react-icons/tb'

import { fetcher } from '../../utils'
import { httpStatus } from '../../constants'

import 'react-calendar/dist/Calendar.css'

export default function ModalAddShopping({ user, isOpen, onClose, onCreate }) {
  const toast = useToast()
  const { handleSubmit, register, reset } = useForm()
  const [deliveryAt, setDeliveryAt] = useState(new Date())

  async function handleCreate({ description }) {
    const request = await fetcher('/api/shoppings', {
      method: 'POST',
      body: JSON.stringify({ description, deliveryAt }),
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })

    if (request.status !== httpStatus.HTTP_201_CREATED) {
      return toast({
        status: 'error',
        title: 'Error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
        description: 'Ocurrió un error al crear la órden, intenta nuevamente',
      })
    }

    const response = await request.json()
    onCreate(response)

    toast({
      duration: 3000,
      isClosable: true,
      status: 'success',
      title: 'Creada',
      position: 'top-right',
      description: 'Se ha creado correctamente',
    })
    onClose()
    reset()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom">
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent>
        <form onSubmit={handleSubmit(handleCreate)}>
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
              Artículos:
            </Text>
            <Textarea
              required
              minHeight="200px"
              borderWidth="2px"
              borderColor="blue.400"
              placeholder="Conceptos separados por saltos de línea"
              {...register('description', {
                required: 'Artículos requeridos',
              })}
            />
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
  user: PropTypes.shape({
    token: PropTypes.string,
  }),
}
