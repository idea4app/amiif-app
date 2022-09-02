import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import {
  Icon,
  Modal,
  Input,
  Button,
  FormLabel,
  ModalBody,
  InputGroup,
  FormControl,
  ModalFooter,
  ModalHeader,
  ModalContent,
  ModalOverlay,
  FormErrorMessage,
  ModalCloseButton,
  InputLeftElement,
} from '@chakra-ui/react'
import { TbPencil, TbCloudUpload } from 'react-icons/tb'

import { httpStatus } from '../../constants'

import 'react-calendar/dist/Calendar.css'

export default function ModalUploadContract({
  user,
  isOpen,
  onClose,
  onCreate,
}) {
  const {
    reset,
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  async function handleUpload(data) {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('file', data.file[0])

    const request = await fetch('/api/contracts', {
      method: 'POST',
      body: formData,
      headers: { Authorization: `Bearer ${user.token}` },
    })

    if (request.status !== httpStatus.HTTP_201_CREATED) {
      return setError('file', {
        type: 'network',
        message: 'No se pudo subir el contrato, intenta nuevamente',
      })
    }

    const response = await request.json()
    onCreate(response)
    reset()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom">
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent>
        <form onSubmit={handleSubmit(handleUpload)}>
          <ModalHeader>Subir nuevo contrato</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={errors.name} mb="6">
              <FormLabel htmlFor="name">Nombre de contrato</FormLabel>
              <InputGroup>
                <Input
                  id="name"
                  type="name"
                  maxLength={50}
                  placeholder="Ingresa un nombre para el contrato"
                  {...register('name', {
                    required: 'El nombre del contrato es requerido',
                  })}
                />
                <InputLeftElement>
                  <Icon color="blue.400" w="5" h="5" as={TbPencil} />
                </InputLeftElement>
              </InputGroup>
              <FormErrorMessage>
                {errors.name && errors.name.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.file} mb="6">
              <FormLabel htmlFor="file">Subir archivo:</FormLabel>
              <Input
                type="file"
                name="file"
                padding="4"
                height="auto"
                accept="application/pdf"
                {...register('file', {
                  required: 'El archivo del contrato es requerido',
                })}
              />
              <FormErrorMessage>
                {errors.file && errors.file.message}
              </FormErrorMessage>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              colorScheme="green"
              isLoading={isSubmitting}
              leftIcon={<Icon as={TbCloudUpload} />}
            >
              Subir
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

ModalUploadContract.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onCreate: PropTypes.func,
  user: PropTypes.shape({
    token: PropTypes.string.isRequired,
  }),
}
