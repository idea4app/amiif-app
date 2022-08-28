import { Icon, Flex, Text, Switch, useColorMode } from '@chakra-ui/react'
import { FaSun, FaMoon } from 'react-icons/fa'

export default function Footer() {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <Flex padding="10px 20px" justifyContent="space-between">
      <Text fontSize="xs">
        AMIFFF @ Derechos reservados {new Date().getFullYear()}
      </Text>
      <Flex>
        {(colorMode === 'dark' && <Icon w="5" h="5" as={FaSun} />) || (
          <Icon w="5" h="5" as={FaMoon} color="gray.500" />
        )}
        <Switch
          ml="3"
          onChange={toggleColorMode}
          isChecked={colorMode === 'dark'}
        />
      </Flex>
    </Flex>
  )
}
