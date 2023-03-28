import { Platform } from 'react-native'

import { useNavigation } from '@react-navigation/native'

import { VStack, Image, Center, Text, Heading, ScrollView, } from 'native-base'

import BackgroundImg from '@assets/background.png'
import LogoSvg from '@assets/logo.svg'

import { Input } from '@components/Input'
import { Button } from '@components/Button'


export function SingUp() {

  const navigation = useNavigation()

  function handleGoBack(){
    navigation.goBack()
  }

  return (
    <ScrollView 
      contentContainerStyle={{flexGrow: 1}}
      showsVerticalScrollIndicator={false}
    >
      <VStack 
        flex={1} 
        px={10} 
        pb={Platform.OS === 'ios' ? 40 : 16}
      >
        <Image 
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt="Pessoas treinando na academia"
          resizeMode='contain'
          position="absolute"
        />

        <Center my={24}>
          <LogoSvg />

          <Text color="gray.100" fontSize="sm">
            Treine sua mente e o seu corpo
          </Text>
        </Center>

        <Center>
          <Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
            Crie sua conta
          </Heading>

          <Input 
            placeholder="Nome"
          />

          <Input 
            placeholder="E-mail"
          />

          <Input 
            placeholder="Senha"
            secureTextEntry
          />
          
          <Button 
            title="Criar e acessar"
          />
        </Center>

        <Button 
          mt={5}
          title="Voltar para o login"
          variant="outline"
          onPress={handleGoBack}
        />


      </VStack>
    </ScrollView>

  )
}