import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Switch,
  ScrollView,
  AsyncStorage
} from 'react-native';
import {withNavigation} from 'react-navigation';
import { Input, Card, ListItem, Tooltip, Text} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import Button from './Button';
import Modal from './Modal';
import { ProgressCircle, PieChart,BarChart,Grid,XAxis,YAxis} from 'react-native-svg-charts';
import * as scale from 'd3-scale';


class Summary extends React.Component {
 _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      newUpdate:false,
      editOption:"",
      id:"",
      message: "",
      token: "",
      activities:{},
      foods:[],
      meals:[],
      date: new Date(),
      name:"",
      duration:"",
      calories:"",
      goalDailyActivity: "",
      goalDailyCalories: "",
      goalDailyCarbohydrates: "",
      goalDailyFat: "",
      goalDailyProtein: "",

      // dailyCalories: [],
      // dailyCarbohydrates: [],
      // dailyFat: [],
      // dailyProtein: [],

      sevenDaysActivities:[],
      sevenDaysFood:[],
    }


  }



 _getToken = async () =>{
    const userToken = await AsyncStorage.getItem('userToken');
     this.setState({token:userToken});
 };

 getUpdate= async () =>{
    const newUpate = await AsyncStorage.getItem('newUpate');
    this.setState({newUpate:newUpate});
 };

 setUpdate = async () => {
   await AsyncStorage.setItem('newUpate', "false");
 };

 setCurrentData= async (calories, carbohydrates, fat, protein) => {
   await AsyncStorage.multiSet([['currCalories', calories], ['currCarbohydrates', carbohydrates],['currFat', fat], ['currProtein', protein]]);
 };

 getGoals = async () =>{
   let goalDailyActivity = await AsyncStorage.getItem('goalDailyActivity');
   let goalDailyCalories = await AsyncStorage.getItem('goalDailyCalories');
   let goalDailyCarbohydrates = await AsyncStorage.getItem('goalDailyCarbohydrates');
   let goalDailyFat= await AsyncStorage.getItem('goalDailyFat');
   let goalDailyProtein = await AsyncStorage.getItem('goalDailyProtein');
   await this.setState({
     goalDailyActivity: goalDailyActivity,
     goalDailyCalories: goalDailyCalories,
     goalDailyCarbohydrates: goalDailyCarbohydrates,
     goalDailyFat: goalDailyFat,
     goalDailyProtein: goalDailyProtein,
    })
 };



 // async componentDidUpdate(prevProps) {
 //    if (prevProps.isFocused !== this.props.isFocused) {
 //
 //    }
 //  }

//
//  async componentDidMount() {
//   await this._getToken();
//   await this.allActivities();
// }

async componentDidMount() {
    this._isMounted = true;
     if (this._isMounted){
       await this._getToken();
       await this.getGoals();
       await this.allActivities();
       await this.allMeals();
       await this.getSevenFoods();
       // await this.getSevenActivities();
       const { navigation } = this.props;
       this.focusListener = navigation.addListener('didFocus', async() => {
         await this.getUpdate();
         let update = await this.state.newUpate;
         if(update === "true"){
           this.allActivities();
           this.allMeals();
           this.getGoals();
           this.setUpdate();
         }
       });
     }

  }

  componentWillUnmount() {
    this._isMounted = false;
    this.focusListener.remove();
    this._signOutAsync();

  }

  _signOutAsync = async () => {
      await AsyncStorage.clear();
      this.props.navigation.navigate('Auth');
  };


  allActivities(){
    let headers = new Headers();
    headers.append('x-access-token', this.state.token);
    fetch('https://mysqlcs639.cs.wisc.edu/activities/', {
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

        if(responseJson.activities){
          this.setState({activities:responseJson.activities});
        }
        else if(responseJson.message){
          // this.setState({message:responseJson.message});
        }

      })
      .catch((error) => {
        console.error(error);
      });
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
      .then(async(responseJson) => {

        if(responseJson.meals){
          let meals = responseJson.meals;
          for(var i = 0; i < meals.length; i++){
            let id = meals[i].id;
            await this.allFoods(id,i);
          }
          await this.setState({meals:meals});
        }
        else if(responseJson.message){
          // this.setState({message:responseJson.message});
        }

      })
      .catch((error) => {
        console.error(error);
      });
  }




  allFoods (mealId,index) {
    fetch('https://mysqlcs639.cs.wisc.edu/meals/'+mealId+"/foods/", {
     method: 'GET',
     headers: {
       Accept: 'application/json',
       'Content-Type': 'application/json',
       'x-access-token':this.state.token,
     },
    }).then((response) => response.json())
      .then(async(responseJson) => {
          if(responseJson.foods){
            prevFoods = await this.state.foods;
            prevFoods[index] = await responseJson.foods;
            // alert(prevFoods[index][0].name);
            this.setState({foods:prevFoods});
          }

      })
      .catch((error) => {
        console.error(error);
      });


  }

  allSevenFoods (mealId) {
    fetch('https://mysqlcs639.cs.wisc.edu/meals/'+mealId+"/foods/", {
     method: 'GET',
     headers: {
       Accept: 'application/json',
       'Content-Type': 'application/json',
       'x-access-token':this.state.token,
     },
    }).then((response) => response.json())
      .then((responseJson) => {
          if(responseJson.foods){
            return(responseJson.foods);
          }

      })
      .catch((error) => {
        console.error(error);
      });
  }

   getFoods (mealId,index){
     let caloriesTotal = 0;
     let carbTotal = 0;
     let fatTotal = 0;
     let proteinTotal = 0;
     let foodList = [];

    // foods = await this.allFoods(mealId);

    let foods = this.state.foods[index];
    if(foods){
      for(var i = 0; i < foods.length; i++){
        let id = foods[i].id;
        caloriesTotal += parseFloat(foods[i].calories);
        carbTotal += parseFloat(foods[i].carbohydrates);
        fatTotal += parseFloat(foods[i].fat);
        proteinTotal += parseFloat(foods[i].protein);

        foodList.push(
          <>
          <ListItem
          key = {id}
          title= {foods[i].name}
          subtitle={
            <View >
              <Text>Calories: {foods[i].calories}</Text>
              <Text>Carbohydrates: {foods[i].carbohydrates}</Text>
              <Text>Fat: {foods[i].fat}</Text>
              <Text>Protein: {foods[i].protein}</Text>
            </View>
          }
          leftIcon={
            <Icon
              name='apple'
              type = 'font-awesome'
              size={24}
              color='gray'

            />
          }
          bottomDivider
          rightElement={
            <View style={{flexdirection:"row"}}>
            <Button buttonStyle={{alignItems:"center",backgroundColor: '#aaaaaa', padding: 5, borderRadius: 5, margin:5}}
            textStyle={{color: '#ffffff'}} text={'Edit'} onPress={() => this.editFood(mealId,id)}/>

            <Button buttonStyle={{ alignItems:"center",backgroundColor: '#aaaaaa', padding: 5, borderRadius:5, margin:5}}
            textStyle={{color: '#ffffff'}} text={'Delete'} onPress={() => this.deleteFood(mealId,id)}/>
            </View>

          }
        />
        </>
        )
      }
    }


    let mealData = [caloriesTotal,carbTotal,fatTotal, proteinTotal];
    let data = [
                {
                    key: 1,
                    name:"calories",
                    amount: caloriesTotal,
                    svg: { fill: '#E63B2E' },
                },
                {
                    key: 2,
                    name:"carbohydrates",
                    amount: carbTotal,
                    svg: { fill: '#8D6B94' }
                },
                {
                    key: 3,
                    name:"fat",
                    amount: fatTotal,
                    svg: { fill: '#FE9920' }
                },
                {
                    key: 4,
                    name:"protein",
                    amount: proteinTotal,
                    svg: { fill: '#E5D0D0' }
                },
            ]


    let result=[];
    if(foodList.length > 0){
      foodList.push(
        <View style={{margin:10, backgroundColor: 'white', borderRadius: 10}}>
          <PieChart
                style={{ height: 200 }}
                valueAccessor={({ item }) => item.amount}
                data={data}
                spacing={0}
                outerRadius={'95%'}
            >
            </PieChart>

            <Text style={{color:data[0].svg.fill}}>
                {data[0].name}
            </Text>
            <Text style={{color:data[1].svg.fill}}>
                {data[1].name}
            </Text>
            <Text style={{color:data[2].svg.fill}}>
                {data[2].name}
            </Text>
            <Text style={{color:data[3].svg.fill}}>
                {data[3].name}
            </Text>
        </View>
      );

      result.push(foodList);
      result.push(mealData);
    }
    else{
      result.push(<>
       <Text style={{justifyContent: 'center',alignItems:"center"}}>Eat some food first!</Text>
      </>);
      result.push(mealData);
    }


    return result;
  }

  async getSevenFoods(){
    let meals =  this.state.meals;
    let selectDate = new Date();
    let sevenDaysFoods = [];

    for(let j = 0; j < 7; j++){
      selectDate.setDate(selectDate.getDate() - 1);
      let year = selectDate.getFullYear();
      let date = selectDate.getDate();
      let month = selectDate.getMonth();
      //order matters
      let dailyCalories = 0;
      let dailyCarbohydrates =0;
      let dailyFat =  0;
      let dailyProtein = 0;
      for(var i = 0; i < meals.length; i++){
        let tempDate = new Date(meals[i].date);
        let actDate = tempDate.getDate();
        let actYear = tempDate.getFullYear();
        let actMonth = tempDate.getMonth();

        if(date===actDate && month === actMonth && year === actYear){
        let id = meals[i].id;
        let foods= await this.allSevenFoods(id);
        alert(foods[0].name);
         if(foods){
           for(var i = 0; i < foods.length; i++){
             dailyCalories += parseFloat(foods[i].calories);
             dailyCarbohydrates+= parseFloat(foods[i].carbohydrates);
             dailyFat += parseFloat(foods[i].fat);
             dailyProtein+= parseFloat(foods[i].protein);
           }
        }

        }
      }
      sevenDaysFoods[6-j] = [dailyCalories,dailyCarbohydrates,dailyFat,dailyProtein];


    }
    this.setState({sevenDaysFood:sevenDaysFoods});

  }

  getSevenNutrition(){
    let nutrition = this.state.sevenDaysFood;
    let goalDailyCalories = parseFloat(this.state.goalDailyCalories);
    let goalDailyCarbohydrates = parseFloat(this.state.goalDailyCarbohydrates);
    let goalDailyFat = parseFloat(this.state.goalDailyFat);
    let goalDailyProtein = parseFloat(this.state.goalDailyProtein);
        // const label  =["Calories","Carbohydrates","Fat","Protein"];
        return(
          <View>
              <Text style={{color:'#E4572E'}}>Calories</Text>
              <Text style={{color:"#E8C547"}}>Goal Daily Calories: {goalDailyCalories}</Text>
              <XAxis
                      style={{color:'#E4572E'}}
                      data={nutrition}
                      scale={scale.scaleBand}
                      formatLabel={ (_, index) => nutrition[index][0]}
                      labelStyle={ {color:'#E4572E'} }
                  />
              <Text style={{color:"#E4572E"}}>Carbohydrates</Text>
              <Text style={{color:'#E8C547'}}>Goal Daily Carbohydrates: {goalDailyCarbohydrates}</Text>
              <XAxis
                      style={{color:'#E4572E'}}
                      data={nutrition}
                      scale={scale.scaleBand}
                      formatLabel={ (_, index) => nutrition[index][1]}
                      labelStyle={ {color:'#E4572E'} }
                  />
              <Text style={{color:"#E4572E"}}>Carbohydrates</Text>
              <Text style={{color:'#E8C547'}}>Goal Daily Fat: {goalDailyFat}</Text>
              <XAxis
                      style={{color:'#E4572E'}}
                      data={nutrition}
                      scale={scale.scaleBand}
                      formatLabel={ (_, index) => nutrition[index][2]}
                      labelStyle={ {color:'#E4572E'} }
                  />
              <Text style={{color:"#E4572E"}}>goalDailyProtein</Text>
              <Text style={{color:'#E8C547'}}>Goal Daily Protein: {goalDailyProtein}</Text>
              <XAxis
                      style={{color:'#E4572E'}}
                      data={nutrition}
                      scale={scale.scaleBand}
                      formatLabel={ (_, index) => nutrition[index][3]}
                      labelStyle={ {color:'#E4572E'} }
                  />
              </View>
        )

  }


 getMeals(selectDate) {
    let meals =  this.state.meals;

    let goalDailyCalories = parseFloat(this.state.goalDailyCalories);
    let goalDailyCarbohydrates = parseFloat(this.state.goalDailyCarbohydrates);
    let goalDailyFat = parseFloat(this.state.goalDailyFat);
    let goalDailyProtein = parseFloat(this.state.goalDailyProtein);
//order matters
    let dailyCalories = 0;
    let dailyCarbohydrates =0;
    let dailyFat =  0;
    let dailyProtein = 0;


    selectDate = new Date(selectDate);
    let year = selectDate.getFullYear();
    let date = selectDate.getDate();
    let month = selectDate.getMonth();



    let mealList = [];

    for(var i = 0; i < meals.length; i++){

      let tempDate = new Date(meals[i].date);
      let mealDate = tempDate.getDate();
      let mealYear = tempDate.getFullYear();
      let mealMonth = tempDate.getMonth();
      let id = meals[i].id;
      let mealInfo = [];

      if(date===mealDate && month === mealMonth && year === mealYear){

        let mealStat = this.getFoods(id,i)[1];
        dailyCalories += mealStat[0];
        dailyCarbohydrates += mealStat[1];
        dailyFat += mealStat[2];
        dailyProtein += mealStat[3];

        mealList.push(
          <>

          <Button buttonStyle={{alignItems:"center",backgroundColor: '#aaaaaa', padding: 5, borderRadius: 5,margin:5}}
          textStyle={{color: '#ffffff'}} text={'Edit'} onPress={() => this.editMeal(id)}/>
          <Button buttonStyle={{backgroundColor: '#aaaaaa', alignItems:"center",padding: 5, borderRadius: 5 ,margin:5}}
          textStyle={{color: '#ffffff'}} text={'Delete'} onPress={() => this.deleteMeal(id)}/>
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
        />

        {this.getFoods(id,i)[0]}

        </>
        );
      }
    }



 //daily meal stat
    const data1 = [dailyCalories,dailyCarbohydrates,dailyFat,dailyProtein].map((value) => ({ value }))
// goal meal stat
    const data2 = [goalDailyCalories,goalDailyCarbohydrates,goalDailyFat,goalDailyProtein]
            .map((value) => ({ value }))

        const barData = [
            {
                data: data1,
                svg: {
                    fill: '#E4572E',
                },
            },
            {
                data: data2,
            },
        ]
    const label  =["Calories","Carbohydrates","Fat","Protein"];
    if(mealList.length > 0){
      mealList.push(
        <View>
            <BarChart
                style={ { height: 200 } }
                data={ barData }
                yAccessor={({ item }) => item.value}
                svg={{
                    fill: '#E8C547',
                }}
                contentInset={ { top: 30, bottom: 30 } }
                { ...this.props }
            >
            <Grid />
            </BarChart>
            <XAxis
                    style={{color:'#E4572E'}}
                    data={ data2}
                    scale={scale.scaleBand}
                    formatLabel={ (_, index) => label[ index ]}
                    labelStyle={ {color:'#E4572E'} }
                />

            <Text style={{color:'#E4572E'}}>Nutrition Daily</Text>
            <XAxis
                    style={{color:'#E4572E'}}
                    data={ data2}
                    scale={scale.scaleBand}
                    formatLabel={ (_, index) => data1[ index ].value}
                    labelStyle={ {color:'#E4572E'} }
                />
            <Text style={{color:"#E8C547"}}>Nutrition Goal</Text>
            <XAxis
                    style={{color:'#E4572E'}}
                    data={ data2}
                    scale={scale.scaleBand}
                    formatLabel={ (_, index) => data2[ index ].value}
                    labelStyle={ {color:'#E4572E'} }
                />
            </View>

      );
      return(mealList);
    }
    else{
      return(
        <>
        <Text>Start a meal first!</Text>
      </>);
    }

  }

  getSevenActivities(selectDate){
    let goalDailyActivity = parseFloat(this.state.goalDailyActivity);
    let activities =this.state.activities;
    selectDate = new Date(selectDate);
    let sevenDaysActivities = [];

    for(let j = 0; j < 7; j++){
      selectDate.setDate(selectDate.getDate() - 1);
      let year = selectDate.getFullYear();
      let date = selectDate.getDate();
      let month = selectDate.getMonth();
      let activityTotal = 0;
      for(var i = 0; i < activities.length; i++){
        let tempDate = new Date(activities[i].date);
        let actDate = tempDate.getDate();
        let actYear = tempDate.getFullYear();
        let actMonth = tempDate.getMonth();

        if(date===actDate && month === actMonth && year === actYear){
          activityTotal += parseFloat(activities[i].duration);

        }
      }
      sevenDaysActivities[6-j] = activityTotal;


    }


    return (
      <View>
          <Text style={{color:'rgb(134, 65, 244)'}}>Goal Daily Activities: {goalDailyActivity}</Text>
          <XAxis
                  style={{color:'#E4572E'}}
                  data={sevenDaysActivities}
                  scale={scale.scaleBand}
                  formatLabel={ (_, index) => sevenDaysActivities[index]}
                  labelStyle={ {color:'rgb(134, 65, 244)'} }
              />
      </View>
    );

  }


  getActivities(selectDate){
    //get activities of the same day from /Activities parse string to json for matching
    //edit from /activities/id

    let goalDailyActivity = parseFloat(this.state.goalDailyActivity);
    let goalDailyCalories = parseFloat(this.state.goalDailyCalories);

    let activityTotal = 0;
    let caloriesTotal = 0;
    selectDate = new Date(selectDate);

    let year = selectDate.getFullYear();
    let date = selectDate.getDate();
    let month = selectDate.getMonth();
    let activities =this.state.activities;
    let activityList = [];
    for(var i = 0; i < activities.length; i++){
      let tempDate = new Date(activities[i].date);
      let actDate = tempDate.getDate();
      let actYear = tempDate.getFullYear();
      let actMonth = tempDate.getMonth();

      if(date===actDate && month === actMonth && year === actYear){
        activityTotal += parseFloat(activities[i].duration);
        caloriesTotal += parseFloat(activities[i].calories);
        let id = activities[i].id;
        activityList.push(
          <>
          <ListItem
          key = {i}
          title= {activities[i].name}
          subtitle={
            <View >
              <Text>Time: {new Date(activities[i].date).toTimeString()}</Text>
              <Text>Duration: {activities[i].duration} mins</Text>
              <Text>Calories: {activities[i].calories} kcals</Text>
            </View>
          }
          leftIcon={
            <Icon
              name='bicycle'
              type = 'font-awesome'
              size={24}
              color='gray'

            />
          }
          bottomDivider
          rightElement={
            <Button buttonStyle={{backgroundColor: '#aaaaaa', padding: 5, borderRadius: 5}}
            textStyle={{color: '#ffffff'}} text={'Edit'} onPress={() => this.editActivity(id)}/>
          }
        />

        <Button buttonStyle={{backgroundColor: '#aaaaaa', alignItems:"center",padding: 5, borderRadius: 5}}
        textStyle={{color: '#ffffff'}} text={'Delete'} onPress={() => this.deleteActivity(id)}/>
        </>
        );
      }
    }
    if(activityList.length > 0){
      let percent = 0;
      if(goalDailyActivity!==0){
        percent = Math.round(activityTotal/goalDailyActivity);
      }
      else if(goalDailyActivity===0 && activityTotal!==0){
        percent = 1;
      }


      activityList.push(
        <View style={{margin:10, backgroundColor: 'white', borderRadius: 10}}>
          <ProgressCircle style={{ height: 150 }} progress={percent} progressColor={'rgb(134, 65, 244)'}>
            <View style={{justifyContent: 'center',alignItems:"center"}}>
              <Text style={{justifyContent: 'center',alignItems:"center"}}>Goal Activity mins:
              {goalDailyActivity}</Text>
              <Text>{100*percent}%</Text>
            </View>
          </ProgressCircle>
        </View>
      );
      return(activityList);
    }
    else{
      return(
        <>
         <Text style={{justifyContent: 'center',alignItems:"center"}}>Do some exercises first!</Text>
        </>
        );
    }


  }



  async editActivity(id){
    await this.setState({id:id});
    await this.setState({editOption:"activity"});
    this.showModal();
  }

  async editMeal(id){
    await this.setState({id:id});
    await this.setState({editOption:"meal"});
    this.showModal();
  }

  async editFood(mealId,id){
    await this.setState({mealId:mealId});
    await this.setState({id:id});
    await this.setState({editOption:"food"});
    this.showModal();
  }

  deleteActivity(id){
    fetch('https://mysqlcs639.cs.wisc.edu/activities/' + id, {
       method: 'DELETE',
       headers: {
         Accept: 'application/json',
         'Content-Type': 'application/json',
         'x-access-token':this.state.token,
       },
    }).then((response) => response.json())
      .then((responseJson) => {
        this.allActivities();
        // this.setState({message:responseJson.message});
      })
      .catch((error) => {
        console.error(error);
      });
  }

  deleteMeal(id){
    fetch('https://mysqlcs639.cs.wisc.edu/meals/' + id, {
       method: 'DELETE',
       headers: {
         Accept: 'application/json',
         'Content-Type': 'application/json',
         'x-access-token':this.state.token,
       },
    }).then((response) => response.json())
      .then((responseJson) => {
        this.allMeals();
        // this.setState({message:responseJson.message});
      })
      .catch((error) => {
        console.error(error);
      });
  }

  deleteFood(mealId,id){
    fetch('https://mysqlcs639.cs.wisc.edu/meals/'+mealId +"/foods/"+ id, {
       method: 'DELETE',
       headers: {
         Accept: 'application/json',
         'Content-Type': 'application/json',
         'x-access-token':this.state.token,
       },
    }).then((response) => response.json())
      .then((responseJson) => {
        this.allMeals();
        // this.setState({message:responseJson.message});
      })
      .catch((error) => {
        console.error(error);
      });
  }

  showModal() {
    this.setState({showModal: true});
  }

  async hideModal() {
    await this.allActivities();
    await this.allMeals();
    // let editOption = this.props.editOption;
    //     if(editOption === "activity"){
    //       await this.allActivities();
    //     }
    //     else if(editOption === "food"){
    //       await this.allFoods();
    //     }
    //     else if(editOption === "meal"){
    //       await this.allMeals();
    //     }
   await this.setState({showModal: false});

  }


  render(){
    return (
      <View accessibility={true}>
      <ScrollView>
      <Card title={"Activities on " + this.state.date.toDateString()}>
        {this.getActivities(this.state.date)}
        <Text style={{textAlign:'center'}}>{this.state.message}</Text>
      </Card>

      <Card title={"Meals on " + this.state.date.toDateString()}>
        {this.getMeals(this.state.date)}
        <Text style={{textAlign:'center'}}>{this.state.message}</Text>
      </Card>

      <Card title={"Activities for past seven days"}>
        {this.getSevenActivities(this.state.date)}
      </Card>
      <Card title={"Nutrition for past seven days"}>
         {this.getSevenNutrition()}
      </Card>
      </ScrollView>
      <Modal width={300} height={600} show={this.state.showModal} hide={() => this.hideModal()} option="edit" editOption={this.state.editOption} mealId= {this.state.mealId} id={this.state.id}/>
      </View>

    );
  }
    // {this.getActivities(this.state.date)}


}


export default withNavigation(Summary);
