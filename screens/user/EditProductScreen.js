import React, { useState, useCallback, useEffect, useReducer } from 'react';
import { View, ScrollView, StyleSheet, Platform, Alert, ActivityIndicator } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';
import HeaderButton from '../../components/UI/HeaderButton';
import Input from '../../components/UI/Input';
import Colors from '../../constants/Colors';
import * as productsActions from '../../store/actions/products'

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE'

const formReducer = (state, action) => {
    if (action.type === FORM_INPUT_UPDATE) {
        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value,
        };
        const updatedValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid
        }
        let updatedFormIsValid = true;
        for (const key in updatedValidities) {
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key]
        }
        return {
            formIsValid: updatedFormIsValid,
            inputValidities: updatedValidities,
            inputValues: updatedValues
        }
    }
    return state;
}

const EditProductScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    let editedProduct;
    if (props.route.params) {
        if (props.route.params.productId) {
            const prodId = props.route.params.productId
            editedProduct = useSelector(state => state.products.userProducts.find(prod => prod.id === prodId))
        }
    }
    const dispatch = useDispatch()

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            title: editedProduct ? editedProduct.title : '',
            imageUrl: editedProduct ? editedProduct.imageUrl : '',
            description: editedProduct ? editedProduct.description : '',
            price: ''
        },
        inputValidities: {
            title: editedProduct ? true : false,
            imageUrl: editedProduct ? true : false,
            description: editedProduct ? true : false,
            price: editedProduct ? true : false
        },
        formIsValid: editedProduct ? true : false
    })

    const { navigation } = props
    const { route } = props

    const submitHandler = useCallback(async () => {
        if (!formState.formIsValid) {
            Alert.alert(
                'Wrong input!',
                'Please check the errors in the form.',
                [{ text: 'Okay' }]
            )
            return;
        }
        setError(null);
        setIsLoading(true)
        try {

            if (editedProduct) {
                await dispatch(productsActions.updateProduct(
                    editedProduct.id,
                    formState.inputValues.title,
                    formState.inputValues.description,
                    formState.inputValues.imageUrl
                ))
            } else {
                await dispatch(productsActions.createProduct(
                    formState.inputValues.title,
                    formState.inputValues.description,
                    formState.inputValues.imageUrl,
                    +formState.inputValues.price
                ))
            }
            navigation.goBack();
        } catch (err) {
            setError(err.message)
        }
        setIsLoading(false)
    }, [dispatch, editedProduct, formState])

    useEffect(() => {
        if (error) {
            Alert.alert('An error occured!', error, [{ text: 'Okay' }]);
        }
    }, [error]);


    useEffect(() => {
        navigation.setParams({
            submit: submitHandler
        })
    }, [submitHandler])

    const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: inputValue,
            isValid: inputValidity,
            input: inputIdentifier
        })
    }, [dispatchFormState])

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <HeaderButtons HeaderButtonComponent={HeaderButton}>
                    <Item
                        title='Save'
                        iconName={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'}
                        onPress={() => {
                            if (route.params) {
                                route.params.submit()
                            }
                            else {
                                console.log('Could not save the product')
                            }
                        }}
                    />
                </HeaderButtons>
            )
        })
    }, [navigation, route])

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator color={Colors.primary} size='large' />
            </View>
        )
    }

    return (
        <ScrollView>
            <View style={styles.form}>
                <Input
                    id='title'
                    label='Title'
                    errorText='Please enter a valid title!'
                    keyboardType='default'
                    autoCapitalize='sentences'
                    autoCorrect
                    returnKeyType='next'
                    onInputChange={inputChangeHandler}
                    initialValue={editedProduct ? editedProduct.title : ''}
                    initiallyValid={!!editedProduct}
                    required
                />
                <Input
                    id='imageUrl'
                    label='Image Url'
                    errorText='Please enter a valid image url!'
                    keyboardType='default'
                    returnKeyType='next'
                    initialValue={editedProduct ? editedProduct.imageUrl : ''}
                    onInputChange={inputChangeHandler}
                    initiallyValid={!!editedProduct}
                    required
                />
                {editedProduct ? null : (
                    <Input
                        id='price'
                        label='Price'
                        errorText='Please enter a valid price!'
                        keyboardType='decimal-pad'
                        returnKeyType='next'
                        onInputChange={inputChangeHandler}
                        required
                        min={0.1}
                    />)}
                <Input
                    id='description'
                    label='Description'
                    errorText='Please enter a valid description!'
                    keyboardType='default'
                    numberOfLines={3}
                    multiline
                    initialValue={editedProduct ? editedProduct.description : ''}
                    initiallyValid={!!editedProduct}
                    onInputChange={inputChangeHandler}
                    returnKeyType='next'
                    required
                    minLength={5}
                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    form: {
        margin: 20
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default EditProductScreen