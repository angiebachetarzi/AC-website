import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { accountService, alertService } from '@/_services';

function Update({ history }) {
    const user = accountService.userValue;
    const initialValues = {
        email: user.email,
        creatorID: user.creatorID,
        friendCode: user.friendCode,
        password: '',
        confirmPassword: ''
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email('Email is invalid')
            .required('Email is required'),
        creatorID: Yup.string()
            .required('Creator ID is required')
            .matches('^MA-[0-9]{4}-[0-9]{4}-[0-9]{4}$'),
        friendCode: Yup.string()
            .required('Friend code is required')
            .matches('^SW-[0-9]{4}-[0-9]{4}-[0-9]{4}$'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters'),
        confirmPassword: Yup.string()
            .when('password', (password, schema) => {
                if (password) return schema.required('Confirm Password is required');
            })
            .oneOf([Yup.ref('password')], 'Passwords must match')
    });

    function onSubmit(fields, { setStatus, setSubmitting }) {
        setStatus();
        accountService.update(user.id, fields)
            .then(() => {
                alertService.success('Update successful', { keepAfterRouteChange: true });
                history.push('.');
            })
            .catch(error => {
                setSubmitting(false);
                alertService.error(error);
            });
    }

    const [isDeleting, setIsDeleting] = useState(false);
    function onDelete() {
        if (confirm('Are you sure?')) {
            setIsDeleting(true);
            accountService.delete(user.id)
                .then(() => alertService.success('Account deleted successfully'));
        }
    }

    return (
        <div className="profile clear-body">
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ errors, touched, isSubmitting }) => (
                <Form>
                    <h2>Update Profile</h2>
                    <div className="form-group">
                        <label>Email</label>
                        <Field name="email" type="text" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                        <ErrorMessage name="email" component="div" className="invalid-feedback" />
                    </div>
                    <div className="form-group">
                        <label>Creator ID</label>
                        <Field name="creatorID" type="text" className={'form-control' + (errors.creatorID && touched.creatorID ? ' is-invalid' : '')} />
                        <ErrorMessage name="creatorID" component="div" className="invalid-feedback" />
                    </div>
                    <div className="form-group">
                        <label>Friend code</label>
                        <Field name="friendCode" type="text" className={'form-control' + (errors.friendCode && touched.friendCode ? ' is-invalid' : '')} />
                        <ErrorMessage name="friendCode" component="div" className="invalid-feedback" />
                    </div>
                    <div className="form-row">
                        <div className="form-group col">
                            <label>Password</label>
                            <Field name="password" type="password" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                            <ErrorMessage name="password" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group col">
                            <label>Confirm Password</label>
                            <Field name="confirmPassword" type="password" className={'form-control' + (errors.confirmPassword && touched.confirmPassword ? ' is-invalid' : '')} />
                            <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback" />
                        </div>
                    </div>
                    <div className="form-group">
                        <button type="submit" disabled={isSubmitting} className="btn btn-primary mr-2">
                            {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                            Update
                        </button>
                        <button type="button" onClick={() => onDelete()} className="btn btn-danger" style={{ width: '75px' }} disabled={isDeleting}>
                            {isDeleting
                                ? <span className="spinner-border spinner-border-sm"></span>
                                : <span>Delete</span>
                            }
                        </button>
                        <Link to="." className="btn btn-link">Cancel</Link>
                    </div>
                </Form>
            )}
        </Formik>
        </div>
    )
}

export { Update };