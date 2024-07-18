// src/components/FileUpload.js
import React, { useState } from 'react';
import { Upload, Button } from 'antd';
import './FileUpload.css';
import axios from 'axios';
import { ErrorAlert } from '../../Messages/messages';
import { renderFile } from '../renderFile';
import Loading from '../../Loading/Loading';

const FileUpload = ({ value, updateFileFun }) => {
    const [loading, setLoading] = useState(false);
    // const [uploadedFile, setUploadedFile] = useState(null);

    const props = {
        beforeUpload: file => {
            console.log(file);
            const isValidType = file.type.startsWith('image/') || file.type.startsWith('video/') ||
                file.type === 'application/pdf' ||
                file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            if (!isValidType) {
                ErrorAlert('You can only upload image, video, PDF, or DOCX files!');
                return Upload.LIST_IGNORE;
            }
            else {
                setLoading(true);
                const formData = new FormData();
                formData.append("file", file);
                axios.post(`${process.env.REACT_APP_BACKEND_URL}/files/upload`, formData, {
                    headers: {
                        authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(res => {
                    setLoading(false);
                    if (res.status === 200) {
                        updateFileFun(res.data);
                    }
                    else {
                        ErrorAlert(res.data.errorMessage);
                    }
                }).catch(err => {
                    setLoading(false);
                    console.log(err)
                    ErrorAlert(err?.message);
                })
            }
        },
        maxCount: 1 // Ensure only one file is uploaded
    };

    return (
        <div className="file-upload">
            <Upload {...props} multiple={false} showUploadList={false}>
                <Button>📎</Button>
            </Upload>
            {
                loading ?
                    <Loading />
                    :
                    renderFile(value, true)
            }
        </div>
    );
};

export default FileUpload;
