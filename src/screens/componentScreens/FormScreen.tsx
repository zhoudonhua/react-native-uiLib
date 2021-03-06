import * as _ from "lodash";
import * as React from "react";

import { StyleSheet, ScrollView, ViewStyle } from "react-native";

import {
  Colors,
  View,
  Text,
  Image,
  Stepper,
  Typography,
  Picker,
  Avatar,
  Assets,
  TagsInput,
} from "react-native-ui-lib/src";

import { ContactsListStore } from "../listScreens/ContactsListStore";

const tagIcon = require("../../assets/icons/tags.png");
const dropdown = require("../../assets/icons/chevronDown.png");

const options = [
  { label: "JavaScript", value: "js" },
  { label: "Java", value: "java" },
  { label: "Python", value: "python" },
  { label: "C++", value: "c++", disabled: true },
  { label: "Perl", value: "perl" },
];

const filters = [
  { label: "All", value: 0 },
  { label: "Draft", value: 1 },
  { label: "Published", value: 2 },
  { label: "Scheduled", value: 3 },
];

interface InterfaceProps {}

interface InterfaceState {
  itemsCount: number;
  language: undefined;
  languages: [];
  filter: object;
  contact: object;
  tags: object[];
  tags2: string[];
  tags3: string[];
  nativePickerValue?: string;
}

interface InterfaceStyle {
  container?: ViewStyle;
  componentTitle?: ViewStyle;
  customTag?: ViewStyle;
}

export default class FormScreen extends React.Component<InterfaceProps, InterfaceState> {
  customTagsInput;

  store: ContactsListStore = new ContactsListStore();

  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;
    return {
      title: `${state.params.title}`,
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      itemsCount: 1,
      // language: {value: 'java', label: 'Java'},
      language: undefined,
      languages: [],
      filter: filters[0],
      contact: this.store.conversations[0],
      tags: [{ label: "Amit" }, { label: "Ethan" }],
      tags2: ["Tags", "Input"],
      tags3: ["Non", "Removable", "Tags"],
    };
  }

  private onTagPress = (tagIndex, markedTagIndex) => {
    this.customTagsInput.markTagIndex(tagIndex === markedTagIndex ? undefined : tagIndex);
  };

  private renderCustomTag = (tag, index, shouldMarkToRemove) => {
    return (
      <View style={[styles.customTag, shouldMarkToRemove && { backgroundColor: Colors.purple70 }]}>
        <Text white>{tag.label}</Text>
      </View>
    );
  };

  public render() {
    return (
      <ScrollView keyboardShouldPersistTaps="always">
        <View style={styles.container}>
          <TagsInput
            containerStyle={{ marginBottom: 20 }}
            placeholder="Enter Tags"
            tags={this.state.tags2}
          />

          <TagsInput
            containerStyle={{ marginBottom: 20 }}
            placeholder="with disableTagAdding disableTagRemoval"
            tags={this.state.tags3}
            disableTagRemoval
            disableTagAdding
          />

          <TagsInput
            ref={(r) => (this.customTagsInput = r)}
            containerStyle={{ marginBottom: 20 }}
            placeholder="With custom tags"
            tags={this.state.tags}
            renderTag={this.renderCustomTag}
            onCreateTag={(value) => ({ label: value })}
            onTagPress={this.onTagPress}
            inputStyle={{ ...Typography.text60, color: Colors.blue30 }}
          />

          <Text style={{ ...Typography.text60 }}>Stepper</Text>
          <Stepper
            label={this.state.itemsCount === 1 ? "Item" : "Items"}
            min={1}
            max={5}
            onValueChange={(count) => this.setState({ itemsCount: count })}
            initialValue={1}
          />

          <Picker
            placeholder="Pick a single language"
            value={this.state.language}
            enableModalBlur={false}
            onChange={(item) => this.setState({ language: item })}
            topBarProps={{ title: "Languages" }}
            style={{ color: Colors.red20 }}
            hideUnderline
            showSearch
            searchPlaceholder={"Search a language"}
            searchStyle={{ color: Colors.blue30, placeholderTextColor: Colors.dark50 }}
            // onSearchChange={value => console.warn('value', value)}
          >
            {_.map(options, (option) => (
              <Picker.Item key={option.value} value={option} disabled={option.disabled} />
            ))}
          </Picker>

          <View marginT-20>
            <Picker
              placeholder="Pick multiple Languages"
              value={this.state.languages}
              onChange={(items) => this.setState({ languages: items })}
              mode={Picker.modes.MULTI}
              rightIconSource={dropdown}
            >
              {_.map(options, (option) => (
                <Picker.Item key={option.value} value={option} disabled={option.disabled} />
              ))}
            </Picker>
          </View>

          <Picker
            title="Native Picker"
            placeholder="Pick a Language"
            useNativePicker
            value={this.state.nativePickerValue}
            onChange={(nativePickerValue) => this.setState({ nativePickerValue })}
            rightIconSource={dropdown}
            containerStyle={{ marginTop: 20 }}
            // renderNativePicker={(props) => {
            //   return (
            //     <View flex bg-red50>
            //       <Text>CUSTOM NATIVE PICKER</Text>
            //     </View>
            //   );
            // }}
            // topBarProps={{doneLabel: 'YES', cancelLabel: 'NO'}}
          >
            {_.map(options, (option) => (
              <Picker.Item
                key={option.value}
                value={option.value}
                label={option.label}
                disabled={option.disabled}
              />
            ))}
          </Picker>

          <Text marginT-20 marginB-10 text70 dark60>
            Custom Picker:
          </Text>
          <Picker
            value={this.state.filter}
            onChange={(filter) => this.setState({ filter })}
            renderPicker={({ label }) => {
              return (
                <View row center>
                  <Image
                    style={{ marginRight: 1, height: 16, resizeMode: "contain" }}
                    source={tagIcon}
                  />
                  <Text dark10 text80>
                    {label} Posts
                  </Text>
                </View>
              );
            }}
          >
            {_.map(filters, (filter) => (
              <Picker.Item key={filter.value} value={filter} />
            ))}
          </Picker>

          <Text marginT-20 marginB-10 text70 dark60>
            Custom Picker Items:
          </Text>
          <Picker
            value={this.state.contact}
            onChange={(contact) => this.setState({ contact })}
            getItemValue={(contact) => contact.name}
            renderPicker={(contact) => {
              return (
                <View row center>
                  <Avatar size={30} imageSource={{ uri: contact.thumbnail }} />
                  <Text text70 marginL-10>
                    {contact.name}
                  </Text>
                </View>
              );
            }}
          >
            {_.map(this.store.conversations, (contact) => (
              <Picker.Item
                key={contact.name}
                value={contact}
                renderItem={(item, props) => (
                  <View
                    style={{
                      height: 56,
                      borderBottomWidth: 1,
                      borderColor: Colors.dark80,
                    }}
                    paddingH-15
                    row
                    centerV
                    spread
                  >
                    <View row centerV>
                      <Avatar size={45} imageSource={{ uri: item.thumbnail }} />
                      <Text marginL-10 text70 dark10>
                        {item.name}
                      </Text>
                    </View>
                    {props.isSelected && <Image source={Assets.icons.check} />}
                  </View>
                )}
                getItemLabel={(item) => item.name}
              />
            ))}
          </Picker>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create<InterfaceStyle>({
  container: {
    flex: 1,
    padding: 15,
  },
  componentTitle: {
    ...Typography.text80,
    marginTop: 25,
    marginBottom: 5,
  },
  customTag: {
    backgroundColor: Colors.purple30,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 3,
    marginRight: 10,
    marginBottom: 10,
  },
});
