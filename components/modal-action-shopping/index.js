import PropTypes from 'prop-types'
import {
  Box,
  Text,
  Modal,
  Button,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalContent,
  ModalOverlay,
  ModalCloseButton,
} from '@chakra-ui/react'

import { shoppingStatus } from '/constants'

export default function ModalAddShopping({
  isOpen,
  onClose,
  shopping,
  userType,
  onApprove,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{shopping?.id}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontSize="md" mb="2">
            Descripción
          </Text>
          <Box
            size="sm"
            padding="4"
            rounded="lg"
            borderWidth="2px"
            userSelect="none"
            borderColor="blue.400"
          >
            {shopping?.description}
          </Box>
        </ModalBody>
        {userType === 'admin' && (
          <ModalFooter>
            <Button
              mr={3}
              variant="ghost"
              colorScheme="red"
              onClick={onApprove}
              data-action={shoppingStatus.CANCELED}
            >
              Cancelar
            </Button>
            <Button
              colorScheme="green"
              onClick={onApprove}
              data-action={shoppingStatus.APPROVED}
            >
              Aceptar
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
  onApprove: PropTypes.func,
  shopping: PropTypes.shape({
    id: PropTypes.string,
    description: PropTypes.string,
  }),
  userType: PropTypes.string,
}
