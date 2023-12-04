import AppNavigator from "./navigator/AppNavigator";
import {LogBox, View} from "react-native";
import Toast from 'react-native-toast-message';
import {AuthProvider} from "./hooks/useAuth";

LogBox.ignoreLogs([
    'ViewPropTypes will be removed',
    'ColorPropType will be removed',
]);
LogBox.ignoreAllLogs();

export default function App() {
    return (
        <View style={{flex: 1}}>
            <AuthProvider>
                <AppNavigator/>
                <Toast/>
            </AuthProvider>
        </View>);
}

