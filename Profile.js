import React from 'react';
import { ScrollView, Text, View, TouchableWithoutFeedback, Dimensions,AsyncStorage} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';
// import AsyncStorage from '@react-native-community/async-storage';
// import {
//   createAppContainer,
//   createSwitchNavigator,
//   DrawerNavigator,
//   HeaderNavigationBar,
//   StackNavigator,
// } from 'react-navigation';

import Button from './Button';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      info:{},
      firstName: "",
      goalDailyActivity: "",
      goalDailyCalories: "",
      goalDailyCarbohydrates: "",
      goalDailyFat: "",
      goalDailyProtein: "",
      lastName: "",
      token: "",
      userName:"",
    }



  }

  async componentDidMount() {
   await this._getToken();
   await this._getUserName();
   await this.getInfo();
 }

 initialInfo(info){
   this.setState({
     firstName: info.firstName,
     goalDailyActivity: info.goalDailyActivity,
     goalDailyCalories: info.goalDailyCalories,
     goalDailyCarbohydrates: info.goalDailyCarbohydrates,
     goalDailyFat: info.goalDailyFat,
     goalDailyProtein: info.goalDailyProtein,
     lastName: info.lastName,
    })

   this.setUpdate();
 }

 setUpdate = async () => {
   await AsyncStorage.setItem('goalDailyActivity', String(this.state.goalDailyActivity));
   await AsyncStorage.setItem('goalDailyCalories', String(this.state.goalDailyCalories));
   await AsyncStorage.setItem('goalDailyCarbohydrates', String(this.state.goalDailyCarbohydrates));
   await AsyncStorage.setItem('goalDailyFat', String(this.state.goalDailyFat));
   await AsyncStorage.setItem('goalDailyProtein', String(this.state.goalDailyProtein));
   await AsyncStorage.setItem('newUpate', "true");
 };

  _getToken = async () =>{
     const userToken = await AsyncStorage.getItem('userToken');
      this.setState({token:userToken});
  };

  _getUserName = async () =>{
     const userName = await AsyncStorage.getItem('userName');
     this.setState({userName:userName});
  };





  getInfo(){
    let headers = new Headers();
    headers.append('x-access-token', this.state.token);
    fetch('https://mysqlcs639.cs.wisc.edu/users/'+ this.state.userName, {
     method: 'GET',
     headers: headers,
     // {
     //   Accept: 'application/json',
     //   'Content-Type': 'application/json',
     //   'x-access-token': token,
     //   'Authorization': 'Basic ' + base64.encode(this.state.username + ":" + this.state.password)
     // },
    }).then((response) => response.json())
      .then((responseJson) => {
        this.setState({info:responseJson});
        this.initialInfo(responseJson);
      })
      .catch((error) => {
        console.error(error);
      });
  }





  stringJustify(input){
    if(input===null){
      return ("")
    }
    else{
      if(isNaN(input)){
          return(input)
      }

      else {
        // return(Float.toString(input));
        return(String(input))
      }

    }

  }


  getUserInfo(){
    let infoList = [];
    if(this.state.info.message){
      this._signOutAsync();
    }
    else{
      for(const line of Object.keys(this.state.info)){
        if(line !== "admin" && line !== "username"){
          infoList.push(
            <Input
              label={line}
              placeholder = "Click to Edit"
              key = {line}
              value={this.stringJustify(this.state[line])}
              onChangeText={(text)=>this.setState({[line]:text})}
              leftIcon={
                <Icon
                  name='edit'
                  size={24}
                  color='gray'
                />
              }
            />
          );
        }

      }
      let temp = infoList[6];
      infoList[6] = infoList[1];
      infoList[1] = temp;
    }
    return infoList;
  }

  updateInfo(){
    let headers = new Headers();
    headers.append('x-access-token', this.state.token);

    fetch('https://mysqlcs639.cs.wisc.edu/users/'+ this.state.userName, {
     method: 'PUT',
     headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json',
       'x-access-token':this.state.token
       },
     body: JSON.stringify({
       firstName: this.state.firstName,
       goalDailyActivity: this.state.goalDailyActivity,
       goalDailyCalories: this.state.goalDailyCalories,
       goalDailyCarbohydrates: this.state.goalDailyCarbohydrates,
       goalDailyFat: this.state.goalDailyFat,
       goalDailyProtein: this.state.goalDailyProtein,
       lastName: this.state.lastName,

    }),
    }).then((response) => response.json())
      .then((responseJson) => {
        if(responseJson.message){
          // this.setState({message:"Saved Successfully!"})
          this.setState({message:responseJson.message})
          this.setUpdate();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }



  deleteAcount(){
    fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.state.userName, {
       method: 'DELETE',
       headers: {
         Accept: 'application/json',
         'Content-Type': 'application/json',
         'x-access-token':this.state.token,
       },
    }).then((response) => response.json())
      .then((responseJson) => {
        this._signOutAsync();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  _signOutAsync = async () => {
      await AsyncStorage.clear();
      this.props.navigation.navigate('Auth');
  };

  render() {
      return (
        <View accessibility={true}>
        <ScrollView >
          {this.getUserInfo()}
          <Button buttonStyle={{flex: 1, backgroundColor: '#aaaaaa', alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 10}} textStyle={{color: '#ffffff'}} text={'Save'} onPress={() => this.updateInfo()}/>
          <Text style={{textAlign:'center'}}>{this.state.message}</Text>

          <Button buttonStyle={{flex: 1, backgroundColor: '#aaaaaa', alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 10, margin: 10}} textStyle={{color: '#ffffff'}} text={"Actually, sign me out :)"} onPress={this._signOutAsync} />
          <Button buttonStyle={{flex: 1, backgroundColor: '#E63B2E', alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 10, margin: 10}} textStyle={{color: '#ffffff'}} text={"I want to delete this account."} onPress={()=>this.deleteAcount()} />

        </ScrollView>
        </View>
      )
  }
}

export default Profile;
