import React, { PureComponent } from 'react'
import {
  View,
  Animated,
  TouchableOpacity,
  Dimensions,
  Text,
  StyleSheet
} from 'react-native'

const COLORS = {
  backgroundColor: '#D2D2D2',
  shadowColor: '#E8E8E8',
  backgroundColorItem: '#fff',
  colorText: '#000'
}

const { width } = Dimensions.get('window')
export default class TabSelectorAnimation extends PureComponent {
  state = {
    active: 0,
    xTabOne: 0,
    xTabTwo: 0,
    translateX: new Animated.Value(0),
    translateXTabOne: new Animated.Value(0),
    translateXTabTwo: new Animated.Value(width),
    translateY: -1000,
    height: 0,
  }

  handleSlide = (type, index) => {
    const { onChangeTab } = this.props
    const { active, translateX, translateXTabOne, translateXTabTwo } =
      this.state
    if (onChangeTab) onChangeTab(index)
    Animated.timing(translateX, {
      toValue: this.state[type] || 0,
      delay: 0,
      duration: 200,
      useNativeDriver: false
    }).start()
    if (active === 0) {
      Animated.parallel([
        Animated.spring(translateXTabOne, {
          toValue: 0,
          duration: 100,
          useNativeDriver: false
        }).start(),
        Animated.spring(translateXTabTwo, {
          toValue: width,
          duration: 100,
          useNativeDriver: false
        }).start()
      ])
    } else {
      Animated.parallel([
        Animated.spring(translateXTabOne, {
          toValue: -width,
          useNativeDriver: false,
          duration: 100
        }).start(),
        Animated.spring(translateXTabTwo, {
          toValue: 0,
          duration: 100,
          useNativeDriver: false
        }).start()
      ])
    }
  }

  render() {
    const {
      tabs = [],
      style,
      styleTitle,
      backgroundColor,
      styleTab,
      styleSelectedTab,
    } = this.props
    const { translateX } = this.state
    return (
      <View
        style={[
          styles.container,
          style,
          {
            backgroundColor: backgroundColor || COLORS.backgroundColor
          }
        ]}
      >
        <Animated.View
          style={[
            styles.animatedView,
            styleSelectedTab,
            {
              width: `${97 / tabs.length}%`,
              height,
              transform: [
                {
                  translateX
                }
              ]
            }
          ]}
        />
        {tabs.map((item, index) => (
          <TouchableOpacity
            key={item.title}
            style={[styles.tab, styleTab]}
            onLayout={(event) =>
              this.setState({
                [`xTab${index}`]: event.nativeEvent.layout.x,
                height: event.nativeEvent.layout.height,
              })
            }
            onPress={() =>
              this.setState({ active: index }, () =>
                this.handleSlide(`xTab${index}`, index)
              )
            }
          >
            <Text style={[styles.textTitle, styleTitle]}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textTitle: {
    fontSize: 13,
    color: COLORS.colorText
  },
  animatedView: {
    position: 'absolute',
    height: 34,
    top: 0,
    left: 0,
    backgroundColor: COLORS.backgroundColorItem,
  }
})

module.exports = TabSelectorAnimation
module.exports.default = TabSelectorAnimation
