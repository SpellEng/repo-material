import React, { useState } from 'react'
import { Form, Input, Button } from "antd";
import axios from 'axios';
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import { ErrorAlert, SuccessAlert } from '../../Components/Messages/messages';

const ResetPassword = () => {
    const location = useLocation();
    const router = useNavigate();
    const token = location.pathname.split("password/")[1];
    const [form] = Form.useForm();
    const [submitted, setSubmitted] = useState(false);

    const onFinish = async (values) => {
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/users/reset-password`, { token, password: values.password, confirm: values.confirm }).then(res => {
            if (res.status === 200) {
                SuccessAlert(res.data.successMessage);
                router("/login");
            } else {
                ErrorAlert(res.data.errorMessage);
            }
        }).catch(err => {
            console.log(err)
            ErrorAlert(err?.message);
        })
    };

    return (
        <div className='ForgotPassword'>
            <div className="inner">
                <h2>Update Password</h2>
                {
                    !submitted ?
                        <>
                            <Form
                                layout="vertical"
                                form={form}
                                name="nest-messages"
                                requiredMark={false}
                                onFinish={onFinish}
                                style={{
                                    maxWidth: 600,
                                }}
                            >
                                <Form.Item
                                    name="password"
                                    label="Password"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your password!',
                                        },
                                    ]}
                                    hasFeedback
                                >
                                    <Input.Password placeholder='Enter password' />
                                </Form.Item>

                                <Form.Item
                                    name="confirm"
                                    label="Confirm Password"
                                    dependencies={['password']}
                                    hasFeedback
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please confirm your password!',
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('The new password that you entered do not match!'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password placeholder='Confirm password' />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Reset Password
                                    </Button>
                                </Form.Item>
                            </Form>
                        </>
                        :
                        <div>
                            <Button type="primary" onClick={() => router.push("/login")} htmlType="submit">
                                Back to log in
                            </Button>
                        </div>
                }
            </div>
        </div>
    )
}

export default ResetPassword
