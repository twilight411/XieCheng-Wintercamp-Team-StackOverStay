import React, {useState, useMemo} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Calendar, DateData} from 'react-native-calendars';

interface RangeDatePickerModalProps {
  visible: boolean;
  initialCheckIn?: string;
  initialCheckOut?: string;
  onClose: () => void;
  onSelect: (checkIn: string, checkOut: string) => void;
}

export function RangeDatePickerModal({
  visible,
  initialCheckIn,
  initialCheckOut,
  onClose,
  onSelect,
}: RangeDatePickerModalProps): React.JSX.Element {
  const [startDate, setStartDate] = useState<string | undefined>(initialCheckIn);
  const [endDate, setEndDate] = useState<string | undefined>(initialCheckOut);

  // Reset state when opening
  React.useEffect(() => {
    if (visible) {
      setStartDate(initialCheckIn);
      setEndDate(initialCheckOut);
    }
  }, [visible, initialCheckIn, initialCheckOut]);

  const onDayPress = (day: DateData) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day.dateString);
      setEndDate(undefined);
    } else if (startDate && !endDate) {
      const start = new Date(startDate).getTime();
      const end = new Date(day.dateString).getTime();

      if (end < start) {
        setStartDate(day.dateString);
        setEndDate(undefined);
      } else {
        setEndDate(day.dateString);
      }
    }
  };

  const markedDates = useMemo(() => {
    const marks: {[key: string]: any} = {};
    
    if (startDate) {
      marks[startDate] = {startingDay: true, color: '#0086F6', textColor: 'white'};
    }
    
    if (endDate) {
      marks[endDate] = {endingDay: true, color: '#0086F6', textColor: 'white'};
    }

    if (startDate && endDate) {
      let current = new Date(startDate);
      const end = new Date(endDate);
      current.setDate(current.getDate() + 1);

      while (current < end) {
        const dateString = current.toISOString().split('T')[0];
        marks[dateString] = {color: '#E6F3FF', textColor: '#333'};
        current.setDate(current.getDate() + 1);
      }
    }

    return marks;
  }, [startDate, endDate]);

  const handleConfirm = () => {
    if (startDate && endDate) {
      onSelect(startDate, endDate);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>选择日期</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <Calendar
            markingType={'period'}
            markedDates={markedDates}
            onDayPress={onDayPress}
            theme={{
              todayTextColor: '#0086F6',
              arrowColor: '#0086F6',
              textDayFontWeight: '500',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '500',
            }}
          />

          <View style={styles.footer}>
            <View style={styles.dateDisplay}>
              <Text style={styles.dateLabel}>入住: {startDate || '请选择'}</Text>
              <Text style={styles.dateLabel}>离店: {endDate || '请选择'}</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.confirmButton,
                (!startDate || !endDate) && styles.disabledButton,
              ]}
              onPress={handleConfirm}
              disabled={!startDate || !endDate}>
              <Text style={styles.confirmText}>确定</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 20, // Add safe area padding if needed
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    padding: 8,
  },
  closeText: {
    fontSize: 18,
    color: '#999',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateDisplay: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  confirmButton: {
    backgroundColor: '#0086F6',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
