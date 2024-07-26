import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, DatePicker } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import moment from 'moment';
import AdminLayout from '../../../Layouts/Admin/AdminLayout';
import { Pencil, Trash } from 'lucide-react';
import { SuccessAlert } from '../../../Components/Messages/messages';

const AdminCoupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingCoupon, setEditingCoupon] = useState(null);

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/coupons`, {
                headers: {
                    authorization: 'Bearer ' + localStorage.getItem("token")
                }
            });
            setCoupons(response.data);
        } catch (error) {
            console.error('Failed to fetch coupons', error);
        }
        setLoading(false);
    };

    const deleteHandler = async (id) => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/coupons/delete/${id}`, {
                headers: {
                    authorization: 'Bearer ' + localStorage.getItem("token")
                }
            });
            SuccessAlert(response.data.successMessage);
            fetchCoupons();
        } catch (error) {
            console.error('Failed to fetch coupons', error);
        }
    };

    const showAddCouponModal = () => {
        setEditingCoupon(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const showEditCouponModal = (record) => {
        setEditingCoupon(record);
        form.setFieldsValue({
            ...record,
            startDate: dayjs(record.startDate, "YYYY-MM-DD"),
            endDate: dayjs(record.endDate, "YYYY-MM-DD"),
        });
        setIsModalVisible(true);
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            if (editingCoupon) {
                await axios.put(`${process.env.REACT_APP_BACKEND_URL}/coupons/update/${editingCoupon._id}`, values, {
                    headers: {
                        authorization: 'Bearer ' + localStorage.getItem("token")
                    }
                });
            } else {
                await axios.post(`${process.env.REACT_APP_BACKEND_URL}/coupons/create`, values, {
                    headers: {
                        authorization: 'Bearer ' + localStorage.getItem("token")
                    }
                });
            }
            setIsModalVisible(false);
            fetchCoupons();
        } catch (error) {
            console.error('Failed to save coupon', error);
        }
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    const columns = [
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Discount (%)',
            dataIndex: 'discount',
            key: 'discount',
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (text) => moment(text).format('YYYY-MM-DD'),
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (text) => moment(text).format('YYYY-MM-DD'),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <div className='d-flex gap-3 align-items-center'>
                    <Pencil onClick={() => showEditCouponModal(record)} />
                    <Trash onClick={() => deleteHandler(record?._id)} />
                </div>
            ),
        },
    ];

    return (
        <AdminLayout sidebar>
            <div className='text-end'>
                <Button type="primary" onClick={showAddCouponModal}>
                    Add Coupon
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={coupons}
                pagination={false}
                rowKey="_id"
                loading={loading}
                style={{ marginTop: 20 }}
            />
            <Modal
                title={editingCoupon ? 'Edit Coupon' : 'Add Coupon'}
                visible={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="code"
                        label="Coupon Code"
                        rules={[{ required: true, message: 'Please enter the coupon code' }]}
                    >
                        <Input className='w-100' />
                    </Form.Item>
                    <Form.Item
                        name="discount"
                        label="Discount (%)"
                        rules={[{ required: true, message: 'Please enter the discount percentage' }]}
                    >
                        <InputNumber className='w-100' min={1} max={100} />
                    </Form.Item>
                    <Form.Item
                        name="startDate"
                        label="Start Date"
                        rules={[{ required: true, message: 'Please select the start date' }]}
                    >
                        <DatePicker className='w-100' />
                    </Form.Item>
                    <Form.Item
                        name="endDate"
                        label="End Date"
                        rules={[{ required: true, message: 'Please select the end date' }]}
                    >
                        <DatePicker className='w-100' />
                    </Form.Item>
                </Form>
            </Modal>
        </AdminLayout>
    );
};

export default AdminCoupons;
