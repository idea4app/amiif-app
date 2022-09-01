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
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalContent,
  ModalOverlay,
  ModalCloseButton,
} from '@chakra-ui/react'

import { BsDot } from 'react-icons/bs'
import { TbCheck, TbX } from 'react-icons/tb'

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
        {userType === 'admin' && (
          <ModalFooter>
            <Button
              mr={3}
              variant="ghost"
              colorScheme="red"
              onClick={onApprove}
              data-action={shoppingStatus.CANCELED}
              leftIcon={<Icon w="5" h="5" as={TbX} />}
            >
              Cancelar
            </Button>
            <Button
              colorScheme="green"
              onClick={onApprove}
              data-action={shoppingStatus.APPROVED}
              leftIcon={<Icon w="5" h="5" as={TbCheck} />}
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
