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

import SoundRecorder from 'react-native-sound-recorder';
import BackgroundTimer from 'react-native-background-timer';


var UploadFile = require('NativeModules').UploadFile;

function upload(file) {
    var obj = {
        uploadUrl: file.server, //https://test.com/upload/
        method: 'POST',
        headers: {
            'Accept': 'application/json',
        },
        files: [
            {
                name: 'files', //key name
                filename: file.name, //the name which server will receive
                filepath: file.path, //local file path
                filetype: file.type, //file type
            },
        ],
        fields: { //additional parameters
            filename: JSON.stringify(file.name)
        },
    };

    UploadFile.upload(obj, (returnCode, returnMessage, resultData) => {
        var message = "";
        if (returnCode == 200) {
            message = "Sikeres feltöltés!";
            message = message.concat(' ').concat(returnMessage);
        } else {
            message = "Sikertelen feltöltés!";
        }
        Alert.alert(file.name.toString(), message, [{
            text: 'OK',
            onPress: () => {
            }
        }], {cancelable: true});
        if (returnCode == 201) {
        }
        else {
        }
    })
}

type Props = {};
export default class App extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            server: 'http://193.25.100.94:8000',
            fileName: 'testFile',
        };
    }



    startRecording(filename) {
        SoundRecorder.start(
            SoundRecorder.PATH_CACHE.concat('/').concat(filename).concat('.aac'),
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

        BackgroundTimer.runBackgroundTimer(() => {
            this.stopRecording(this.state.fileName, this.state.server);
            BackgroundTimer.stopBackgroundTimer();
        }, 1500);
    }

    stopRecording(filename, server) {
        SoundRecorder.stop()
            .then(function (response) {
                Alert.alert('Felvétel leállítva', 'Feltöltés ...', [{
                    text: 'OK', onPress: () => {
                    }
                }], {cancelable: true})
                upload({
                    name: filename.concat('_').concat(new Date().valueOf()).concat('.aac'),
                    path: response.path,
                    type: 'audio/aac',
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
                    </View>
                    <View style={[{flexDirection: 'row'}, styles.elementsContainer]}>
                        <View style={{backgroundColor: '#f5faf8'}}>
                            <Button title="Start" color="#28A917" onPress={() => {
                                this.startRecording(this.state.fileName)
                            }}/>
                        </View>
                        {/*<View style={{backgroundColor: '#f5faf8'}}>*/}
                            {/*<Button title="Stop" color="#EE050B" onPress={() => {*/}
                                {/*this.stopRecording(this.state.fileName, this.state.server)*/}
                            {/*}}/>*/}
                        {/*</View>*/}
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
