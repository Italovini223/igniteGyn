import { ReactNode, createContext, useState, useEffect } from 'react'
import { UserDto } from '@dtos/UserDto'
import { api } from '@services/api'
import { storageUserSave, storageUserGet, storageUserRemove } from '@storage/storageUser'


export type AuthContextDataProps = {
  user: UserDto;
  singIn: (email: string, password: string) => Promise<void>;
  singOut: () => Promise<void>;
  isLoadingUserStorageData: boolean;

}

type AuthContextProviderProps = {
  children: ReactNode;

}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps)

export function AuthContextProvider({ children }: AuthContextProviderProps){
  const [user, setUser] = useState<UserDto>({} as UserDto) 
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true)


  async function singIn(email: string, password: string){
    try {
      const { data } = await api.post('/sessions', {
        email,
        password
      })

      if(data.user){
        setUser(data.user)
        storageUserSave(data.user)
      }
    } catch (error) {
      throw error
    }
  }

  async function loadUserData(){
    try {
      const userLogged = await storageUserGet()
  
      if(userLogged){
        setUser(userLogged)
        setIsLoadingUserStorageData(false)
      }
      
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  async function singOut(){
    try {
      setIsLoadingUserStorageData(true)
      await storageUserRemove()

      setUser({} as UserDto)
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  useEffect(() => {
    loadUserData()
  }, [])
   
  return (
    <AuthContext.Provider value={{
      user,
      singIn,
      isLoadingUserStorageData,
      singOut
    }}>
    { children }
    </AuthContext.Provider>
  )
}