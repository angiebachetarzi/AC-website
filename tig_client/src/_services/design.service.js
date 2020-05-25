import { BehaviorSubject } from 'rxjs';

import config from 'config';
import { fetchWrapper } from '@/_helpers';

const designsSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('designs')));
const baseUrl = `${config.apiUrl}/designs`;

export const designService = {
    getAllDesigns,
    getDesign,
    getUserDesigns,
    uploadDesign,
    updateDesign,
    deleteDesign,
    designs: designsSubject.asObservable(),
    get userValue () { return designsSubject.value }
};

function uploadDesign(params) {
    return fetchWrapper.post(baseUrl, params);
}

function getAllDesigns() {
    return fetchWrapper.get(baseUrl)
        /* .then(designs => {
            // store designs in local storage to keep user logged in between page refreshes
            localStorage.setItem('designs', JSON.stringify(designs));

            // publish designs to subscribers
            designsSubject.next(user);

            return user;
        }); */
}

function getDesign(design_id) {
    return fetchWrapper.get(`${baseUrl}/${design_id}`);
}

function getUserDesigns() {
    return fetchWrapper.get(`${baseUrl}/getUserDesigns`);
}

function updateDesign(user_id, design_ID, params) {
    return fetchWrapper.put(`${baseUrl}/${user_id}/${design_ID}`, params);
}

function deleteDesign(user_id, design_ID) {
    return fetchWrapper.delete(`${baseUrl}/${user_id}/${design_ID}`);
}
