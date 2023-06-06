import { useState, useEffect } from 'react'

import { TouchableOpacity } from 'react-native'
import { HStack, Heading, Icon, Text, VStack, Image, Box, ScrollView, useToast } from 'native-base'

import { AppNavigatorRoutesProps } from '@routes/app.routes'
import { ExerciseDto} from '@dtos/ExerciseDto'
import { api } from '@services/api'

import { AppError } from '@utils/AppError'

import { Feather } from '@expo/vector-icons'

import { useNavigation, useRoute } from '@react-navigation/native'

import BodySvg from '@assets/body.svg'
import SerieSvg from '@assets/series.svg'
import RepetitisionsSvg from '@assets/repetitions.svg'
import { Button } from '@components/Button'
import { Loading } from '@components/Loading'

type RouteParams = {
  exerciseId: string;
}

export function Exercise(){
  const [exercise, setExercise] = useState<ExerciseDto>({} as ExerciseDto)
  const [isLoading, setIsLoading] = useState(true)
  const [sendingRegister, setSendingRegister] = useState(false)

  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const route = useRoute()
  const toast = useToast()

  const { exerciseId } = route.params as RouteParams

  function handleGoBack(){
    navigation.goBack()
  }

  async function fetchExerciseDetails(){
    try {
      setIsLoading(true)

      const response = await api.get(`/exercises/${exerciseId}`)
      setExercise(response.data)

    } catch (error) {
      const isAppErro = error instanceof AppError

      const title = isAppErro ? error.message : 'Nao foi possivel carregar o exercicio'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleExerciseHistoryRegister(){
    try {
      setSendingRegister(true)

      await api.post('/history', {
        exercise_id: exerciseId
      })

      toast.show({
        title: 'Parabéns! exercício registrado no seu histórico',
        placement: 'top',
        bgColor: 'green.700'
      })

    } catch (error) {
      const isAppErro = error instanceof AppError

      const title = isAppErro ? error.message : 'Nao foi possivel registrar o exercicio'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setSendingRegister(false)
    }
  }

  useEffect(() => {
    fetchExerciseDetails()
  }, [exerciseId])

  return (
    <VStack flex={1}>

      <VStack
        px={8}
        bg="gray.600"
        pt={12}
      >
        <TouchableOpacity onPress={handleGoBack}>
          <Icon 
            as={Feather}
            name='arrow-left'
            color="green.500"
            size={6}
          />
        </TouchableOpacity>
        <HStack 
          justifyContent="space-between" 
          mt={4} mb={8} 
          alignItems="center"
        >
          <Heading 
            color="gray.100" 
            fontSize="lg"
            flexShrink={1}
            fontFamily="heading"
            >
            {exercise.name}
          </Heading>

          <HStack alignItems="center">
            <BodySvg />
            <Text color="gray.200" ml={1} textTransform="capitalize">
              {exercise.group}
            </Text>
          </HStack>
        </HStack>
      </VStack>

      {
        isLoading ? <Loading /> 
        :
        <ScrollView showsVerticalScrollIndicator={false}>

          <VStack p={8}>
            <Box rounded='lg' mb={3} overflow='hidden'>
              <Image 
                w="full"
                h="80"
                source={{uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}`}}
                alt={exercise.name}
                resizeMode='cover'
              />
            </Box>

            <Box bg="gray.600" rounded="md" pb={4} px={4}>
              <HStack alignItems="center" justifyContent="space-around" mb={6} mt={5}>
                <HStack>
                  <SerieSvg />
                  <Text color="gray.200" ml={2}>
                    {exercise.series} séries
                  </Text>
                </HStack>

                <HStack>
                  <RepetitisionsSvg />
                  <Text color="gray.200" ml={2}>
                    {exercise.repetitions} repetições
                  </Text>
                </HStack>
              </HStack>
              <Button 
                title='Marcar como realizado'
                onPress={handleExerciseHistoryRegister} 
                isLoading={sendingRegister}
              />
            </Box>
          </VStack>
        </ScrollView>

      }

    </VStack>
  )
}