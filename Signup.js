import React from 'react';
import { TextInput, Text, View, TouchableWithoutFeedback, Dimensions, AsyncStorage } from 'react-native';
import Button from './Button';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';
import base64 from 'react-native-base64';

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      username:"",
      password:"",
      token: "",
      info:{},
    }

    //ref is not working here, cannot get current.value
    // this.username = React.createRef();
    // this.password = React.createRef();
  }

  postNewUser(){
      fetch('https://mysqlcs639.cs.wisc.edu/users/', {
         method: 'POST',
         headers: {
           Accept: 'application/json',
           'Content-Type': 'application/json'
         },
         body: JSON.stringify({
           username: this.state.username,
           password: this.state.password,
         }),
      }).then((response) => response.json())
        .then((responseJson) => {
          this.setState({message:responseJson.message});
          if(responseJson.message === "User created!"){
            this.loginUser();
          }
        })
        .catch((error) => {
          console.error(error);
        });

  }

  loginUser(){
    let headers = new Headers();
    headers.append('Authorization', 'Basic ' + base64.encode(this.state.username + ":" + this.state.password));
    fetch('https://mysqlcs639.cs.wisc.edu/login/', {
     method: 'GET',
     headers: headers,
     // {
     //   Accept: 'application/json',
     //   'Content-Type': 'application/json',
     //   'Authorization', 'Basic ' + base64.encode(username + ":" + password)
     // },
    }).then((response) => response.json())
      .then((responseJson) => {
        // this.setState({token:responseJson.token});
        if(responseJson.token){
          // this.setState({token:responseJson.token});
          // this.pageAfterLogin(responseJson.token);
          // let token = responseJson.token;
          this.getInfo(responseJson.token,this.state.username);
          this.setState({token:responseJson.token});
          this.setState({loggedIn:true});
          this.props._signInAsync(responseJson.token,this.state.username);

          // this.getProfile();
        }
        else{
          this.setState({message:responseJson.message});
        }

      })
      .catch((error) => {
        console.error(error);
      });
  }


  getInfo(token,userName){
    let headers = new Headers();
    headers.append('x-access-token', token);
    fetch('https://mysqlcs639.cs.wisc.edu/users/'+ userName, {
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
        this.setUpdate(responseJson);
      })
      .catch((error) => {
        console.error(error);
      });
  }


  setUpdate = async (info) => {
    await AsyncStorage.setItem('goalDailyActivity', String(info.goalDailyActivity));
    await AsyncStorage.setItem('goalDailyCalories', String(info.goalDailyCalories));
    await AsyncStorage.setItem('goalDailyCarbohydrates', String(info.goalDailyCarbohydrates));
    await AsyncStorage.setItem('goalDailyFat', String(info.goalDailyFat));
    await AsyncStorage.setItem('goalDailyProtein', String(info.goalDailyProtein));
  };

  render() {
    return (
      <>
      <View>
        <Input
          value={this.state.username}
          onChangeText={(username)=>this.setState({username})}
          placeholder='Enter your user name'
          leftIcon={
            <Icon
              name='user'
              size={24}
              color='black'
            />
          }
        />
        </View>

        <Input
          value={this.state.password}
          onChangeText={(password)=>this.setState({password})}
          placeholder='Enter your password'
          leftIcon={
            <Icon
              name='lock'
              size={24}
              color='black'
            />
          }
        />

        <Button buttonStyle={{flex: 1, backgroundColor: '#aaaaaa', alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 10}} textStyle={{color: '#ffffff'}} text={'Sign Up'} onPress={() => this.postNewUser()}/>
        <Text>{this.state.message}</Text>
      </>)
  }
}

export default Signup;
