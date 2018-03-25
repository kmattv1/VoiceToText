/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Button,
    SafeAreaView,
    Alert
} from 'react-native';

import SoundRecorder from 'react-native-sound-recorder';

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
    android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

var UploadFile = require('NativeModules').UploadFile;

function upload(file) {
    var obj = {
        uploadUrl: 'http://192.168.16.102:8000/', //https://test.com/upload/
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

    startRecording() {
        SoundRecorder.start(
            SoundRecorder.PATH_CACHE + '/test.aac',
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

    stopRecording() {
        SoundRecorder.stop()
            .then(function (response) {
                Alert.alert('Recording stoped', JSON.stringify(response), [{
                    text: 'OK', onPress: () => {
                    }
                }], {cancelable: true});
                upload({
                    name: 'test',
                    path: response.path,
                    type: 'audio/aac'
                });
                console.log('stopped recording, audio file saved at: ' + JSON.stringify(path));
            });
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Button title="Start" color="green" onPress={this.startRecording}/>
                <Button title="Stop" color="red" onPress={this.stopRecording}/>
                <Text style={styles.welcome}>
                    Welcome to React Native!
                </Text>
                <Text style={styles.instructions}>
                    To get started, edit App.js
                </Text>
                <Text style={styles.instructions}>
                    {instructions}
                </Text>
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
