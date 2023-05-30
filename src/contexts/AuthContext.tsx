import { ReactNode, createContext, useState, useEffect } from 'react'

import { UserDto } from '@dtos/UserDto'

import { api } from '@services/api'

import { storageUserSave, storageUserGet, storageUserRemove } from '@storage/storageUser'
import { storageAuthTokenSave, storageAuthTokenGet, storageAuthTokenRemove } from '@storage/storageAuthToken'


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

  async function UserAndTokenUpdate(userData: UserDto, token: string){
    try {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(userData)

    } catch (error) {
      throw error
    }
  }

  async function storageUserAndTokenSave(user: UserDto, token: string) {
    try {
      setIsLoadingUserStorageData(true)

      await storageUserSave(user)
      await storageAuthTokenSave(token)

    } catch (error) {
      throw error

    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  async function singIn(email: string, password: string){
    try {
      const { data } = await api.post('/sessions', {
        email,
        password
      })

      if(data.user && data.token){
        await UserAndTokenUpdate(data.user, data.token)
        await storageUserAndTokenSave(data.user, data.token)
      }
    } catch (error) {
      throw error
    }
  }

  async function loadUserData(){
    try {
      setIsLoadingUserStorageData(true)

      const userLogged = await storageUserGet()
      const token = await storageAuthTokenGet()
  
      if( token && userLogged){
        await UserAndTokenUpdate(userLogged, token)
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
      await storageAuthTokenRemove()

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