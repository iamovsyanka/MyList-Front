import React from "react";
import {Button} from 'react-bootstrap';

export default class ErrorBoundary extends React.Component {
    state = {
        hasError: false,
    };

    componentDidCatch(error) {
        // Здесь можно отправлять данные в сервис сбора ошибок
        this.setState({ hasError: true });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div>
                   <Button type="primary" key="console">
                       Some action to recover
                   </Button>
                </div>
            );
        }
        return this.props.children;
    }
}
