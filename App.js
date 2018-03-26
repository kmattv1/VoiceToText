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
    TextInput,
    Alert
} from 'react-native';

import SoundRecorder from 'react-native-sound-recorder';


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
    Alert.alert('Upload File', '', [{
        text: 'OK', onPress: () => {
        }
    }], {cancelable: true});

    UploadFile.upload(obj, (returnCode, returnMessage, resultData) => {
        Alert.alert(returnCode.toString(), returnMessage + ' ' + JSON.stringify(resultData), [{
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
            server: 'http://192.168.16.102:8000',
            fileName: 'testFile'
        };
    }

    startRecording(filename) {
        SoundRecorder.start(
            SoundRecorder.PATH_CACHE + '/' + filename + '.aac',
            {
                source: SoundRecorder.SOURCE_MIC,
                format: SoundRecorder.FORMAT_AAC_ADTS,
                encoder: SoundRecorder.ENCODER_AAC
            })
            .then(function () {
                Alert.alert('Recording started', SoundRecorder.PATH_CACHE, [{
                    text: 'OK', onPress: () => {
                    }
                }], {cancelable: true});
                console.log('started recording');
            });
    }

    stopRecording(filename, server) {
        SoundRecorder.stop()
            .then(function (response) {
                Alert.alert('Recording stoped', JSON.stringify(response), [{
                    text: 'OK', onPress: () => {
                    }
                }], {cancelable: true})
                upload({
                    name: filename + '_' + new Date().toLocaleString() + '.aac',
                    path: response.path,
                    type: 'audio/aac',
                    server: server
                });
                console.log('stopped recording, audio file saved at: ' + JSON.stringify(path));
            });
    }


    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.welcome}>
                    Hangfelismero 😄
                </Text>
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
                <Button title="Start" color="green" onPress={() => {
                    this.startRecording(this.state.fileName)
                }}/>
                <Button title="Stop" color="red" onPress={() => {
                    this.stopRecording(this.state.fileName, this.state.server)
                }}/>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
