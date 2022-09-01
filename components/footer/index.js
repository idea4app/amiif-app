import { Icon, Flex, Text, Switch, useColorMode } from '@chakra-ui/react'
import { TbSun, TbMoon } from 'react-icons/tb'

export default function Footer() {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <Flex borderTopWidth="2px" padding="20px 0">
      <Flex
        width="100%"
        padding="0 50px"
        margin="0 auto"
        maxWidth="1200px"
        justifyContent="space-between"
      >
        <Text fontSize="xs">
          {'AMIIF y sus sitios son marcas registradas de AMIIF, Inc. © '}
          {new Date().getFullYear()}
        </Text>
        <Flex>
          {(colorMode === 'dark' && <Icon w="5" h="5" as={TbSun} />) || (
            <Icon w="5" h="5" as={TbMoon} color="gray.500" />
          )}
          <Switch
            ml="3"
            onChange={toggleColorMode}
            isChecked={colorMode === 'dark'}
          />
        </Flex>
      </Flex>
    </Flex>
  )
}
