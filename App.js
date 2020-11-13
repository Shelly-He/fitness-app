import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Switch,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  AsyncStorage
} from 'react-native';

// import AsyncStorage from '@react-native-community/async-storage';
import {
  createAppContainer,
  createSwitchNavigator,
  DrawerNavigator,
  HeaderNavigationBar,
  StackNavigator,
} from 'react-navigation';

import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from './Modal';
import Button from './Button';
import Summary from './Summary';
import Profile from './Profile';
import Add from './Add';


/// authpassing

class SignInScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      login: false,
      // loggedIn:false,
    }
  }

  // updateLoggedIn(state){
  //   this.setState({loggedIn:state});
  // }

 //  componentWillUnmount() {
 //   this._signOutAsync();
 // }

 _signOutAsync = async () => {
     await AsyncStorage.clear();
     this.props.navigation.navigate('Auth');
 };

  // render() {
  //   return (
  //     <View style={styles.container}>
  //       <Button title="Sign in!" onPress={this._signInAsync} />
  //     </View>
  //   );
  // }

  _signInAsync = async (token,username) => {
    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('userName', username);
    this.props.navigation.navigate('App');
  };



  showLoginModal(){
    this.setState({login: true});
    this.showModal();
  }

  showSignupModal(){
    this.setState({login: false});
    this.showModal();
  }

  showModal() {
    this.setState({showModal: true});
  }

  hideModal() {
    this.setState({showModal: false});
  }

  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>Already have an account?</Text>
        <Button buttonStyle={{backgroundColor: '#aaaaaa', alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 10}} textStyle={{color: '#ffffff'}} text={'Login'} onPress={() => this.showLoginModal()}/>
        <Text>New user?</Text>
        <Button buttonStyle={{backgroundColor: '#aaaaaa', alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 10}} textStyle={{color: '#ffffff'}} text={'Sign Up'} onPress={() => this.showSignupModal()}/>
        <Modal width={300} height={600} _signInAsync={(token,username)=>this._signInAsync(token,username)} login={this.state.login} show={this.state.showModal} hide={() => this.hideModal()} option="auth"/>
      </View>


    );
  }


}


class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    if (userToken) {
      this.props.navigation.navigate('App');
    }
    else{
      this.props.navigation.navigate('Auth');

    }
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}




const ProfileStack = createStackNavigator(
{
  Profile: Profile,
},
{
  headerMode: 'none',
}
);

const SummaryStack = createStackNavigator(
{
  Summary: Summary,
},
{
  headerMode: 'none',
}
);

const AddStack = createStackNavigator(
{
  Add: Add,
},
{
  headerMode: 'none',
}
);


const TabNavigation = createBottomTabNavigator(
{
  Summary: SummaryStack,
  Add: AddStack,
  Profile: ProfileStack,

},
{
  navigationOptions: ({ navigation }) => ({
    
  }),
  tabBarOptions: {
    activeTintColor: 'tomato',
    inactiveTintColor: 'gray',
  },
  animationEnabled: true,
}
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const AppStack = createStackNavigator({ Home: TabNavigation});
const AuthStack = createStackNavigator({ SignIn: SignInScreen });

const AppContainer = createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));


export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
