import { createStyleSheet } from "react-native-unistyles";


const commonStylesheet = createStyleSheet(theme => ({
    button: {
       backgroundColor: theme.colors.mainColor
    }
}))

export default commonStylesheet;