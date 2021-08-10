import React from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, AsyncStorage } from 'react-native';

export default class Addfriend extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phonenumber: null,
            usernumber: null,
            friends: [],
        }
        this.loadCredentials();
    }

    async loadCredentials() {
        const usernumber = await AsyncStorage.getItem('phonenumber');
        this.setState({ usernumber: usernumber });
    }

    handleChange = key => val => {
        this.setState({ [key]: val })
    }

    addfriend = () => {
        fetch('http://10.23.0.245:3000/addfriend', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                usernumber: this.state.usernumber,
                phonenumber: this.state.phonenumber,
            })
        })
            .then((response) => response.json())
            .then((res) => {
                if (res.success === true) {
                    alert('Successfully added!');
                }
                else {
                    alert(res.message);
                }
            })
            .done();
    }

    checkforfriend = async () => {
        fetch('http://10.23.0.245:3000/alreadyfriend', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                usernumber: this.state.usernumber,
                phonenumber: this.state.phonenumber,
            })
        })
            .then((response) => response.json())
            .then((res) => {
                if (res.success === true) {
                    this.addfriend();
                }
                else {
                    alert(res.message);
                }
            })
            .done();
    }

    submitform = () => {
        if (this.state.Phonenumber !== null || this.state.phonenumber.length < 10 || this.state.phonenumber === this.state.usernumber) {
            alert('Enter a valid number');
        }
        else {
            fetch('http://10.23.0.245:3000/checkforexistinguser', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Phonenumber: this.state.phonenumber,
                })
            })
                .then((response) => response.json())
                .then((res) => {
                    if (res.success === false) {
                        this.checkforfriend();
                    }
                    else {
                        alert('User does not exists');
                    }
                })
                .done();
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    placeholder="Phone number"
                    keyboardType="number-pad"
                    style={styles.input}
                    value={this.state.phonenumber}
                    onChangeText={this.handleChange('phonenumber')}
                />
                <TouchableOpacity onPress={this.submitform}>
                    <Text>Add Friend</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        padding: 10,
        marginBottom: 10,
        width: '90%',
        alignSelf: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
    },
})