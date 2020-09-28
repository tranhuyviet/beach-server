import { RESTDataSource } from 'apollo-datasource-rest';

export default class BeachDS extends RESTDataSource {
    constructor() {
        super();
        this.baseUrl = 'https://iot.fvh.fi/opendata/uiras/uiras2_v1.json';
    }

    async getAllBeaches() {
        const response = await this.get();
        return Array.isArray(response) ? response.map((beach) => this.beachReducer(beach)) : [];
    }

    beachReducer(beach) {
        return {
            name: beach.meta.name,
            lat: beach.meta.lat,
            lon: beach.meta.lon,
            file_created: beach.meta.file_created,
            data: beach.data,
        };
    }
}
