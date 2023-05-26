import { StatusBar } from 'react-native';
import { Roboto_400Regular, Roboto_700Bold, useFonts} from '@expo-google-fonts/roboto'

import { AuthContext } from '@contexts/AuthContext'

import { NativeBaseProvider} from 'native-base'

import { THEME } from './src/theme';

import { AuthContextProvider } from '@contexts/AuthContext'

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
      <AuthContextProvider >
        { fontsLoaded ? <Routes /> : < Loading/> }
      </AuthContextProvider>
        
    </NativeBaseProvider>
  )
}


