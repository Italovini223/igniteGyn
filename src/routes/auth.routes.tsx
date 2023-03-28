import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';

import { SingIn } from '@screens/SingIn'
import { SingUp } from '@screens/SingUp'

type AuthRoutes = {
  singIn: undefined;
  singUp: undefined;
}

export type AuthNavigatorRoutesProps = NativeStackNavigationProp<AuthRoutes>

const { Navigator, Screen } = createNativeStackNavigator<AuthRoutes>();

export function AuthRoutes(){
  return (
    <Navigator screenOptions={{headerShown: false}}>
      <Screen 
        name="singIn"
        component={SingIn}
      />

      <Screen 
        name="singUp"
        component={SingUp}
      />
    </Navigator>
  )
}