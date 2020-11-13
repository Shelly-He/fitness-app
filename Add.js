import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Switch,
  ScrollView,
  AsyncStorage
} from 'react-native';
import Button from './Button';
import Modal from './Modal';


class Add extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      addOption:"",

    }
  }

  _getToken = async () =>{
     const userToken = await AsyncStorage.getItem('userToken');
      this.setState({token:userToken});
  };



  addActivity(){
    this.setState({addOption:"activity"});
    this.showModal();

  }

  addFood(){
    this.setState({addOption:"food"});
    this.showModal();
  }

  addMeal(){
    this.setState({addOption:"meal"});
    this.showModal();
  }

  showModal() {
    this.setState({showModal: true});
  }

  hideModal() {
    this.setState({showModal: false});
  }

  render() {
    return(

      <View accessibility={false}
      style={{flex: 1}}>
        <Button buttonStyle={{flex: 1, backgroundColor: '#E63B2E', alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 10, margin: 10}} textStyle={{color: '#ffffff'}} text={'Add activity'} onPress={() => this.addActivity()}/>
        <Button buttonStyle={{flex: 1, backgroundColor: '#8D6B94', alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 10, margin: 10}} textStyle={{color: '#ffffff'}} text={'Add meal'} onPress={() => this.addMeal()}/>
        <Button buttonStyle={{flex: 1, backgroundColor: '#FE9920', alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 10, margin: 10}} textStyle={{color: '#ffffff'}} text={'Add food'} onPress={() => this.addFood()}/>
        <Modal accessibility={true} width={300} height={600} show={this.state.showModal} hide={() => this.hideModal()} option="add" addOption={this.state.addOption}/>
      </View>);
  }


}

export default Add;
