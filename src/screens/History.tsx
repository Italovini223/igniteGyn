import { useCallback, useState } from 'react'

import { api } from '@services/api'

import { AppError } from '@utils/AppError'

import { HistoryByDayDTO } from '@dtos/HistoryByDay'

import { useFocusEffect } from '@react-navigation/native'

import { Heading, VStack, SectionList, useToast, Text, } from 'native-base'

import { HistoryCard } from '@components/HistoryCard'
import { ScreenHeader } from '@components/ScreenHeader'
import { Loading } from '@components/Loading'


export function History(){
  const [isLoading, setIsLoading] = useState(true)
  const [exercises, setExercises] = useState<HistoryByDayDTO[]>([])

  const toast = useToast()

  async function fetchHistory(){
    try {
      setIsLoading(true)

      const response = await api.get('/history');

      setExercises(response.data);
    } catch(error){
      const isAppErro = error instanceof AppError

      const title = isAppErro ? error.message : 'Nao foi possível carregar o histórico de exercício';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }
  }

  useFocusEffect(useCallback(() => {
    fetchHistory()
  }, []))

  return (
    <VStack flex={1}>
      <ScreenHeader 
        title="Histórico de Exercícios"
      />

      {
        isLoading ? <Loading /> :
        <SectionList 
          sections={exercises}
          keyExtractor={item => item.id}
          renderSectionHeader={({ section }) => (
            <Heading color="gray.200" fontSize="md" mt={10} mb={3} fontFamily="heading">
              {section.title}
            </Heading>
          )}
          renderItem={({ item }) => (
            <HistoryCard 
              data={item}
            />
          )}
          px={8}
          contentContainerStyle={exercises.length === 0 && { flex: 1, justifyContent: 'center'}}
          ListEmptyComponent={() => (
            <Text color="gray.100" textAlign="center">
              Não há exercícios registrados ainda. {'\n'}
              Vamos fazer exercícios hoje?
            </Text>
          )}
        />

      }


    </VStack>
  )
}