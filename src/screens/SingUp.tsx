import { Platform } from 'react-native'

import { useNavigation } from '@react-navigation/native'

import { useForm, Controller } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { VStack, Image, Center, Text, Heading, ScrollView } from 'native-base'

import BackgroundImg from '@assets/background.png'
import LogoSvg from '@assets/logo.svg'

import { Input } from '@components/Input'
import { Button } from '@components/Button'

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  password_confirm: string;
}

const singUpSchema = yup.object({
  name: yup.string().required('Informe o nome'),
  email: yup.string().required('Informe o email').email('E-mail invalido'),
  password: yup.string().required('Informe a senha').min(6, 'A senha deve ter pelo menos 6 dígitos'),
  password_confirm: yup.string().required('Confirme a senha').oneOf([yup.ref('password')], 'Digite a mesma senha')
})

export function SingUp() {

  const { control, handleSubmit, formState:{errors} } = useForm<FormDataProps>({
    resolver: yupResolver(singUpSchema)
  })

  const navigation = useNavigation()

  function handleGoBack(){
    navigation.goBack()
  }

  function handleSingUp({ email, name, password, password_confirm }: FormDataProps){
    console.log()
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

          <Controller 
            control={control}
            name='name'
            render={({ field: { onChange, value }}) => (
              <Input 
                placeholder="Nome"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />
          <Controller 
            control={control}
            name='email'
            render={({ field: { onChange, value}}) => (
              <Input 
                placeholder="E-mail"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.email?.message}
              />
            )}
          />


          <Controller 
            control={control}
            name='password'
            render={({ field: { onChange, value}}) => (
              <Input 
                placeholder="Senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Controller 
            control={control}
            name='password_confirm'
            render={({ field: { onChange, value }}) => (
              <Input 
                placeholder="Confirmar a senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password_confirm?.message}
                onSubmitEditing={handleSubmit(handleSingUp)}
                returnKeyType='send'
              />
            )}
          />
          
          <Button 
            title="Criar e acessar"
            onPress={handleSubmit(handleSingUp)}
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