import PropTypes from 'prop-types'
import {
  Flex,
  Icon,
  List,
  Text,
  Modal,
  Button,
  ListIcon,
  ListItem,
  useToast,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalContent,
  ModalOverlay,
  ModalCloseButton,
} from '@chakra-ui/react'

import { BsDot } from 'react-icons/bs'
import { TbCheck, TbX } from 'react-icons/tb'

import { fetcher } from '../../utils'
import { httpStatus, shoppingStatus } from '../../constants'

export default function ModalAddShopping({
  user,
  isOpen,
  onClose,
  onUpdate,
  shopping,
}) {
  const toast = useToast()

  async function handleApprove(status) {
    const request = await fetcher(`/api/shoppings/${shopping.id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })

    if (request.status !== httpStatus.HTTP_200_OK) {
      return toast({
        status: 'error',
        title: 'Error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
        description: 'Ocurrió un error al actualizar, intenta nuevamente',
      })
    }

    const response = await request.json()
    onUpdate(response)
    onClose()

    return toast({
      duration: 3000,
      isClosable: true,
      status: 'success',
      title: 'Actualizada',
      position: 'top-right',
      description: 'Se ha actualizado el estado de la compra',
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom">
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent>
        <ModalHeader>{shopping?.id}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontSize="md" mb="2">
            Conceptos:
          </Text>
          <List mt="4" mb="4">
            {shopping?.description.split('\n').map(item => {
              return (
                <ListItem key={item}>
                  <Flex alignItems="center">
                    <ListIcon as={BsDot} w="10" h="10" />
                    <Text key={item} fontSize="md">
                      {item}
                    </Text>
                  </Flex>
                </ListItem>
              )
            })}
          </List>
        </ModalBody>
        {user.roles.shoppings === 'admin' && (
          <ModalFooter>
            <Button
              mr={3}
              variant="ghost"
              colorScheme="red"
              leftIcon={<Icon w="5" h="5" as={TbX} />}
              onClick={() => handleApprove(shoppingStatus.CANCELED)}
            >
              Cancelar
            </Button>
            <Button
              colorScheme="green"
              leftIcon={<Icon w="5" h="5" as={TbCheck} />}
              onClick={() => handleApprove(shoppingStatus.APPROVED)}
            >
              Aprobar
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  )
}

ModalAddShopping.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onUpdate: PropTypes.func,
  onApprove: PropTypes.func,
  shopping: PropTypes.shape({
    id: PropTypes.string,
    description: PropTypes.string,
  }),
  user: PropTypes.shape({
    token: PropTypes.string,
    roles: PropTypes.shape({
      shoppings: PropTypes.string,
    }),
  }),
}
