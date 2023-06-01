import { useState, useEffect, useCallback } from 'react'

import { HStack, VStack, FlatList, Heading, Text, useToast  } from 'native-base'

import { api } from '@services/api'

import { ExerciseDto } from '@dtos/ExerciseDto'

import { AppError } from '@utils/AppError'

import { useNavigation, useFocusEffect } from '@react-navigation/native'

import { AppNavigatorRoutesProps } from '@routes/app.routes'

import { Group } from '@components/Group'
import { HomeHeader } from '@components/HomeHeader'
import { ExerciseCard } from '@components/ExerciseCard'
import { Loading } from '@components/Loading'

export function Home(){
  const [groupSelected, setGroupSelected] = useState('antebraço')
  const [groups, setGroups] = useState<string[]>([])
  const [exercises,setExercises] = useState<ExerciseDto[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const navigation = useNavigation<AppNavigatorRoutesProps>()

  const toast = useToast()

  async function fetchGroups(){
    try {
      const response = await api.get('/groups')
      setGroups(response.data)
    } catch(error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Nao foi possível listar os grupos de exercícios'
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    }
  }

  async function fetchExercisesByGroup(){
    try {
      setIsLoading(true)

      const response = await api.get(`/exercises/byGroup/${groupSelected}`)
      setExercises(response.data)
    } catch(error){
      const isAppError = error instanceof AppError

      const title = isAppError ? error.message : 'Nao foi possível listar os exercícios'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }
  }

  function handleOpenExerciseDetails(exerciseId: string){
    navigation.navigate('exercise', {
      exerciseId
    })
  }

  useEffect(() => {
    fetchGroups()
  }, [])
  
  useFocusEffect(useCallback(() => {
    fetchExercisesByGroup()
  }, [groupSelected]))

  return (
    <VStack flex={1}>
      <HomeHeader />

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        _contentContainerStyle={{px: 8}}
        my={10}
        maxH={10}
        minH={10}
        data={groups}
        keyExtractor={item => item}
        renderItem={({item}) => (
          <Group 
            name={item}
            isActive={String(groupSelected).toLocaleUpperCase() === String(item).toLocaleUpperCase()}
            onPress={() => setGroupSelected(item)}
          />
        )}

      />

      {

        isLoading ? <Loading /> 

        :

        <VStack flex={1} px={4} >
          <HStack justifyContent="space-between" mb={5}>
            <Heading color="gray.200" fontSize="md" fontFamily="heading">
              Exercícios
            </Heading>

            <Text color="gray.200" fontSize="sm">
              {exercises.length}
            </Text>
          </HStack>

          <FlatList 
            data={exercises}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <ExerciseCard 
                onPress={() => handleOpenExerciseDetails(item.id)}
                data={item}
              />
            )}
            ListEmptyComponent={() => (
              <Text color="gray.100" textAlign="center">
                Nao ha exercícios registrados ainda.{'\n'}
                Vamos fazer exercícios hoje?
              </Text>
            )}
            contentContainerStyle={[].length === 0 && {flex: 1, justifyContent: "center"}}
            showsVerticalScrollIndicator={false}
             _contentContainerStyle={{paddingBottom: 20}}
          />

        </VStack>

      }
    </VStack>
  )
}