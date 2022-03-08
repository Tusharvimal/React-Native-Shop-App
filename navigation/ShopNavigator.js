import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { Platform, SafeAreaView, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import ProductOverviewScreen from "../screens/shop/ProductsOverviewScreen";
import ProductDetailScreen from "../screens/shop/ProductDetailScreen";
import CartScreen from "../screens/shop/CartScreen";
import OrderScreen from "../screens/shop/OrdersScreen";
import Colors from "../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import UserProductsScreen from '../screens/user/UserProductsScreen';
import AuthScreen from '../screens/user/AuthScreen'
import EditProductScreen from '../screens/user/EditProductScreen';
import { useSelector, useDispatch } from 'react-redux';
import StartUpScreen from '../screens/StartUpScreen'
import * as authActions from '../store/actions/auth'

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const defaultNavOptions = {
    headerStyle: {
        backgroundColor: Platform.OS === 'android' ? Colors.primary : ''
    },
    headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary,
    headerTitleStyle: {
        fontFamily: 'open-sans-bold'
    },
    headerBackTitleStyle: {
        fontFamily: 'open-sans'
    }
}

const ProductsNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={defaultNavOptions}
        >
            <Stack.Screen
                name='ProductsOverview'
                component={ProductOverviewScreen}
                options={{
                    title: 'All Products'
                }}
            />
            <Stack.Screen
                name='ProductDetail'
                component={ProductDetailScreen}
                options={({ route }) => ({
                    headerTitle: route.params.title
                })}
            />
            <Stack.Screen
                name='Cart'
                component={CartScreen}
                options={{
                    title: 'Your Cart'
                }}
            />
        </Stack.Navigator>
    )
}

const OrdersNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={defaultNavOptions}
        >
            <Stack.Screen
                name='OrdersScreen'
                component={OrderScreen}
                options={{
                    title: 'Your Orders'
                }}
            />
        </Stack.Navigator>
    )
}

const AdminNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={defaultNavOptions}
        >
            <Stack.Screen
                name='UserProducts'
                component={UserProductsScreen}
                options={{
                    title: 'Your Products'
                }}
            />
            <Stack.Screen
                name='EditProduct'
                component={EditProductScreen}
                options={({ route }) => ({
                    title: (route.params !== undefined && route.params.productId !== undefined) ? 'Edit Product' : 'Add Product',
                })}
            />
        </Stack.Navigator>
    )
}

const AuthNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={defaultNavOptions}
        >
            <Stack.Screen
                name='StartupScreen'
                component={StartUpScreen}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name='Authenticate'
                component={AuthScreen}
            />
        </Stack.Navigator>
    )
}

const ShopNavigator = () => {
    const isSignedIn = useSelector(state => state.auth.token)
    console.log(isSignedIn)
    const dispatch = useDispatch()
    return (
        <NavigationContainer>
            <Drawer.Navigator
                screenOptions={{
                    headerShown: false,
                    drawerActiveTintColor: Colors.primary,
                    drawerLabelStyle: {
                        fontFamily: 'open-sans-bold'
                    }
                }}

                drawerContent={props => {
                    return (
                        <DrawerContentScrollView>
                            <DrawerItemList {...props} />
                            <DrawerItem label="Logout"
                                icon={() => (
                                    <Ionicons color={Colors.primary} size={23} name='log-out-outline' />
                                )}
                                labelStyle={{
                                    fontFamily: 'open-sans-bold'
                                }} onPress={() => {
                                    dispatch(authActions.logout())
                                }} />
                        </DrawerContentScrollView>
                    )
                }}
            >
                {isSignedIn ? (
                    <>
                        <Drawer.Screen
                            name="Products"
                            component={ProductsNavigator}
                            options={{
                                drawerIcon: () => (
                                    <Ionicons
                                        name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
                                        size={23}
                                        color={Colors.primary}
                                    />
                                )
                            }}
                        />
                        <Drawer.Screen
                            name="Orders"
                            component={OrdersNavigator}
                            options={{
                                drawerIcon: () => (
                                    <Ionicons
                                        name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
                                        size={23}
                                        color={Colors.primary}
                                    />
                                )
                            }}
                        />
                        <Drawer.Screen
                            name="Admin"
                            component={AdminNavigator}
                            options={{
                                drawerIcon: () => (
                                    <Ionicons
                                        name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
                                        size={23}
                                        color={Colors.primary}
                                    />
                                )
                            }}
                        />
                    </>
                ) :
                    (
                        <>
                            <Drawer.Screen
                                name='Startup'
                                component={AuthNavigator}
                                options={{
                                    swipeEnabled: false
                                }}
                            />
                        </>
                    )
                }
            </Drawer.Navigator>
        </NavigationContainer>
    )
}

export default ShopNavigator