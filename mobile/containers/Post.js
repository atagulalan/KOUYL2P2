import React from "react";
import DeviceInfo from "react-native-device-info";

import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableNativeFeedback
} from "react-native";

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deviceId: "",
      new: {
        title: "",
        content: "",
        category: [],
        date: 0,
        stats: {
          like: 0,
          dislike: 0,
          views: 0
        }
      }
    };
  }

  getNew(slug) {
    req("/view/" + slug, "GET", null, res => {
      this.setState({
        new: res
      });
    });
  }

  /* https://facebook.github.io/react-native/docs/network */
  vote(diff) {
    req(
      "/vote",
      "POST",
      JSON.stringify({
        /* https://aboutreact.com/react-native-get-unique-id-of-device/ */
        userid: this.state.deviceId,
        slug: this.state.new.slug,
        diff
      }),
      res => {
        this.setState({
          new: {
            ...this.state.new,
            stats: res
          }
        });
      }
    );
  }

  componentDidMount() {
    var id = DeviceInfo.getUniqueID();
    this.setState({ deviceId: id });
    this.props.navigation.addListener("willFocus", payload => {
      let { slug } = payload.state.params;
      this.getNew(slug);
    });
  }

  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.title}`,
    headerTitleStyle: {
      textAlign: "center",
      alignSelf: "center",
      fontWeight: "400"
    },
    headerStyle: {
      backgroundColor: "white",
      height: 50
    }
  });

  render() {
    return (
      <View style={styles.mainView}>
        <ScrollView style={styles.scroll}>
          <Image
            resizeMode="cover"
            style={styles.postImage}
            source={{ uri: baseURL + this.state.new.image }}
          />
          <Text style={styles.postTitle}>{this.state.new.content}</Text>
        </ScrollView>
        <View style={styles.feedback}>
          <View style={styles.statWrapper} onPress={() => this.vote(1)}>
            <Text style={styles.numbers}>{this.state.new.stats.views}</Text>
            <Text style={styles.stat}>Views</Text>
          </View>
          <TouchableNativeFeedback
            key="like"
            onPress={() => this.vote(1)}
            style={styles.padder}
          >
            <View style={styles.statWrapper}>
              <Text style={styles.stat}>Like</Text>
              <Text style={styles.numbers}>({this.state.new.stats.like})</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            key="dislike"
            onPress={() => this.vote(-1)}
            style={styles.padder}
          >
            <View style={styles.statWrapper}>
              <Text style={styles.stat}>Dislike</Text>
              <Text style={styles.numbers}>({this.state.new.stats.dislike})</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: 0,
    fontFamily: "Nunito-Bold"
  },
  postImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#eff0f1"
  },
  postTitle: {
    padding: 20,
    color: "#000307",
    borderTopColor: "#edeef1",
    borderTopWidth: 2
  },
  feedback: {
    height:42,
    justifyContent: "space-around",
    flexDirection: "row",
    borderTopColor: "#edeef1",
    borderTopWidth: 2,
    textAlign: "center"
  },
  statWrapper: {
    fontSize: 15,
    flexDirection: "row",
    height:38,
    paddingLeft:30,
    paddingRight:30,
    alignItems: "center"
  },
  stat: {
    color: "#999",
    paddingRight:2,
    paddingLeft:2,
  },
  numbers: {
    color: "#555",
    paddingRight:2,
    paddingLeft:2,
  },
});
