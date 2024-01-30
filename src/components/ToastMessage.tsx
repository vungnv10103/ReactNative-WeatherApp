import { View, Text, Button } from 'react-native'
import React from 'react'

import FlashMessage, { showMessage, hideMessage, FlashMessageManager, MessageType } from "react-native-flash-message";

export default class ToastMessage extends React.Component {
    render(): React.ReactNode {
        return (
            <View>
                <Button
                    onPress={() => {
                        /* HERE IS WHERE WE'RE GOING TO SHOW OUR FIRST MESSAGE */
                        showMessage({
                            message: "Simple message",
                            type: "info",
                        });
                    }}
                    title="Request Details"
                    color="#841584"
                />
                <FlashMessage position="top" />
            </View>
        )
    }
}