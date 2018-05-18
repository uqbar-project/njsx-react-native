import njsx, { Builder, NJSXConfig } from 'njsx'
import * as ReactNative from 'react-native'

// TODO: Replace with spread operator once Typescript suports spread of generics (https://github.com/Microsoft/TypeScript/pull/13288)
const { keys, assign } = Object

declare module 'njsx' {
  export interface Builder<P> {
    (head: NJSXStyle | BuilderArgument<P>, ...tail: (NJSXStyle | BuilderArgument<P>)[]): Builder<P>
  }
}

export interface NJSXStyle {
  __styleId__: ReactNative.RegisteredStyle<ReactNative.ViewStyle | ReactNative.TextStyle | ReactNative.ImageStyle>
}

export const StyleSheet = {
  create<T extends ReactNative.StyleSheet.NamedStyles<T>>(styleDefinition: T) {
    const reactStyle = ReactNative.StyleSheet.create(styleDefinition)
    return keys(reactStyle).reduce((acum, key) =>
      assign(acum, { [key]: { __styleId__: reactStyle[key as keyof T] } })
      , {} as { [P in keyof T]: NJSXStyle })
  },
}


// TODO: Test this rules
NJSXConfig.argumentTransformations.push(arg =>
  typeof arg === 'object' && arg.hasOwnProperty('__styleId__') ? { style: arg.__styleId__ } : arg
)

NJSXConfig.dynamicSelectorHandler = undefined

// TODO: Check if this list is really complete
export const ActivityIndicator: Builder<ReactNative.ActivityIndicatorProps> = njsx(ReactNative.ActivityIndicator)
export const Button = njsx(ReactNative.Button)
export const DatePickerIOS = njsx(ReactNative.DatePickerIOS)
export const DrawerLayoutAndroid = njsx(ReactNative.DrawerLayoutAndroid)
export const FlatList = njsx(ReactNative.FlatList)
export const Image = njsx(ReactNative.Image)
export const KeyboardAvoidingView = njsx(ReactNative.KeyboardAvoidingView)
export const ListView = njsx(ReactNative.ListView)
export const MapView = njsx(ReactNative.MapView)
export const Modal = njsx(ReactNative.Modal)
export const NavigatorIOS = njsx(ReactNative.NavigatorIOS)
export const Picker = njsx(ReactNative.Picker)
export const PickerIOS = njsx(ReactNative.PickerIOS)
export const ProgressBarAndroid = njsx(ReactNative.ProgressBarAndroid)
export const ProgressViewIOS = njsx(ReactNative.ProgressViewIOS)
export const RefreshControl = njsx(ReactNative.RefreshControl)
export const ScrollView = njsx(ReactNative.ScrollView)
export const SectionList = njsx(ReactNative.SectionList)
export const SegmentedControlIOS = njsx(ReactNative.SegmentedControlIOS)
export const Slider = njsx(ReactNative.Slider)
export const SnapshotViewIOS = njsx(ReactNative.SnapshotViewIOS)
export const StatusBar = njsx(ReactNative.StatusBar)
export const Switch = njsx(ReactNative.Switch)
export const TabBarIOS = njsx(ReactNative.TabBarIOS)
export const TabBarIOSItem = njsx(ReactNative.TabBarIOS.Item)
export const Text = njsx(ReactNative.Text)
export const TextInput = njsx(ReactNative.TextInput)
export const ToolbarAndroid = njsx(ReactNative.ToolbarAndroid)
export const TouchableHighlight = njsx(ReactNative.TouchableHighlight)
export const TouchableNativeFeedback = njsx(ReactNative.TouchableNativeFeedback)
export const TouchableOpacity = njsx(ReactNative.TouchableOpacity)
export const TouchableWithoutFeedback = njsx(ReactNative.TouchableWithoutFeedback)
export const View = njsx(ReactNative.View)
export const ViewPagerAndroid = njsx(ReactNative.ViewPagerAndroid)