import { Col, Row } from 'antd'
import React from 'react'
import AdminSidebar from './AdminSidebar'
import "./Admin.css"

const AdminLayout = (props) => {

    return (
        <div className={`mx-auto AdminLayout`}>
            {
                props.sidebar ?
                    <Row className='block md:flex mt-0'>
                        <Col xs={24} lg={4} className="hidden lg:block AdminSidebar">
                            <AdminSidebar />
                        </Col>
                        <Col xs={24} lg={20} className="px-2 AdminRightSection">
                            <div className='md:p-5'>
                                <div className={`mx-2`}>
                                    {props.children}
                                </div>
                            </div>
                        </Col>
                    </Row>
                    :
                    props.children
            }
        </div>
    )
}

export default AdminLayout
