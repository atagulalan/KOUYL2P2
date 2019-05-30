import React, { Component } from "react";
/* https://documentation.onesignal.com/docs/react-native-sdk-setup */
import OneSignal from "react-native-onesignal";

import {
  Text,
  View,
  Picker,
  Image,
  TouchableNativeFeedback,
  BackHandler,
  ToastAndroid,
  FlatList,
  StyleSheet
} from "react-native";

export default class App extends Component {
  /* https://stackoverflow.com/questions/46065819/remove-top-navigation-bar-for-certain-screens */
  static navigationOptions = {
    title: "Tick",
    header: null
  };

  constructor(props) {
    super(props);
    OneSignal.init("7d5f91ae-d848-475e-b3cc-470d3f2b9fcc");
    OneSignal.addEventListener("received", this.onReceived.bind(this));
    OneSignal.addEventListener("opened", this.onOpened.bind(this));
    this.state = {
      news: [],
      categories: [],
      currentCategory: ""
    };
  }

  /* http://www.avarekodcu.com/konu/17/react-native-ornek-login-uygulamasi-3-ajax-kullanimi-istekler-ve-uyarilar */
  /* https://hackernoon.com/react-native-how-to-setup-your-first-app-a36c450a8a2f */
  /* https://blog.usejournal.com/understanding-react-native-component-lifecycle-api-d78e06870c6d */
  /* https://stackoverflow.com/questions/43380260/draw-horizontal-rule-in-react-native */
  /* https://stackoverflow.com/questions/32030050/how-can-you-float-right-in-react-native */
  /* https://www.youtube.com/watch?v=22LEiBYBiTw */

  getItems() {
    req("/list/" + this.state.currentCategory, "GET", null, res => {
      let categories = {};

      // eski kategorileri tut
      this.state.categories.map(cat => {
        categories[cat] = 1;
      });

      res.map(item => {
        item.category.map(cat => {
          categories[cat] = 1;
        });
      });

      res.reverse();

      this.setState({
        news: res,
        categories: Object.keys(categories)
      });

      /* https://github.com/facebook/react-native/issues/13560 */
      this.refs.listRef.scrollToOffset({ x: 0, y: 0, animated: true });
    });
  }

  handleBackPress(e) {
    ToastAndroid.show("Güncelleniyor", ToastAndroid.SHORT);
    this.getItems();
    return true;
  }

  componentWillMount() {
    this.getItems();
  }

  componentDidMount() {
    this.props.navigation.addListener("willFocus", () => {
      this.backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        this.handleBackPress.bind(this)
      );
    });
    this.props.navigation.addListener("willBlur", () => {
      this.backHandler.remove();
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackPress.bind(this)
    );
    OneSignal.removeEventListener("received", this.onReceived.bind(this));
    OneSignal.removeEventListener("opened", this.onOpened.bind(this));
  }

  onReceived() {
    // Yeni haber geldi, yenile
    this.getItems();
  }

  onOpened(openResult) {
    const { navigate } = this.props.navigation;
    navigate("Home");
    setTimeout(function() {
      navigate("Post", {
        slug: openResult.notification.payload.additionalData.slug,
        title: openResult.notification.payload.additionalData.title
      });
    }, 300);
  }

  newsList({ item }) {
    const { navigate } = this.props.navigation;

    // Tick Admin'den alıntı
    let monthArr = "Ocak,Şubat,Mart,Nisan,Mayıs,Haziran,Temmuz,Ağustos,Eylül,Ekim,Kasım,Aralık".split(
      ","
    );
    var c = new Date(item.date);
    var dateString =
      c.getDate() + " " + monthArr[c.getMonth()] + " " + c.getFullYear();

    return (
      <TouchableNativeFeedback
        key={item.slug}
        onPress={() => navigate("Post", { slug: item.slug, title: item.title })}
      >
        <View style={styles.box}>
          <Image
            style={styles.boxImage}
            source={{ uri: baseURL + item.image }}
          />
          <Text style={styles.boxTitle}>{item.title}</Text>
          <View style={styles.boxDownWrapper}>
            <Text style={styles.boxTags}>
              {item.category.join(", ").toUpperCase()}
            </Text>
            <Text style={styles.boxTime}>{dateString}</Text>
          </View>
        </View>
      </TouchableNativeFeedback>
    );
  }

  render() {
    return (
      <View style={styles.mainView}>
        <View style={styles.header}>
          <Text style={styles.logo}>tick</Text>
          <Picker
            selectedValue={this.state.currentCategory}
            style={styles.picker}
            onValueChange={itemValue =>
              this.setState({ currentCategory: itemValue }, this.getItems)
            }
          >
            <Picker.Item label="Tümü" value="" />
            {this.state.categories.map(e => (
              <Picker.Item key={e} label={e} value={e} />
            ))}
          </Picker>
        </View>
        <FlatList
          data={this.state.news}
          extraData={this.state}
          keyExtractor={(item, index) => item.slug}
          renderItem={this.newsList.bind(this)}
          ref="listRef"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  box: {
    borderBottomColor: "#edeef1",
    borderBottomWidth: 1,
    width: "100%",
    marginBottom: 25,
    backgroundColor: "#f9f9f9"
  },
  boxImage: {
    width: "100%",
    height: 150,
    backgroundColor: "#eff0f1"
  },
  boxTitle: {
    fontFamily: "Nunito-SemiBold",
    fontSize: 20,
    paddingTop: 10,
    paddingLeft: 25,
    paddingRight: 25,
    color: "#101010",
    paddingBottom: 0,
    textTransform: "capitalize",
    borderTopColor: "#edeef1",
    borderTopWidth: 1
  },
  boxDownWrapper: {
    justifyContent: "space-between",
    flexDirection: "row",
    paddingBottom: 10,
    paddingLeft: 25,
    paddingRight: 25
  },
  boxTags: {
    fontFamily: "Nunito-Regular",
    fontSize: 14,
    paddingTop: 5,
    alignSelf: "flex-start",
    color: "#575757"
  },
  boxTime: {
    fontFamily: "Nunito-Regular",
    fontSize: 14,
    color: "#575757",
    alignSelf: "flex-end"
  },
  mainView: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: 0,
    fontFamily: "Nunito-Bold"
  },
  header: {
    justifyContent: "space-around",
    flexDirection: "row",
    height: 55,
    paddingLeft: 25,
    paddingRight: 25,
    borderBottomColor: "#edeef1",
    borderBottomWidth: 2
  },
  logo: {
    lineHeight: 50,
    width: "50%",
    alignSelf: "flex-start",
    fontFamily: "Nunito-Black",
    fontSize: 26,
    color: "#1e96ff"
  },
  picker: {
    lineHeight: 50,
    width: "50%",
    alignSelf: "flex-end"
  }
});
