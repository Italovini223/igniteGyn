import { useState } from 'react'

import { Center, ScrollView, VStack, Skeleton, Text, Heading, useToast} from 'native-base'

import { Controller, useForm} from 'react-hook-form'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { useAuth } from '@hooks/useAuth'

import { api } from '@services/api'

import { AppError } from '@utils/AppError'

import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'

import userPhotoDefault from '@assets/userPhotoDefault.png'

import { FileInfo } from 'expo-file-system'

import { ScreenHeader } from '@components/ScreenHeader'
import { UserPhoto } from '@components/UserPhoto'
import { TouchableOpacity } from 'react-native'
import { Input } from '@components/Input'
import { Button } from '@components/Button'

const PHOTO_SIZE = 33

type FormDataProps = {
  name: string;
  email: string;
  oldPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}

const profileSchema = yup.object({
  name: yup.string().required("Informe o nome"),
  oldPassword: yup.string(),
  newPassword: yup.string().min(6, "A senha deve ter pelo menos 6 dígitos").nullable().transform((value) => !!value ? value: null),
  newPasswordConfirm: yup.string().nullable().transform((value) => !!value ? value : null).oneOf([yup.ref("newPassword")], 'As senhas sao diferentes').when("newPassword", {
    is: (Field: any) => Field,
    then: (Schema) => Schema.nullable().required("Confirme a senha").transform((value) => !!value ? value : null)
  })
})

export function Profile(){
  const [isLoading, setIsLoading] = useState(false);
  const [photoIsLoading, setPhotoIsLoading] = useState(false)
  const [userPhoto, setUserPhoto] = useState()


  const { user, updateUserProfile } = useAuth()
  const toast = useToast();
  const { control, handleSubmit, formState: {errors} } = useForm<FormDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
    resolver: yupResolver(profileSchema)
  });

  async function handleUserPhotoSelect(){
    setPhotoIsLoading(true)
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      })
  
      if(photoSelected.canceled){
        return
      }
      
      if(photoSelected.assets[0].uri){

        const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri) as FileInfo
    

        if(photoInfo.size && (photoInfo.size / 1024 / 1024) > 5){

          toast.show({
            title: "Essa imagem e muito grande. Escolha uma ate 5MB",
            placement: 'top',
            bgColor: 'red.500'
          })

          return 
        }

        const fileExtension = photoSelected.assets[0].uri.split('.').pop()

        const photoFile = {
          name: `${user.name}.${fileExtension}`.toLocaleLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`
        } as any

        const userPhotoUploadForm = new FormData()
        userPhotoUploadForm.append('avatar', photoFile)

        const avatarUpdatedResponse = await api.patch('/users/avatar', userPhotoUploadForm, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        const userUpdated = user;
        userUpdated.avatar = avatarUpdatedResponse.data.avatar
        updateUserProfile(userUpdated)

        toast.show({
          title: 'Foto atualizada!',
          placement: 'top',
          bgColor: 'green.500'
        })

      }

    } catch (error) {
      console.log(error)
    } finally {
      setPhotoIsLoading(false)
    }
  }

  async function handleProfileUpdate({ name, oldPassword, newPassword }: FormDataProps){
    try {
      setIsLoading(true)

      const userUpdated = user
      userUpdated.name = name

      await api.put('/users', {
        name,
        password: newPassword,
        old_password: oldPassword
      })

      await updateUserProfile(userUpdated)

      toast.show({
        title: 'Perfil atualizado com sucesso',
        placement: 'top',
        bgColor: 'green.500'
      })

    } catch (error) {
      const isAppError = error instanceof AppError

      const title = isAppError ? error.message : 'Não  foi possível atualizar os dados, tente mais tarde'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title='Perfil'/>

      <ScrollView contentContainerStyle={{ paddingBottom: 36}}>
        <Center mt={6} px={10}>
          {
            photoIsLoading ?
            <Skeleton 
              w={PHOTO_SIZE}
              h={PHOTO_SIZE}
              rounded="full"
              startColor="gray.500"
              endColor="gray.400"
            />
            :
            <UserPhoto 
              source={
                user.avatar ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}`} : userPhotoDefault
              }
              alt='Foto do usuário'
              size={PHOTO_SIZE}
            />

          }
          
          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text 
              color="green.500" 
              fontWeight="bold" 
              fontSize="md"
              mt={2}
              mb={8}
            >
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Controller 
            control={control}
            name='name'
            render={({ field: { onChange, value}}) => (
              <Input 
                placeholder='Nome'
                bg="gray.600"
                value={value}
                onChangeText={onChange}
                errorMessage={errors.name?.message}
              />
            )}
          />

         <Controller 
            control={control}
            name='email'
            render={({field: { value }}) => (
              <Input 
                placeholder='email'
                bg="gray.600"
                isDisabled
                value={value}
                errorMessage={errors.email?.message}
              />    
            )}
         />

        
          <Heading 
            color="gray.200" 
            fontSize="md" 
            fontFamily="heading"
            mb={2} 
            alignSelf="flex-start" 
            mt={12}
          >
            Alterar senha
          </Heading>
          
          <Controller 
            control={control}
            name='oldPassword'
            render={({field: { onChange }}) => (
              <Input 
                placeholder='Senha antiga'
                bg="gray.600"
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.oldPassword?.message}
              />
            )}
          
          />

          <Controller 
            control={control}
            name='newPassword'
            render={({field: { onChange }}) => (
              <Input 
                placeholder='Nova senha'
                bg="gray.600"
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.newPassword?.message}
              />
            )}
          />


          <Controller 
            control={control}
            name='newPasswordConfirm'
            render={({field: { onChange }}) => (
              <Input 
                placeholder='Confirme a nova senha'
                bg="gray.600"
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.newPasswordConfirm?.message}
              />
            )}
          />

          <Button 
            title='Atualizar'
            mt={4}
            onPress={handleSubmit(handleProfileUpdate)}
            isLoading={isLoading}
          />
        </Center>
      </ScrollView>
    </VStack>
  )
}