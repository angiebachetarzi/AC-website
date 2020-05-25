import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { accountService, accountDesign, alertService } from '@/_services';

import './Index.css';

function Upload({ history, match }) {
    const user = accountService.userValue;
    
    const initialValues = {
        designName: '',
        designID: '',
        designType: '',
        designImage: '',
        userID: user.id
    };

    const validationSchema = Yup.object().shape({
        designName: Yup.string()
            .required('Design name is required'),
        designID: Yup.string()
            .required('Design ID is required')
            .matches('^MO-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$'),
        designType: Yup.string()
            .required('Design type is required')
            .validate('top', 'dress', 'headwear', 'other'),
        designImage: Yup.string()
            .required('Design image is required')
    });

    function onSubmit(fields, { setStatus, setSubmitting }) {
       /*  setStatus();
        if (isAddMode) {
            createUser(fields, setSubmitting);
        } else {
            updateUser(id, fields, setSubmitting);
        } */
    }

    function createUser(fields, setSubmitting) {
        accountService.create(fields)
            .then(() => {
                alertService.success('User added successfully', { keepAfterRouteChange: true });
                history.push('.');
            })
            .catch(error => {
                setSubmitting(false);
                alertService.error(error);
            });
    }

    function updateUser(id, fields, setSubmitting) {
        accountService.update(id, fields)
            .then(() => {
                alertService.success('Update successful', { keepAfterRouteChange: true });
                history.push('..');
            })
            .catch(error => {
                setSubmitting(false);
                alertService.error(error);
            });
    }

    return (
        <div>
         <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ errors, touched, isSubmitting, setFieldValue }) => {
                useEffect(() => {
                    /* if (!isAddMode) {
                        // get user and set form fields
                        accountService.getById(id).then(user => {
                            const fields = ['email', 'creatorID', 'friendCode', 'role'];
                            fields.forEach(field => setFieldValue(field, user[field], false));
                        });
                    } */
                }, []);

                return (
                    <Form>
                        <h2>Upload</h2>
                         <div className="form-row">
                            <div className="form-group col-7">
                                <label>Design name</label>
                                <Field name="designName" type="text" className={'form-control' + (errors.designName && touched.designName ? ' is-invalid' : '')} />
                                <ErrorMessage name="designName" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col-7">
                                <label>Design ID</label>
                                <Field name="designID" type="text" className={'form-control' + (errors.designID && touched.designID ? ' is-invalid' : '')} />
                                <ErrorMessage name="designID" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col">
                                <label>Design type</label>
                                <Field name="designType" as="select" className={'form-control' + (errors.designType && touched.designType ? ' is-invalid' : '')}>
                                    <option value="top">Top</option>
                                    <option value="dress">Dress</option>
                                    <option value="headwear">Headwear</option>
                                    <option value="other">Other</option>
                                </Field>
                                <ErrorMessage name="role" component="div" className="invalid-feedback" />
                            </div>
                            
                        </div>
                        <div className="form-group">
                        <div className="input-group">
  <div className="input-group-prepend">
    <span className="input-group-text" id="inputGroupFileAddon01">Upload</span>
  </div>
  <div className="custom-file">
    <input type="file" className="custom-file-input" id="inputGroupFile01"
      aria-describedby="inputGroupFileAddon01" />
    <label className="custom-file-label" htmlFor="inputGroupFile01">Choose file</label>
  </div>
</div>
                        </div>

                        <div className="form-group">
                            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                                {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                Save
                            </button>
                            <Link to={'..'} className="btn btn-link">Cancel</Link>
                        </div>
                    </Form>
                );
            }}
        </Formik>
        </div>
    );
}

export { Upload };