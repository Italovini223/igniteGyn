import { useState } from 'react'


import { Heading, VStack, SectionList } from 'native-base'

import { HistoryCard } from '@components/HistoryCard'
import { ScreenHeader } from '@components/ScreenHeader'

export function History(){
  const [exercises, setExercises] = useState([
    {
      title: '26.08.22',
      data: ['Puxada frontal', 'Remada unilateral'],
    },
    {
      title: '27.08.22',
      data: ['puxada frontal']
    }
  ])

  return (
    <VStack flex={1}>
      <ScreenHeader 
        title="Histórico de Exercícios"
      />

      <SectionList 
        sections={exercises}
        keyExtractor={(item, index) => item + index}
        renderSectionHeader={({ section }) => (
          <Heading color="gray.200" fontSize="md" mt={10} mb={3} fontFamily="heading">
            {section.title}
          </Heading>
        )}
        renderItem={({ item }) => (
          <HistoryCard />
        )}
        px={4}
      />

    </VStack>
  )
}