import { useRef } from 'react'
import NextLink from 'next/link'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import {
  Flex,
  Icon,
  Text,
  Image,
  Button,
  Drawer,
  Popover,
  DrawerBody,
  PopoverArrow,
  DrawerHeader,
  DrawerOverlay,
  PopoverFooter,
  PopoverHeader,
  DrawerContent,
  useDisclosure,
  PopoverTrigger,
  PopoverContent,
  DrawerCloseButton,
  PopoverCloseButton,
} from '@chakra-ui/react'
import {
  IoCash,
  IoHelpBuoySharp,
  IoAirplaneSharp,
  IoCarSportSharp,
} from 'react-icons/io5'
import { FcDocument } from 'react-icons/fc'
import { FaBoxes, FaUserAlt, FaAlignJustify } from 'react-icons/fa'

import { fetcher } from '/utils'
import { httpStatus } from '/constants'

const routes = [
  { path: '/compras', name: 'Compras', disabled: false, icon: IoCarSportSharp },
  { path: '/contratos', name: 'Contratos', disabled: true, icon: FcDocument },
  { path: '/proveedores', name: 'Proveedores', disabled: true, icon: FaBoxes },
  { path: '/gastos', name: 'Gastos', disabled: true, icon: IoCash },
  { path: '/viajes', name: 'Viajes', disabled: true, icon: IoAirplaneSharp },
  { path: '/soporte', name: 'Soporte', disabled: true, icon: IoHelpBuoySharp },
]

export default function Header({ user }) {
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()

  const handleLogout = async () => {
    const request = await fetcher('/api/logout', { method: 'POST' })

    if (request.status === httpStatus.HTTP_202_ACCEPTED) {
      return router.push('/login')
    }
  }

  console.log({ user })

  return (
    <Flex padding="20px" background="gray.700" justifyContent="space-between">
      <Flex>
        <Button mr="5" ref={btnRef} colorScheme="gray" onClick={onOpen}>
          <Icon w="5" h="5" as={FaAlignJustify} />
        </Button>
        <NextLink href="/">
          <Image
            height="40px"
            loading="lazy"
            alt="AMIIF logo"
            src="/images/logo-amiif-border.png"
          />
        </NextLink>
      </Flex>
      <Flex>
        <Popover>
          <PopoverTrigger>
            <Button mr="5" ref={btnRef} colorScheme="gray">
              <Icon w="5" h="5" as={FaUserAlt} />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>
              <Text color="teal.400">{user?.email}</Text>
            </PopoverHeader>
            <PopoverFooter>
              <Button width="100%" onClick={handleLogout}>
                Cerrar sesión
              </Button>
            </PopoverFooter>
          </PopoverContent>
        </Popover>
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
          <DrawerHeader>
            <Image
              height="40px"
              margin="0 auto"
              loading="lazy"
              alt="AMIIF logo"
              src="/images/logo-amiif-border.png"
            />
          </DrawerHeader>

          <DrawerBody>
            <Flex direction="column">
              {routes.map(route => {
                return (
                  <NextLink key={route.name} href={route.path} passHref>
                    <Button
                      mb="4"
                      rounded="full"
                      variant="solid"
                      disabled={route.disabled}
                      leftIcon={<Icon w="5" h="5" as={route.icon} />}
                    >
                      {route.name}
                    </Button>
                  </NextLink>
                )
              })}
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  )
}

Header.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string,
  }),
}
