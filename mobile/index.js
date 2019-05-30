import { AppRegistry } from "react-native";
import HomeScreen from "./containers/List";
import Post from "./containers/Post";
import { createStackNavigator, createAppContainer } from "react-navigation";

let appName = "tick";
global.baseURL = "https://tick.xava.me";
global.req = (url, type, body, callback) => {
  fetch(baseURL + url, {
    method: type,
    headers: { "Content-Type": "application/json" },
    body
  })
    .then(res => res.json())
    .then(res => {
      if (res.result != -1) {
        if (callback) {
          callback(res);
        }
      } else {
        Alert.alert("Veri boş", "?");
      }
    })
    .catch(error => {
      Alert.alert("Hata", "Sunucuya bağlanırken bir hata oluştu" + error);
    });
};

const MainNavigator = createStackNavigator({
  Home: { screen: HomeScreen },
  Post: { screen: Post }
});

AppRegistry.registerComponent(appName, () => createAppContainer(MainNavigator));
