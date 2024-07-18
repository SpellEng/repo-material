import { Button, Input, Select } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { RightOutlined } from '@ant-design/icons'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css';
import axios from 'axios'
import AdminLayout from '@/components/Layouts/Admin/AdminLayout';
import { ErrorAlert, SuccessAlert } from '@/components/Commons/Messages/Messages';
import Link from 'next/link';
import DragUpload from '@/components/Commons/DragUpload/DragUpload';
import { useRouter } from 'next/router';

const UpdateProduct = () => {
    const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }), []);
    const router = useRouter();
    let productId = router?.query?.id;
    const [untrimmedCategories, setUntrimmedCategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState({});
    const [formData, setFormData] = useState({
        title: '',
        subTitle: '',
        originalPrice: '',
        gender: '',
        featured: '',
        price: '',
        qty: '',
        pictures: "",
        description: "",
        mainCategory: "",
        subCategory: "",
        brand: ""
    });

    /*********************************************** onChange *******************************************/
    const handleChange = (key, value) => {
        setFormData({
            ...formData,
            [key]: value
        });
    }

    /************************************************ Submit **********************************************/

    const submitHandler = (e) => {
        e.preventDefault();
        setLoading(true);
        axios.put(`${process.env.REACT_APP_BACKEND_URL}/products/update/${productId}`, formData, {
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then(res => {
            setLoading(false);
            if (res.status === 200) {
                SuccessAlert(res.data.successMessage);
                router.push("/admin/products");
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


    const getAllCategories = async () => {
        await axios.get(`${process.env.REACT_APP_BACKEND_URL}/categories/get`).then(res => {
            if (res.statusText === "OK") {
                setUntrimmedCategories(res.data);
                let formatIt = res.data.map(obj => {
                    return {
                        value: obj._id,
                        label: obj.name
                    };
                });
                setCategories(formatIt);
            } else {
                ErrorMessage(res.data.errorMessage);
            }
        }).catch(err => {
            setLoading(false);
            console.log(err)
            ErrorAlert(err?.message);
        })
    }

    const getProductById = async (prId) => {
        await axios.get(`${process.env.REACT_APP_BACKEND_URL}/products/product/${prId}`).then(res => {
            if (res.statusText === "OK") {
                setFormData(res.data);
                setProduct(res.data);
                let getChildCategories = untrimmedCategories?.filter(f => f?._id === res.data?.mainCategory)[0]?.children;
                let formatSubCategories = getChildCategories?.map(obj => {
                    return {
                        value: obj._id,
                        label: obj.name
                    };
                });
                setSubCategories(formatSubCategories);
            } else {
                ErrorMessage(res.data.errorMessage);
            }
        }).catch(err => {
            setLoading(false);
            console.log(err)
            ErrorAlert(err?.message);
        })
    }

    const getAllBrands = async () => {
        setLoading(true);
        await axios.get(`${process.env.REACT_APP_BACKEND_URL}/brands/get`).then(res => {
            setLoading(false);
            if (res.statusText === "OK") {
                let formatIt = res.data.map(obj => {
                    return {
                        value: obj._id,
                        label: obj.name
                    };
                });
                setBrands(formatIt)
            } else {
                ErrorAlert(res.data.errorMessage);
            }
        }).catch(err => {
            setLoading(false);
            console.log(err)
            ErrorAlert(err?.message);
        })
    }


    useEffect(() => {
        getAllCategories();
        getAllBrands();
        productId !== undefined && getProductById(productId);

        return () => {

        }
    }, [productId]);

    const handleCategoryChange = (val) => {
        handleChange("mainCategory", val);
        // handleChange("subCategory", "");
        let getChildCategories = untrimmedCategories?.filter(f => f?._id === val)[0]?.children;
        let formatIt = getChildCategories.map(obj => {
            return {
                value: obj._id,
                label: obj.name
            };
        });
        setSubCategories(formatIt);
    }


    return (
        <AdminLayout sidebar>
            <div className='Pages pt-6 md:max-w-[60vw]'>
                <div className='flex justify-between items-center'>
                    <div className='flex gap-2 justify-center items-center py-4'>
                        <span>Admin</span> <RightOutlined /> <button className='text-[#0094DA]'>Update product</button>
                    </div>
                </div>
                {
                    product &&
                    <form onSubmit={submitHandler}>
                        <div className='d-flex justify-content-between'>
                            <div>
                                <h1 className='text-[33px] font-bold'>Update a Product</h1>
                            </div>
                            <div>
                                <Link href='/admin/products' type="button" className="btn-close" aria-label="Close"></Link>
                            </div>
                        </div>
                        <div className="form-group mt-4">
                            <label>Title</label> < br />
                            <Input value={formData?.title} required type="text" className="form-control mb-2" placeholder="Enter Your Product Title" onChange={(e) => handleChange("title", e.target.value)} />
                        </div>
                        <div className="form-group mt-4">
                            <label>Sub Title</label> < br />
                            <Input value={formData?.subTitle} required type="text" className="form-control mb-2" placeholder="Enter Your Product Sub Title" onChange={(e) => handleChange("subTitle", e.target.value)} />
                        </div>
                        <div className="form-group mt-4">
                            <label>Original Price</label> < br />
                            <Input value={formData?.originalPrice} required type="Number" className="form-control mb-2" placeholder="Enter Product's Original Price" onChange={(e) => handleChange("originalPrice", e.target.value)} />
                        </div>
                        <div className="form-group mt-4">
                            <label>Price</label> < br />
                            <Input value={formData?.price} required type="Number" className="form-control mb-2" placeholder="Enter Product's Price" onChange={(e) => handleChange("price", e.target.value)} />
                        </div>
                        <div className="form-group mt-4">
                            <label>Quantity</label> < br />
                            <Input value={formData?.qty} type="qty" className="form-control mb-2" placeholder="Enter Product's Qty" onChange={(e) => handleChange("qty", e.target.value)} />
                        </div>
                        <div className='mt-3'>
                            <label>Description</label> < br />
                            <ReactQuill placeholder="Product Description" theme="snow" value={formData.description} onChange={(value) => handleChange("description", value)} />
                        </div>
                        <div className='mt-3'>
                            <label>Gender</label> < br />
                            <Select className='w-full' value={formData.gender} placeholder="Gender" onChange={(value) => handleChange("gender", value)} options={[
                                { value: "male", label: "Male" },
                                { value: "female", label: "Female" },
                                { value: "others", label: "Others" }
                            ]} />
                        </div>
                        <div className='mt-3'>
                            <label>Featured</label> < br />
                            <Select className='w-full' value={formData.featured} placeholder="Featured" onChange={(value) => handleChange("featured", value)} options={[
                                { value: "yes", label: "Yes" },
                                { value: "no", label: "No" }
                            ]} />
                        </div>
                        <div className='my-3'>
                            <label>Pictures</label> < br />
                            <DragUpload value={formData?.pictures} updateFiles={(val) => handleChange("pictures", val)} />
                        </div>
                        <div>
                            <label>Main Category</label> < br />
                            <Select
                                value={formData?.mainCategory}
                                showSearch
                                placeholder="Please select main category"
                                allowClear
                                onChange={handleCategoryChange}
                                className='mb-3 w-full'
                                options={categories}
                            />
                        </div>
                        <div>
                            <label>Sub Category</label> < br />
                            <Select
                                value={formData?.subCategory}
                                showSearch
                                placeholder="Please select sub category"
                                allowClear
                                onChange={(val) => handleChange("subCategory", val)}
                                className='mb-3 w-full'
                                options={subCategories}
                            />
                        </div>
                        <div>
                            <label>Brand</label> < br />
                            <Select
                                value={formData?.brand}
                                showSearch
                                placeholder="Please select brand"
                                allowClear
                                onChange={(val) => handleChange("brand", val)}
                                className='mb-3 w-full'
                                options={brands}
                            />
                        </div>
                        <Button type='primary' htmlType="submit" loading={loading} disabled={loading} className="mt-4">Submit</Button>
                    </form>
                }
            </div>
        </AdminLayout >
    )
}

export default UpdateProduct;
