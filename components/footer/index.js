import { useRef } from 'react'
import {
  Flex,
  Icon,
  Image,
  Input,
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  DrawerCloseButton,
} from '@chakra-ui/react'
import { FaAlignJustify } from 'react-icons/fa'

export default function Footer() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()

  return (
    <Flex padding="20px" justifyContent="flex-start">
      <Flex>
        <Button mr="5" ref={btnRef} colorScheme="gray" onClick={onOpen}>
          <Icon w="5" h="5" as={FaAlignJustify} />
        </Button>
        <Image
          height="40px"
          loading="lazy"
          alt="AMIIF logo"
          src="/images/logo-amiif-border.png"
        />
      </Flex>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Create your account</DrawerHeader>

          <DrawerBody>
            <Input placeholder="Type here..." />
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Flex>
  )
}
