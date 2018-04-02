/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    Button,
    SafeAreaView,
    View,
    TextInput,
    Alert
} from 'react-native';

import FTP from 'react-native-ftp';
import SoundRecorder from 'react-native-sound-recorder';

function ftp_upload(toUpload) {
    let server = toUpload.server;
    let password = toUpload.password;
    let user = toUpload.userName;
    let fileToUpload = toUpload.fileName;
    let destination = 'voji';

    FTP.setup(server, 21);
    //Setup host
    FTP.login(user, password).then(
        (result) => {
            Alert.alert('Login', JSON.stringify(result), [{
                text: 'OK', onPress: () => {
                }
            }], {cancelable: true});
            FTP.uploadFile(fileToUpload, destination).then(
                (uresult) => {
                    Alert.alert('Feltoltve', JSON.stringify(uresult), [{
                        text: 'OK', onPress: () => {
                        }
                    }], {cancelable: true});
                },
                (error) => {
                    Alert.alert('UP Hiba', JSON.stringify(error), [{
                        text: 'OK', onPress: () => {
                        }
                    }], {cancelable: true});
                }
            );
        },
        (error) => {
            Alert.alert('Hiba', JSON.stringify(error), [{
                text: 'OK', onPress: () => {
                }
            }], {cancelable: true});
        }
    );
}

type Props = {};
export default class App extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            server: '136.243.4.31',
            fileName: 'testFile',
            userName: 'medatin',
            password: 'kvkmaif2'
        };
    }

    startRecording(filename) {
        SoundRecorder.start(
            SoundRecorder.PATH_CACHE.concat('/').concat(filename.concat('_').concat(new Date().valueOf())).concat('.aac'),
            {
                source: SoundRecorder.SOURCE_MIC,
                format: SoundRecorder.FORMAT_AAC_ADTS,
                encoder: SoundRecorder.ENCODER_AAC
            })
            .then(function () {
                Alert.alert('Felvétel elindítva', SoundRecorder.PATH_CACHE, [{
                    text: 'OK', onPress: () => {
                    }
                }], {cancelable: true});
            });
    }

    stopRecording(filename, server, userName, password) {
        SoundRecorder.stop()
            .then(function (response) {
                Alert.alert('Felvétel leállítva', 'Feltöltés ...', [{
                    text: 'OK', onPress: () => {
                    }
                }], {cancelable: true})
                ftp_upload({
                    fileName: response.path,
                    userName: userName,
                    password: password,
                    server: server
                });
            });
    }


    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={[{flexDirection: 'column', width: '100%'}, styles.elementsContainer]}>
                    <View style={{backgroundColor: '#ee050b', width: '100%'}}>
                        <Text style={styles.welcome}>
                            Medatin 🚑
                        </Text>
                    </View>
                    <View style={{backgroundColor: '#f5faf8'}}>
                        <Text>File nev:</Text>
                        <TextInput
                            onChangeText={(fileName) => {
                                this.setState({fileName: fileName})
                            }}
                            value={this.state.fileName}
                            editable={true}
                        />

                        <Text>Szerver IP:</Text>
                        <TextInput
                            onChangeText={(server) => {
                                this.setState({server: server})
                            }}
                            value={this.state.server}
                            editable={true}
                        />

                        <Text>Felhasználónév:</Text>
                        <TextInput
                            onChangeText={(userName) => {
                                this.setState({userName: userName})
                            }}
                            value={this.state.userName}
                            editable={true}
                        />

                        <Text>Jelszó:</Text>
                        <TextInput
                            onChangeText={(password) => {
                                this.setState({password: password})
                            }}
                            value={this.state.password}
                            editable={true}
                        />
                    </View>
                    <View style={[{flexDirection: 'row'}, styles.elementsContainer]}>
                        <View style={{backgroundColor: '#f5faf8'}}>
                            <Button title="Start" color="#28A917" onPress={() => {
                                this.startRecording(this.state.fileName)
                            }}/>
                        </View>
                        <View style={{backgroundColor: '#f5faf8'}}>
                            <Button title="Stop" color="#EE050B" onPress={() => {
                                this.stopRecording(
                                    this.state.fileName,
                                    this.state.server,
                                    this.state.userName,
                                    this.state.password)
                            }}/>
                        </View>
                    </View>
                </View>
            </SafeAreaView>);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        color: '#fff1f8',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#fff1f8',
        marginBottom: 5,
    },
});
