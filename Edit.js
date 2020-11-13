import React from 'react';
import { ScrollView, Text, View, TouchableWithoutFeedback, Dimensions,AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input,Header } from 'react-native-elements';
import Button from './Button';
import DatePicker from 'react-native-datepicker';
import Summary from './Summary';


class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
      name:"",
      duration:"",
      calories:"",
      carbohydrates: "",
      fat: "",
      protein: "",
      date:new Date(),
      info:{}
    }

  }

  async componentDidMount() {
   await this._getToken();
   let editOption = this.props.editOption;
   if(editOption === "activity"){
     await this.getActivity();
   }
   else if(editOption === "food"){
     await this.getFood();
   }
   else if(editOption === "meal"){
     await this.getMeal();
   }


 }



  _getToken = async () =>{
     const userToken = await AsyncStorage.getItem('userToken');
      this.setState({token:userToken});
  };

  setUpdate = async () => {
    await AsyncStorage.setItem('newUpate', "true");
  };

  initialActivity(info){
    this.setState({
      name:info.name,
      duration:info.duration,
      calories:info.calories,
      date:new Date(info.date),
     })
  }

  initialMeal(info){
    this.setState({
      name:info.name,
      date:new Date(info.date),
     })
  }

  initialFood(info){
    this.setState({
      name:info.name,
      calories: info.calories,
      carbohydrates: info.carbohydrates,
      fat: info.fat,
      protein: info.protein,
     })
  }

  editOption(){

    let editOption = this.props.editOption;
    if(editOption === "activity"){
      return this.editActivity();
    }
    else if(editOption === "food"){
      return this.editFood();
    }
    else if(editOption === "meal"){
      return this.editMeal();
    }
  }

  updateEdit(){
    let editOption = this.props.editOption;
    if(editOption === "activity"){
      this.updateActivity();
    }
    else if(editOption === "food"){
      this.updateFood();
    }
    else if(editOption === "meal"){
      this.updateMeal();
    }

  }


  getActivity(){
    let headers = new Headers();
    headers.append('x-access-token', this.state.token);
    fetch('https://mysqlcs639.cs.wisc.edu/activities/'+ this.props.id, {
     method: 'GET',
     headers: headers,
    }).then((response) => response.json())
      .then((responseJson) => {
        this.setState({info:responseJson});
        this.initialActivity(responseJson);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  getMeal(){
    let headers = new Headers();
    headers.append('x-access-token', this.state.token);
    fetch('https://mysqlcs639.cs.wisc.edu/meals/'+ this.props.id, {
     method: 'GET',
     headers: headers,
    }).then((response) => response.json())
      .then((responseJson) => {
        this.setState({info:responseJson});
        this.initialMeal(responseJson);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  getFood(){
    let headers = new Headers();
    headers.append('x-access-token', this.state.token);
    fetch('https://mysqlcs639.cs.wisc.edu/meals/'+ this.props.mealId +"/foods/"+ this.props.id, {
     method: 'GET',
     headers: headers,
    }).then((response) => response.json())
      .then((responseJson) => {
        this.setState({info:responseJson});
        this.initialFood(responseJson);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  editActivity(){
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
        value={this.state.name}
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
        value={String(this.state.duration)}
        onChangeText={(duration)=>this.setState({duration})}
        placeholder='Enter duration'
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
        value={String(this.state.calories)}
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

  editFood(){
    return(
      <>
      <Input
        label="name"
        value={this.state.name}
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
        value={String(this.state.calories)}
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
        value={String(this.state.carbohydrates)}
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
        value={String(this.state.protein)}
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
        value={String(this.state.fat)}
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

  editMeal(){
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
        value={this.state.name}
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
      </>

    )
  }

  selectDate(){

  }

  updateActivity(){
    fetch('https://mysqlcs639.cs.wisc.edu/activities/' + this.props.id, {
       method: 'PUT',
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

  updateMeal(){
    fetch('https://mysqlcs639.cs.wisc.edu/meals/' + this.props.id, {
       method: 'PUT',
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

  updateFood(){
    fetch('https://mysqlcs639.cs.wisc.edu/meals/' +this.props.mealId +"/foods/"+ this.props.id, {
       method: 'PUT',
       headers: {
         Accept: 'application/json',
         'Content-Type': 'application/json',
         'x-access-token':this.state.token,
       },
       body: JSON.stringify({
         name:this.state.name,
         calories: this.state.calories,
         carbohydrates: this.state.carbohydrates,
         fat: this.state.fat,
         protein: this.state.protein,
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
          centerComponent={{ text: "Edit "+this.props.editOption, style: { color: '#fff' } }}
          containerStyle={{
             backgroundColor: '#aaaaaa',
             alignItems: 'center',
             justifyContent: 'center',
             padding: 5,
           }}/>
          {this.editOption()}
          <Button buttonStyle={{flex: 1, backgroundColor: '#aaaaaa', alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 10}} textStyle={{color: '#ffffff'}} text={'Save'} onPress={() => this.updateEdit()}/>
          <Text style={{textAlign:'center'}}>{this.state.message}</Text>
          <Text></Text>
          <Text></Text>
          <Text></Text>
          <Text></Text>
          
        </ScrollView>
      )
  }


}

export default Edit;
