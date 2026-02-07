import React from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
// 提示：需要先安装 react-native-calendars
// npm install react-native-calendars
import {Calendar, type DateObject} from 'react-native-calendars';

interface DatePickerModalProps {
  visible: boolean;
  initialDate: string;
  onConfirm: (date: string) => void;
  onClose: () => void;
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({
  visible,
  initialDate,
  onConfirm,
  onClose,
}) => {
  const [selected, setSelected] = React.useState<string>(initialDate);

  React.useEffect(() => {
    setSelected(initialDate);
  }, [initialDate]);

  const handleDayPress = (day: DateObject) => {
    setSelected(day.dateString);
  };

  const handleConfirm = () => {
    onConfirm(selected);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <Text style={styles.title}>选择入住日期</Text>
          <Calendar
            current={selected}
            onDayPress={handleDayPress}
            markedDates={
              selected
                ? {
                    [selected]: {
                      selected: true,
                      selectedColor: '#3B82F6',
                    },
                  }
                : undefined
            }
          />
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              activeOpacity={0.8}>
              <Text style={styles.cancelText}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={handleConfirm}
              activeOpacity={0.8}>
              <Text style={styles.confirmText}>确定</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 8,
    paddingBottom: 8,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  cancelButton: {
    marginRight: 8,
  },
  confirmButton: {
    backgroundColor: '#4A90E2',
  },
  cancelText: {
    fontSize: 14,
    color: '#666',
  },
  confirmText: {
    fontSize: 14,
    color: '#fff',
  },
});

export default DatePickerModal;

