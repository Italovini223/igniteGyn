import { StatusBar } from 'react-native';
import { Roboto_400Regular, Roboto_700Bold, useFonts} from '@expo-google-fonts/roboto'

import { NativeBaseProvider} from 'native-base'

import { THEME } from './src/theme';

import { Routes } from './src/routes'

import { Loading } from '@components/Loading'

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold
  })

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar 
        barStyle='light-content'
        backgroundColor='transparent'
        translucent
      />
      {
        fontsLoaded ? 
        <Routes />
        :
        < Loading/>
      }
    </NativeBaseProvider>
  )
}


