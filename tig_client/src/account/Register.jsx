import React from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { accountService, alertService } from '@/_services';

function Register({ history }) {
    const initialValues = {
        email: '',
        creatorID:'',
        password: '',
        confirmPassword: '',
        friendCode: '',
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email('Email is invalid')
            .required('Email is required'),
        creatorID: Yup.string()
            .required('Creator ID is required')
            .matches('^MA-[0-9]{4}-[0-9]{4}-[0-9]{4}$'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm Password is required'),
        friendCode: Yup.string()
            .required('Friend code is required')
            .matches('^SW-[0-9]{4}-[0-9]{4}-[0-9]{4}$'),
    });

    function onSubmit(fields, { setStatus, setSubmitting }) {
        setStatus();
        accountService.register(fields)
            .then(() => {
                alertService.success('Registration successful, please check your email for verification instructions', { keepAfterRouteChange: true });
                history.push('login');
            })
            .catch(error => {
                setSubmitting(false);
                alertService.error(error);
            });
    }

    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ errors, touched, isSubmitting }) => (
                <Form>
                    <h3 className="card-header">Register</h3>
                    <div className="card-body">
                        <div className="form-group">
                            <Field name="email" placeholder="Email" type="text" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} autoFocus data-cy-form-email/>
                            <ErrorMessage name="email" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <Field name="creatorID" data-toggle="tooltip" data-placement="top" title="Exp: MA-2222-2222-2222" placeholder="Creator ID" type="text" className={'form-control' + (errors.creatorID && touched.creatorID ? ' is-invalid' : '')} data-cy-form-creatorID/>
                            <ErrorMessage name="creatorID" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-row">
                            <div className="form-group col">
                                <Field name="password" placeholder="Password" type="password" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} data-cy-form-password/>
                                <ErrorMessage name="password" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col">
                                <Field name="confirmPassword" placeholder="Confirm password" type="password" className={'form-control' + (errors.confirmPassword && touched.confirmPassword ? ' is-invalid' : '')} data-cy-form-confirmPassword/>
                                <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback" />
                            </div>
                        </div>
                        <div className="form-group">
                            <Field name="friendCode" data-toggle="tooltip" data-placement="top" title="Exp: SW-2222-2222-2222" placeholder="Friend code" type="text" className={'form-control' + (errors.friendCode && touched.friendCode ? ' is-invalid' : '')} data-cy-form-friendCode/>
                            <ErrorMessage name="friendCode" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                                {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                Register
                            </button>
                            <Link to="login" className="btn btn-link">Cancel</Link>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    )
}

export { Register };
