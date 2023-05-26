import { useState } from 'react'

import { Platform } from 'react-native'

import { useNavigation } from '@react-navigation/native'

import { useAuth } from '@hooks/useAuth'

import { AuthNavigatorRoutesProps } from '@routes/auth.routes'

import { useForm, Controller } from 'react-hook-form'

import { AppError } from '@utils/AppError'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { VStack, Image, Center, Text, Heading, ScrollView, useToast } from 'native-base'

import { Input } from '@components/Input'

import BackgroundImg from '@assets/background.png'

import LogoSvg from '@assets/logo.svg'
import { Button } from '@components/Button'

type FormDataProps = {
  email: string;
  password: string;
}

const singInSchema = yup.object({
  email: yup.string().required('Informe o email').email('email invalido'),
  password: yup.string().required('Informe a senha').min(6, 'A senha deve ter pelo menos 6 dígitos'),
})

export function SingIn() {
  const [isLoading, setIsLoading] = useState(false)

  const { singIn, user} = useAuth()

  const toast = useToast()

  const { control, handleSubmit, formState: {errors} } = useForm<FormDataProps>({
    resolver: yupResolver(singInSchema)
  });

  const navigation = useNavigation<AuthNavigatorRoutesProps>()


  function handleNewAccount() {
    navigation.navigate('singUp')
  }

  async function handleSingIn({ email, password }: FormDataProps){
    try {
      setIsLoading(true)
      await singIn(email, password);
    } catch(error){
      const isAppError = error instanceof AppError

      const title = isAppError ? error.message : 'Nao foi possível fazer login'

      toast.show({
        title,
        placement: 'top',
        bgColor: "red.500"
      })
    } finally {
      setIsLoading(false)
    }
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
            Acesse sua conta
          </Heading>

          <Controller 
            control={control}
            name='email'
            render={({field: { onChange, value }}) => (
              <Input 
                placeholder="E-mail"
                keyboardType='email-address'
                autoCapitalize='none'
                onChangeText={onChange}
                value={value}
                errorMessage={errors.email?.message}
              />
            )}
          />
          
          <Controller 
            control={control}
            name='password'
            render={({field: { onChange, value}}) => (
              <Input 
                placeholder="Senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
                onSubmitEditing={handleSubmit(handleSingIn)}
                returnKeyType='send'

              />
            )}
          />
          
          <Button 
            title="Acessar"
            onPress={handleSubmit(handleSingIn)}
            isLoading={isLoading}
          />
        </Center>

        <Center mt={10}>
          <Text 
            color="gray.100"
            fontSize="sm"
            mb={3}
            fontFamily="body"
          >
            Ainda não tem acesso?
          </Text>

          <Button 
            title="Criar conta"
            variant="outline"
            onPress={handleNewAccount}
          />
        </Center>

      </VStack>
    </ScrollView>

  )
}