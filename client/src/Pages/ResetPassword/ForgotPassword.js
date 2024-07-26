import React, { useState } from 'react'
import { Form, Input, Button } from "antd";
import axios from 'axios';
import { Link } from "react-router-dom";
import "./ForgotPassword.css";
import { ErrorAlert, SuccessAlert } from '../../Components/Messages/messages';

const ForgotPassword = () => {
    const [form] = Form.useForm();
    const [submitted, setSubmitted] = useState(false);

    const onFinish = async (values) => {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/send/forgot-email`, { email: values.email }).then(res => {
            if (res.status === 200) {
                SuccessAlert(res.data.successMessage);
                setSubmitted(true);
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
                <h2>Enter your email to send Reset Password Link</h2>
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
                                    name='email'
                                    label="Email"
                                    rules={[
                                        {
                                            type: 'email',
                                            message: 'The input is not valid E-mail!',
                                        },
                                        {
                                            required: true,
                                            message: 'Please input your E-mail!',
                                        },
                                    ]}
                                >
                                    <Input placeholder='Enter email' />
                                </Form.Item>
                                <Form.Item>
                                    <Button type='primary' htmlType="submit">
                                        Continue
                                    </Button>
                                </Form.Item>
                            </Form>
                        </>
                        :
                        <div>
                            <p className='mt-0 text-center mb-5'>
                                Reset password link has been sent to {form.getFieldValue('email')}. Check your spam and promotions folder if it doesn’t appear in your inbox.
                            </p>
                            <div className='d-flex justify-content-center gap-2'>
                                <div>Didn’t received the reset instructions?</div>
                                <Link to="#" onClick={() => setSubmitted(false)}>Resend Email</Link>
                            </div>
                        </div>
                }
            </div>
        </div>
    )
}

export default ForgotPassword
