import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';    

import { accountService, alertService, designService } from '@/_services';

import './Index.css';

function UploadUpdate({ history, match }) {
        const { design_id } = match.params;
        const user = accountService.userValue;
        const isUploadMode = !design_id;
        
        const initialValues = {
            designName: '',
            designID: '',
            designType: '',
            designImage: '',
            userID: user.id,
        };
        
        const validationSchema = Yup.object().shape({
            designName: Yup.string()
                .required('Design name is required'),
            designID: Yup.string()
                .required('Design ID is required')
                .matches('^MO-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$'),
            designType: Yup.string()
                .required('Design type is required'),
            designImage: Yup.string()
                .concat(isUploadMode ? Yup.string().required('Design image is required') : null),
        });
    
        function onSubmit(fields, { setStatus, setSubmitting }) {
            setStatus();
            if (isUploadMode) {
                createUser(fields, setSubmitting);
            } else {
                updateUser(user.id, design_id, fields, setSubmitting);
            }
        }
    
        function createUser(fields, setSubmitting) {
            designService.uploadDesign(fields)
                .then(() => {
                    alertService.success('Design added successfully', { keepAfterRouteChange: true });
                    history.push('.');
                })
                .catch(error => {
                    setSubmitting(false);
                    alertService.error(error);
                });
        }
    
        function updateUser(userID, designID, fields, setSubmitting) {
            designService.updateDesign(userID, designID, fields)
                .then(() => {
                    alertService.success('Update successful', { keepAfterRouteChange: true });
                    history.push('..');
                })
                .catch(error => {
                    setSubmitting(false);
                    alertService.error(error);
                });
        }

        const toBase64 = file => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    
        return (
            <div className = "designs">
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                {({ errors, touched, isSubmitting, setFieldValue }) => {
                    useEffect(() => {
                        if (!isUploadMode) {
                            // get user and set form fields
                            designService.getDesign(design_id).then(design => {
                                const fields = ['designName', 'designID', 'designType', 'userID', designImage];
                                fields.forEach(field => setFieldValue(field, design[field], false));
                            });
                        } else {
                            setFieldValue('userID', user.id, false);
                        }
                        
                    }, []);
    
                    return (
                        <Form>
                            <h2>{isUploadMode ? 'Upload design' : 'Update design'}</h2>
                            <div className="form-row">
                                <div className="form-group col-7">
                                    <label>Design name</label>
                                    <Field name="designName" type="text" className={'form-control' + (errors.designName && touched.designName ? ' is-invalid' : '')} />
                                    <ErrorMessage name="designName" component="div" className="invalid-feedback" />
                                </div>
                                <div className="form-group col">
                                    <label>Design type</label>
                                    <Field name="designType" as="select" className={'form-control' + (errors.designType && touched.designType ? ' is-invalid' : '')}>
                                        <option value=""></option>
                                        <option value="top">Top</option>
                                        <option value="dress">Dress</option>
                                        <option value="headwear">Headwear</option>
                                        <option value="other">Other</option>
                                    </Field>
                                    <ErrorMessage name="designType" component="div" className="invalid-feedback" />
                                </div>
                                <div className="form-group col-7">
                                    <label>Design ID</label>
                                    <Field name="designID" id = "designID" type="text" className={'form-control' + (errors.designID && touched.designID ? ' is-invalid' : '')} />
                                    <ErrorMessage name="designID" component="div" className="invalid-feedback" />
                                </div>
                                <div className="form-group col-7 d-none">
                                    <label>User ID</label>
                                    <Field name="UserID" id = "UserID" type="text" className={'form-control' + (errors.UserID && touched.UserID ? ' is-invalid' : '')} />
                                    <ErrorMessage name="UserID" component="div" className="invalid-feedback" />
                                </div>
                            </div>
                            <div className="form-group d-none">
                                <Field name="designImage" id = "designImage" type="text"/>
                            </div>
                            <div className="form-group">
                                <input type="file" className="form-control-file" id="file" onChange={(event) => {toBase64(event.target.files[0]).then(function(result) {setFieldValue('designImage', result, false);})}} />
                            </div>
                            <div className="form-group">
                                <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                                {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                    Save
                                </button>
                                <Link to={isUploadMode ? '.' : '..'} className="btn btn-link">Cancel</Link>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
            </div>
        );
}


export { UploadUpdate }
