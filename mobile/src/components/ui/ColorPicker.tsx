import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  FlatList,
  TouchableWithoutFeedback
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { setCounterColor } from '../../store/gameSlice';
import { colors, shadows, spacing } from '../../styles/theme';

const COLORS = [
  '#FF0000', // Red
  '#FF7700', // Orange
  '#FFFF00', // Yellow
  '#00FF00', // Green
  '#00FFFF', // Cyan
  '#0000FF', // Blue
  '#FF00FF', // Magenta
  '#FFFFFF', // White
];

const ColorPicker: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const currentColor = useSelector((state: RootState) => state.game.counterColor);

  const handleColorChange = (color: string) => {
    dispatch(setCounterColor(color));
    setModalVisible(false);
  };

  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[styles.colorOption, { backgroundColor: item }]}
      onPress={() => handleColorChange(item)}
      accessibilityLabel={`Set counter color to ${item}`}
    />
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.colorButton, { backgroundColor: currentColor }]}
        onPress={() => setModalVisible(true)}
        accessibilityLabel="Open counter color picker"
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.pickerContainer}>
                <FlatList
                  data={COLORS}
                  renderItem={renderItem}
                  keyExtractor={(item) => item}
                  numColumns={4}
                  contentContainerStyle={styles.colorList}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  colorButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: colors.textPrimary,
    ...shadows.medium,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    width: 200,
    padding: spacing.medium,
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.digitalBackground,
    ...shadows.large,
  },
  colorList: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.small,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: spacing.small,
    borderWidth: 1,
    borderColor: colors.textSecondary,
    ...shadows.small,
  },
});

export default ColorPicker; 