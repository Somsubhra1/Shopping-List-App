import React, { Component } from "react";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    Form,
    FormGroup,
    Label,
    Input,
    NavLink,
    Alert
} from "reactstrap";
import { connect } from "react-redux";
import { register } from "../../actions/authActions";
import { clearErrors } from "../../actions/errorActions";
import PropTypes from "prop-types";

class RegisterModal extends Component {
    state = {
        modal: false,
        name: "",
        email: "",
        password: "",
        msg: null
    };

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
        register: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired
    };

    componentDidUpdate(prevProps) {
        const { error, isAuthenticated } = this.props;
        if (error !== prevProps.error) {
            // Check for register error
            if (error.id === "REGISTER_FAIL") {
                this.setState({ msg: error.msg.msg });
            } else {
                this.setState({ msg: null });
            }
        }

        if (this.state.modal) {
            if (isAuthenticated) {
                this.toggle();
            }
        }
    }

    toggle = () => {
        this.props.clearErrors();
        this.setState({ modal: !this.state.modal });
    };

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    onSubmit = e => {
        e.preventDefault();

        const { name, email, password } = this.state;

        // Create user object
        const newUser = {
            name,
            email,
            password
        };

        // Attempt to register
        this.props.register(newUser);

        // Close modal
        // this.toggle();

        // // Reset input field
        // this.setState({ name: "" });
    };

    render() {
        return (
            <div>
                <NavLink onClick={this.toggle} href="#">
                    Register
                </NavLink>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Register</ModalHeader>
                    <ModalBody>
                        {this.state.msg ? (
                            <Alert color="danger">{this.state.msg}</Alert>
                        ) : null}
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>
                                <Label for="name">Name</Label>
                                <Input
                                    className="mb-3"
                                    type="text"
                                    name="name"
                                    id="name"
                                    placeholder="Name"
                                    onChange={this.onChange}
                                    value={this.state.name}
                                />
                                <Label for="email">Email</Label>
                                <Input
                                    className="mb-3"
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="Email"
                                    onChange={this.onChange}
                                    value={this.state.email}
                                />
                                <Label for="password">Password</Label>
                                <Input
                                    className="mb-3"
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="Password"
                                    onChange={this.onChange}
                                    value={this.state.password}
                                />
                                <Button
                                    color="dark"
                                    style={{ marginTop: "2rem" }}
                                    block
                                    disabled={
                                        // this.state.name.trim() === "" ||
                                        // this.state.email.trim() === "" ||
                                        // this.state.password.trim() === ""
                                        //     ? true
                                        //     : false
                                        false
                                    }
                                >
                                    Register
                                </Button>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    error: state.error
});

export default connect(
    mapStateToProps,
    { register, clearErrors }
)(RegisterModal);
