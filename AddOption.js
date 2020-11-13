import React from 'react';
import { ScrollView, Text, View, TouchableWithoutFeedback, Dimensions,AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, ListItem, Header } from 'react-native-elements';
// import { AsyncStorage } from 'react-native';
// import AsyncStorage from '@react-native-community/async-storage';
import Button from './Button';
// import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-datepicker';
import Summary from './Summary';


class AddOption extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
      name:"",
      duration:"",
      calories:"",
      date: new Date(),
      carbohydrates: "",
      fat: "",
      protein: "",
      mealId:"",
      meals:{},
      message:"",
      addOption: this.props.addOption,
      // mode: 'date',
      // show: false,
    }

    this._getToken();
  }



  _getToken = async () =>{
     const userToken = await AsyncStorage.getItem('userToken');
      this.setState({token:userToken});
  };


  addOption(){

    let addOption = this.state.addOption;
    if(addOption === "activity"){
      return this.addActivity();
    }
    else if(addOption === "food"){
      this.allMeals();
      return this.addFood();
    }
    else if(addOption === "meal"){
      return this.addMeal();
    }
  }

  postAdd(){
    let addOption = this.state.addOption;
    if(addOption === "activity"){
      if(this.state.name && this.state.calories && this.state.duration){
        this.postActivity();
      }
      else{
        this.setState({message:"Fill in all please."})
      }

    }
    else if(addOption === "food"){
      if(this.state.mealId){
        this.postFood();
      }
      else{
        this.setState({message:"Choose or create a meal first."})
      }

    }
    else if(addOption === "meal"){
      this.postMeal();
      this.setState({addOption:"food"});
    }
    this.setUpdate();

  }

  setUpdate = async () => {
    await AsyncStorage.setItem('newUpate', "true");
  };



  addActivity(){
    return(
      <>
      <View>
        <Button buttonStyle={{backgroundColor: '#aaaaaa',margin:10,alignItems: 'center', justifyContent: 'center'}}
          textStyle={{color: '#ffffff'}} text={'Use Current time'}
          onPress={() => this.setState({date:new Date()})}/>
          <View>
            <DatePicker
              style={{width: 300}}
              date={this.state.date}
              mode="datetime"
              format='lll'
              minDate="2016-05-01"
              maxDate="2020-06-01"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0
                },
                dateInput:{
                  marginLeft: 0,
                },
                // ... You can check the source to find the other keys.
              }}
              onDateChange={(date) => {this.setState({date: new Date(date)})}}
            />
          </View>

      </View>

      <Input
        label="name"
        onChangeText={(name)=>this.setState({name})}
        placeholder='Enter activity name'
        leftIcon={
          <Icon
            name='edit'
            size={24}
            color='gray'
          />
        }
      />

      <Input
        label="duration"
        onChangeText={(duration)=>this.setState({duration})}
        placeholder='Enter duration in min'
        leftIcon={
          <Icon
            name='edit'
            size={24}
            color='gray'
          />
        }
      />


      <Input
        label="calories"
        onChangeText={(calories)=>this.setState({calories})}
        placeholder='Enter calories'
        leftIcon={
          <Icon
            name='edit'
            size={24}
            color='gray'
          />
        }
      />

      </>
    )
  }

  addMeal(){
    return(
      <>
      <View>
        <Button buttonStyle={{backgroundColor: '#aaaaaa',margin:10,alignItems: 'center', justifyContent: 'center'}}
          textStyle={{color: '#ffffff'}} text={'Use Current time'}
          onPress={() => this.setState({date:new Date()})}/>
          <View>
            <DatePicker
              style={{width: 300}}
              date={this.state.date}
              mode="datetime"
              format='lll'
              minDate="2016-05-01"
              maxDate="2020-06-01"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0
                },
                dateInput:{
                  marginLeft: 0,
                },
                // ... You can check the source to find the other keys.
              }}
              onDateChange={(date) => {this.setState({date: new Date(date)})}}
            />
          </View>

      </View>

      <Input
        label="name"
        onChangeText={(name)=>this.setState({name})}
        placeholder='Enter meal name'
        leftIcon={
          <Icon
            name='edit'
            size={24}
            color='gray'
          />
        }
      />

      </>
    )


  }

  addFood(){
    return(
      <>
      <View>
        <Button buttonStyle={{backgroundColor: '#aaaaaa',margin:10,alignItems: 'center', justifyContent: 'center'}}
          textStyle={{color: '#ffffff'}} text={'Use Current time'}
          onPress={() => this.setState({date:new Date()})}/>
          <View>
            <DatePicker
              style={{width: 300}}
              date={this.state.date}
              mode="date"
              format='ll'
              minDate="2016-05-01"
              maxDate="2020-06-01"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0
                },
                dateInput:{
                  marginLeft: 0,
                },
                // ... You can check the source to find the other keys.
              }}
              onDateChange={(date) => {this.setState({date: new Date(date)})}}
            />
          </View>

      </View>
      {this.getMeals()}

      <Input
        label="name"
        onChangeText={(name)=>this.setState({name})}
        placeholder='Enter food name'
        leftIcon={
          <Icon
            name='edit'
            size={24}
            color='gray'
          />
        }
      />

      <Input
        label="calories"
        onChangeText={(calories)=>this.setState({calories})}
        placeholder='Enter food calories'
        leftIcon={
          <Icon
            name='edit'
            size={24}
            color='gray'
          />
        }
      />

      <Input
        label="carbohydrates"
        onChangeText={(carbohydrates)=>this.setState({carbohydrates})}
        placeholder='Enter food carbohydrates'
        leftIcon={
          <Icon
            name='edit'
            size={24}
            color='gray'
          />
        }
      />

      <Input
        label="protein"
        onChangeText={(protein)=>this.setState({protein})}
        placeholder='Enter food protein'
        leftIcon={
          <Icon
            name='edit'
            size={24}
            color='gray'
          />
        }
      />

      <Input
        label="fat"
        onChangeText={(fat)=>this.setState({fat})}
        placeholder='Enter food fat'
        leftIcon={
          <Icon
            name='edit'
            size={24}
            color='gray'
          />
        }
      />

      </>
    )

  }

  allMeals(){
    let headers = new Headers();
    headers.append('x-access-token', this.state.token);
    fetch('https://mysqlcs639.cs.wisc.edu/meals/', {
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

        if(responseJson.meals){
          this.setState({meals:responseJson.meals});
        }

      })
      .catch((error) => {
        console.error(error);
      });
  }

  getMeals(){
    let selectDate = new Date(this.state.date);
    let year = selectDate.getFullYear();
    let date = selectDate.getDate();
    let month = selectDate.getMonth();
    let meals =this.state.meals;
    let mealList = [];
    for(var i = 0; i < meals.length; i++){
      let tempDate = new Date(meals[i].date);
      let mealDate = tempDate.getDate();
      let mealYear = tempDate.getFullYear();
      let mealMonth = tempDate.getMonth();

      if(date===mealDate && month === mealMonth && year === mealYear){
        let id = meals[i].id;
        mealList.push(
          <>
          <ListItem
          key = {i}
          title= {meals[i].name}
          subtitle={
            <View >
              <Text>Time: {new Date(meals[i].date).toTimeString()}</Text>
            </View>
          }
          leftIcon={
            <Icon
              name='spoon'
              type = 'font-awesome'
              size={24}
              color='gray'

            />
          }
          bottomDivider
          rightElement={
            <Button buttonStyle={{backgroundColor: '#aaaaaa', padding: 5, borderRadius: 5}}
            textStyle={{color: '#ffffff'}} text={'Choose'} onPress={() => this.setMealId(id)}/>
          }
        />
        </>
        );
      }
    }
    return(
      <>
      {mealList}
      <Button buttonStyle={{flex: 1, backgroundColor: '#aaaaaa', alignItems: 'center', justifyContent: 'center', padding: 5, borderRadius: 5}} textStyle={{color: '#ffffff'}} text={'Create a meal'} onPress={() => this.setState({addOption:"meal"})}/>
      </>
    );


  }

  setMealId(id){
    this.setState({message:"Meal selected."})
    this.setState({mealId:id});
  }

  selectDate(){

  }

  postActivity(){
    fetch('https://mysqlcs639.cs.wisc.edu/activities/', {
       method: 'POST',
       headers: {
         Accept: 'application/json',
         'Content-Type': 'application/json',
         'x-access-token':this.state.token,
       },
       body: JSON.stringify({
         name:this.state.name,
         duration:this.state.duration,
         date:this.state.date,
         calories:this.state.calories
       }),
    }).then((response) => response.json())
      .then((responseJson) => {
        this.setState({message:responseJson.message});
      })
      .catch((error) => {
        console.error(error);
      });


  }

  postMeal(){
    fetch('https://mysqlcs639.cs.wisc.edu/meals/', {
       method: 'POST',
       headers: {
         Accept: 'application/json',
         'Content-Type': 'application/json',
         'x-access-token':this.state.token,
       },
       body: JSON.stringify({
         name:this.state.name,
         date:this.state.date,
       }),
    }).then((response) => response.json())
      .then((responseJson) => {
        this.setState({message:responseJson.message});
      })
      .catch((error) => {
        console.error(error);
      });

  }

  postFood(){
    fetch('https://mysqlcs639.cs.wisc.edu/meals/' + this.state.mealId + "/foods/", {
       method: 'POST',
       headers: {
         Accept: 'application/json',
         'Content-Type': 'application/json',
         'x-access-token':this.state.token,
       },
       body: JSON.stringify({
         name:this.state.name,
         date:this.state.date,
       }),
    }).then((response) => response.json())
      .then((responseJson) => {
        this.setState({message:responseJson.message});
      })
      .catch((error) => {
        console.error(error);
      });

  }


  render() {
      return (
        <ScrollView>
          <Header
          centerComponent={{ text: "Add "+this.state.addOption, style: { color: '#fff' } }}
          containerStyle={{
             backgroundColor: '#aaaaaa',
             alignItems: 'center',
             justifyContent: 'center',
             padding: 5,
           }}/>
          {this.addOption()}
          <Button buttonStyle={{backgroundColor: '#aaaaaa', alignItems: 'center', justifyContent: 'center',margin: 10}} textStyle={{color: '#ffffff'}} text={'Add'} onPress={() => this.postAdd()}/>
          <Text style={{textAlign:'center'}}>{this.state.message}</Text>
          <Text></Text>
          <Text></Text>
          <Text></Text>
          <Text></Text>
          <Text></Text>
        </ScrollView>
      )
  }


}

export default AddOption;
