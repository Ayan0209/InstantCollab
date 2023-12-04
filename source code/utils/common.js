
import Toast from 'react-native-toast-message';

export const  ToastSuccess = (text) => {
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: text
    });
}


