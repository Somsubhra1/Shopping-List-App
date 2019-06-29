import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "reactstrap";
import "./App.css";
import AppNavbar from "./components/AppNavbar";
import ShoppingList from "./components/ShoppingList";
import { Provider } from "react-redux";
import store from "./store";
import ItemModal from "./components/ItemModal";
import { loadUser } from "./actions/authActions";

export default class App extends Component {
    componentDidMount() {
        store.dispatch(loadUser());
    }

    render() {
        return (
            <Provider store={store}>
                <div className="App">
                    <AppNavbar />
                    <Container>
                        <ItemModal />
                        <ShoppingList />
                    </Container>
                </div>
            </Provider>
        );
    }
}
