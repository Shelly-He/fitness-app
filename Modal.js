// import React from 'react';
// import { ScrollView, Text, View, TouchableWithoutFeedback, Dimensions } from 'react-native';
// import Button from './Button';
// import Signup from './Signup';
// import Login from './Login';
// import AddOption from './AddOption';
// // import {createAppContainer} from 'react-navigation';
// // import {createStackNavigator} from 'react-navigation-stack';
//
// class Modal extends React.Component {
//   constructor(props) {
//     super(props);
//     // this.state = {
//     //   userOption: this.props.option,
//     // }
//   }
//
//   windowForInput(){
//     if(this.props.option === "auth"){
//       if (this.props.login){
//         return (<Login _signInAsync={this.props._signInAsync}/>);
//       }
//       else{
//         return (<Signup/>);
//       }
//     }
//     else{
//       return(<AddOption addOption={this.props.addOption}>)
//     }
//
//   }
//
//
//   render() {
//     if(this.props.show) {
//       const screenWidth = Math.round(Dimensions.get('window').width);
//       const screenHeight = Math.round(Dimensions.get('window').height);
//
//       return (
//         <View style={{position: 'absolute'}}>
//           <TouchableWithoutFeedback onPress={() => this.props.hide()}>
//             <View style={{width: screenWidth, height: screenHeight, backgroundColor: 'black', opacity: 0.75}}>
//             </View>
//           </TouchableWithoutFeedback>
//           <View style={{position: 'absolute', width: this.props.width, height: this.props.height, left: (screenWidth - this.props.width)/2, top: (screenHeight - this.props.height)/2, backgroundColor: 'white', borderRadius: 10}}>
//           <Text style={{fontSize: 25, marginLeft: 20, marginTop: 15}}></Text>
//             <Button buttonStyle={{alignItems: 'center', justifyContent: 'center', width: 70, height: 70, position: 'absolute', right: 0}} textStyle={{fontSize: 25}} text={'✕'} onPress={() => this.props.hide()}/>
//             <ScrollView>{this.windowForInput()}</ScrollView>
//           </View>
//
//         </View>
//       )
//     }
//     return (<View></View>)
//   }
// }
//
// export default Modal;

import React from 'react';
import { ScrollView, Text, View, TouchableWithoutFeedback, Dimensions } from 'react-native';
import Button from './Button';
import Signup from './Signup';
import Login from './Login';
import AddOption from './AddOption';
import Edit from './Edit';
// import {createAppContainer} from 'react-navigation';
// import {createStackNavigator} from 'react-navigation-stack';

class Modal extends React.Component {

  windowForInput(){
    let option = this.props.option;
    if(option === "auth"){
      if (this.props.login){
        return (<Login _signInAsync={this.props._signInAsync}/>);
      }
      else{
        return (<Signup _signInAsync={this.props._signInAsync}/>);
      }
    }
    else if(option === "edit"){
      return (<Edit editOption={this.props.editOption} id={this.props.id} mealId={this.props.mealId}/>);
    }
    else if(option==="add"){
      return (<AddOption addOption={this.props.addOption}/>);
    }


    }



  render() {
    if(this.props.show) {
      const screenWidth = Math.round(Dimensions.get('window').width);
      const screenHeight = Math.round(Dimensions.get('window').height);

      return (
        <View style={{position: 'absolute'}}>
          <TouchableWithoutFeedback  accessible={false} onPress={() => this.props.hide()}>
            <View style={{width: screenWidth, height: screenHeight, backgroundColor: 'black', opacity: 0.75}}>
            </View>
          </TouchableWithoutFeedback>
          <View accessible={true} style={{position: 'absolute', width: this.props.width, height: this.props.height, left: (screenWidth - this.props.width)/2, top: (screenHeight - this.props.height)/2, backgroundColor: 'white', borderRadius: 10}}>
          <Text style={{fontSize: 25, marginLeft: 20, marginTop: 15}}></Text>
            <Button  accessibilityLabel="Tap to close the modal"
             buttonStyle={{alignItems: 'center', justifyContent: 'center', width: 70, height: 70, position: 'absolute', right: 0}} textStyle={{fontSize: 25}} text={'✕'} onPress={() => this.props.hide()}/>
            <ScrollView>{this.windowForInput()}</ScrollView>
          </View>

        </View>
      )
    }
    return (<View></View>)
  }
}

export default Modal;
