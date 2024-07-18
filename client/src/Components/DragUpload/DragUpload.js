import React, { useEffect, useState } from 'react';
import "./Dragger.css";
import { message, Upload } from 'antd';
import { DeleteFilled, UploadOutlined } from '@ant-design/icons';
import Loading from '../Loading/Loading';
const { Dragger } = Upload;

const DragUpload = ({ updateFiles, value, noMultiple, accept }) => {
    const [fileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);

    const props = {
        name: 'file',
        multiple: true,
        action: `${process.env.REACT_APP_BACKEND_URL}/files/upload`,
        onChange(info) {
            setUploading(true);
            const { status } = info.file;
            const updatedFileList = info.fileList?.map(f => f?.response);
            if (status !== 'uploading') {
                setUploading(false)
            }
            if (status === 'done') {
                if (noMultiple) {
                    updateFiles([updatedFileList[0]]);
                    setFileList([updatedFileList[0]]);
                } else {
                    if (fileList?.length > 0) {
                        updateFiles([...fileList, updatedFileList[updatedFileList?.length - 1]]);
                        setFileList([...fileList, updatedFileList[updatedFileList?.length - 1]])
                    } else {
                        updateFiles(updatedFileList)
                        setFileList(updatedFileList)
                    }
                }
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    useEffect(() => {
        if (value?.length > 0) {
            setFileList(value)
        }
    }, [value]);

    const handleDelete = (index) => {
        const updatedFiles = fileList.filter((file, i) => i !== index);
        setFileList(updatedFiles);
        updateFiles(updatedFiles);
    };

    return (
        <div>
            <Dragger accept={accept} maxCount={noMultiple ? 1 : 10} {...props} className="dragger" defaultFileList={value} showUploadList={false} previewFile={false}>
                <div className='flex justify-center gap-3'>
                    <UploadOutlined />
                    <div className="text-[14px] font-[600] flex items-center justify-center w-auto gap-1">
                        <div className='text-[#1796E3]'>Click to upload pictures</div>
                        <div>or drag and drop</div>
                    </div>
                </div>
            </Dragger>
            <div className="d-flex gap-4 flex-wrap align-items-center mt-4 imagesList">
                {fileList?.length > 0 && fileList?.map((file, index) => (
                    file?.url &&
                    <div key={index}>
                        <div className='text-end' >
                            <DeleteFilled onClick={() => handleDelete(index)} />
                        </div>
                        <img src={file?.url || file?.url} alt={file?.name} className="image" width={64} height={64} />
                    </div>
                ))}
                {uploading &&
                    <div className='flex justify-center items-center h-[64px] w-[64px] border'>
                        <Loading />
                    </div>
                }
            </div>
        </div >
    );
}
export default DragUpload;
