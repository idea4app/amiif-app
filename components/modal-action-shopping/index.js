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
  Icon,
  Flex,
} from '@chakra-ui/react'

import { BsDot } from 'react-icons/bs'

import { shoppingStatus } from '/constants'

export default function ModalAddShopping({
  isOpen,
  onClose,
  shopping,
  userType,
  onApprove,
}) {
  console.log({ description: shopping?.description })
  return (
    <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{shopping?.id}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontSize="md" mb="2">
            Conceptos:
          </Text>
          <Box mt="4" mb="4">
            {shopping?.description.split('\n').map(item => {
              return (
                <Flex key={item} alignItems="center">
                  <Icon as={BsDot} />
                  <Text key={item} fontSize="md">
                    {item}
                  </Text>
                </Flex>
              )
            })}
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
  onApprove: PropTypes.func,
  shopping: PropTypes.shape({
    id: PropTypes.string,
    description: PropTypes.string,
  }),
  userType: PropTypes.string,
}
