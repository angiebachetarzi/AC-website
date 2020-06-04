import { fetchWrapper } from '@/_helpers';

const baseUrl = 'https://acnhapi.com/v1/';

export const critterService = {
    getAllFish,
    getAllBugs,
    getFish,
    getBug
};

function getAllFish() {
    return fetchWrapper.get(baseUrl + 'fish')
}

function getAllBugs() {
    return fetchWrapper.get(baseUrl + 'bugs')
}

function getFish(fish_id) {
    return fetchWrapper.get(baseUrl + 'fish/' + fish_id)
}

function getBug(bug_id) {
    return fetchWrapper.get(baseUrl + 'bugs/' + bug_id)
}
