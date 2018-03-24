/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
    Button,
    SafeAreaView
} from 'react-native';
import SoundRecorder from 'react-native-sound-recorder';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
    startRecording(){
        SoundRecorder.start(SoundRecorder.PATH_CACHE + '/test.mp4')
            .then(function() {
                console.log('started recording');
            });
    }

    stopRecording(){
        SoundRecorder.stop()
            .then(function(path) {
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
