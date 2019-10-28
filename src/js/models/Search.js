import axios from 'axios';
import {
    key
} from '../config';

export default class search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {

        // const key = 'b3d8a2b45f0ce6f55f9c74ed6e3fdc9e';
        // const key = '9154a9f4fcd4754d2ad1e33f49b6761d';
        // const proxy = 'https://cors-anywhere.herokuapp.com/'; //in case you have problem with CORS use dis const before api URL
        try {
            const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = res.data.recipes;
        } catch (error) {
            alert(error);
        }

    }
}




// b3d8a2b45f0ce6f55f9c74ed6e3fdc9e
// https://www.food2fork.com/api/search