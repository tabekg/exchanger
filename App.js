import React, {createContext, useEffect, useState} from 'react';
import {StyleSheet, Text, View,} from 'react-native';
import WelcomeScreen from './src/screens/WelcomeScreen'
import {NavigationContainer} from '@react-navigation/native'
import AuthForgotPass from "./src/components/AuthForgotPass";
import HomeScreen from './src/screens/HomeScreen'
import AuthRegistration from './src/components/AuthRegistration'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import Notifications from "./src/pages/Notifications"
import AsyncStorage from '@react-native-async-storage/async-storage'
import {ActivityIndicator} from "react-native-paper";
import axios from "axios";
import {API_URL} from './src/settings/settings'

export const GlobalContext = createContext({})

const App = () => {
    const Stack = createNativeStackNavigator();

    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchUser()
    }, [])

    const fetchUser = () => {
        AsyncStorage.getItem('user_data').then(res => {
            if (!res) {
                setLoading(false)
                return
            }
            const data = JSON.parse(res)
            axios.get(API_URL + '/api/v1/auth/me', {
                headers: {
                    'Authorization': `Bearer ${data.token}`,
                }
            }).then(r => {
                setLoading(false)
                setUser(r.data.payload.user)
            }).finally(() => {
                setLoading(false)
            })
        })
    }

    const signIn = data => {
        AsyncStorage.setItem('user_data', JSON.stringify(data)).then(() => {
            setToken(data.token)
            setUser(data.user)
        })
    }

    const signOut = () => {
        AsyncStorage.removeItem('user_data').then(() => {
            setUser(null)
            setToken(null)
        })
    }

    return (
        <GlobalContext.Provider value={{
            user, setUser, token, setToken, signIn,
            signOut
        }}>
            {loading ? (
                <View style={{
                    width: '100%',
                    height: '100%',
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: '#272B34',
                }}>
                    <ActivityIndicator color={'#fff'}/>
                    <Text style={{color: '#fff', marginTop: 10}}>?????????????????? ????????????????????</Text>
                </View>
            ) : (
                <>
                    {user ? (
                        <NavigationContainer>
                            <Stack.Navigator initialRouteName="homeScreen">
                                <Stack.Screen
                                    name="homeScreen"
                                    component={HomeScreen}
                                    options={{headerShown: false, title: 'Home'}}
                                />
                                <Stack.Screen
                                    name="Notifications"
                                    component={Notifications}
                                    options={{title: '??????????????????????'}}
                                />
                            </Stack.Navigator>
                        </NavigationContainer>
                    ) : (
                        <NavigationContainer>
                            <Stack.Navigator initialRouteName="WelcomeScreen">
                                <Stack.Screen
                                    name="WelcomeScreenHome"
                                    component={WelcomeScreen}
                                    options={{headerShown: false}}
                                />
                                <Stack.Screen
                                    name="AuthForgotPass"
                                    component={AuthForgotPass}
                                    options={{title: '???????????? ?????????????'}}
                                />
                                <Stack.Screen
                                    name="AuthRegistrationScreen"
                                    component={AuthRegistration}
                                    options={{title: '???????????????? ???????????????? Test'}}
                                />
                            </Stack.Navigator>
                        </NavigationContainer>
                    )}
                </>
            )}
        </GlobalContext.Provider>
    );
};

const styles = StyleSheet.create({});

export default App;
