import { useRef } from 'react'
import NextLink from 'next/link'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import {
  Flex,
  Icon,
  Text,
  Image,
  Input,
  Button,
  Drawer,
  Popover,
  DrawerBody,
  InputGroup,
  PopoverArrow,
  DrawerHeader,
  DrawerOverlay,
  PopoverFooter,
  PopoverHeader,
  DrawerContent,
  useDisclosure,
  PopoverTrigger,
  PopoverContent,
  InputLeftElement,
  DrawerCloseButton,
  PopoverCloseButton,
  useColorModeValue,
} from '@chakra-ui/react'
import {
  IoCash,
  IoHelpBuoySharp,
  IoAirplaneSharp,
  IoCarSportSharp,
} from 'react-icons/io5'
import { FcDocument } from 'react-icons/fc'
import { FaBoxes, FaSearch, FaUserAlt, FaAlignJustify } from 'react-icons/fa'

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
  const btnRef = useRef()
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const background = useColorModeValue('gray.300', 'gray.700')

  const handleLogout = async () => {
    const request = await fetcher('/api/logout', { method: 'POST' })

    if (request.status === httpStatus.HTTP_202_ACCEPTED) {
      return router.push('/login')
    }
  }

  return (
    <Flex
      boxShadow="lg"
      padding="10px 20px"
      background={background}
      justifyContent="space-between"
    >
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
      <Flex flex="1" p="0 100px">
        <InputGroup>
          <InputLeftElement>
            <Icon color="blue.400" w="5" h="5" as={FaSearch} />
          </InputLeftElement>
          <Input
            type="text"
            rounded="full"
            variant="filled"
            placeholder="Buscar..."
          />
        </InputGroup>
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
        size="xs"
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
                  <NextLink key={route.name} href={route.path}>
                    <Button
                      mb="4"
                      rounded="full"
                      colorScheme="blue"
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
