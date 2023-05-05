import { useState } from 'react'

import { HStack, VStack, FlatList, Heading, Text  } from 'native-base'

import { useNavigation } from '@react-navigation/native'

import { AppNavigatorRoutesProps } from '@routes/app.routes'

import { Group } from '@components/Group'
import { HomeHeader } from '@components/HomeHeader'
import { ExerciseCard } from '@components/ExerciseCard'

export function Home(){
  const [groupSelected, setGroupSelected] = useState('costa')
  const [groups, setGroups] = useState(['costa', 'ombro', 'biceps', 'triceps'])
  const [exercises,setExercises] = useState(['Puxada frontal', 'Remada curvada', 'Remada unilateral', 'Levantamento terra'])

  const navigation = useNavigation<AppNavigatorRoutesProps>()

  function handleOpenExerciseDetails(){
    navigation.navigate('exercise')
  }

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

      <VStack flex={1} px={4} >
        <HStack justifyContent="space-between" mb={5}>
          <Heading color="gray.200" fontSize="md">
            Exercícios
          </Heading>

          <Text color="gray.200" fontSize="sm">
            {exercises.length}
          </Text>
        </HStack>

       <FlatList 
          data={exercises}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <ExerciseCard 
              onPress={handleOpenExerciseDetails}
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
    </VStack>
  )
}