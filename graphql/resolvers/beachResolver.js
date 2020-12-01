import Beach from '../../models/beachModel';
import { UserInputError } from 'apollo-server';
import _ from 'lodash';
import axios from 'axios';
import { getAlgaeData } from '../../utils/algaeService';

export default {
    Beach: {
        ratingAverage: (parent) => {
            if (parent.reviews.length === 0) return 0;
            return _.meanBy(parent.reviews, (review) => review.rating);
        },
    },
    Query: {
        // GET BEACHES
        getBeaches: async (parent, args) => {
            try {
                const {
                    city,
                    forDogs,
                    winterSwimming,
                    shower,
                    toilet,
                    restaurant,
                    children,
                    noAlgae,
                    changing,
                    guard,
                    fitness,
                    sport,
                    kiosk,
                    sauna,
                    temp,
                } = args;

                let query = {};

                if (city && city.length > 0) {
                    query.city = { $in: city };
                }

                if (forDogs && forDogs === 'true') {
                    query.forDogs = true;
                }

                if (winterSwimming && winterSwimming === 'true') {
                    query.winterSwimming = true;
                }

                if (shower && shower === 'true') {
                    query.shower = true;
                }

                if (toilet && toilet === 'true') {
                    query.toilet = true;
                }

                if (restaurant && restaurant === 'true') {
                    query.restaurant = 'true';
                }

                if (children && children === 'true') {
                    query.children = 'true';
                }

                if (changing && changing === 'true') {
                    query.changing = 'true';
                }

                if (guard && guard === 'true') {
                    query.guard = 'true';
                }

                if (fitness && fitness === 'true') {
                    query.fitness = 'true';
                }

                if (sport && sport === 'true') {
                    query.sport = 'true';
                }

                if (kiosk && kiosk === 'true') {
                    query.kiosk = 'true';
                }

                if (sauna && sauna === 'true') {
                    query.sauna = 'true';
                }

                // console.log('TEMP', temp);

                let beaches = await Beach.find(query);

                if (!beaches) throw new UserInputError('Beaches not found');

                if (temp) {
                    let dataAPI = await axios.get(
                        'https://iot.fvh.fi/opendata/uiras/uiras2_v1.json'
                    );
                    dataAPI = Object.values(dataAPI.data.sensors);

                    let tempBeaches = [];
                    beaches.forEach((beach) => {
                        let tempBeach = Object.assign({}, beach)._doc;

                        dataAPI.forEach((dt) => {
                            if (
                                dt.meta.name === tempBeach.name &&
                                dt.data[dt.data.length - 1].temp_water >= temp
                            ) {
                                tempBeach.temp_water = dt.data[dt.data.length - 1].temp_water;
                                tempBeaches.push(tempBeach);
                            }
                        });
                    });

                    beaches = tempBeaches;
                }

                if (noAlgae && noAlgae === 'true') {
                    const algaeSightings = await getAlgaeData(beaches);
                    if (algaeSightings) {
                        beaches = algaeSightings
                            .filter(
                                (algaeData) => JSON.parse(algaeData.sighting.DataJSON[0]).val === 0
                            )
                            .map((algaeData) => algaeData.beach);
                    }
                }
                // console.log(beaches);

                return beaches;
            } catch (error) {
                console.log(error);
                return error;
            }
        },

        // GET BEACH BY NAME
        getBeach: async (parent, { name }) => {
            try {
                let beach = await Beach.findOne({ name });

                if (!beach) {
                    throw new UserInputError('GET BEACH ERROR - COULD NOT FOUND BEACH');
                }

                const dataAPI = axios.get('https://iot.fvh.fi/opendata/uiras/uiras2_v1.json');
                const algaeData = getAlgaeData([beach]);

                await Promise.all([dataAPI, algaeData]).then(async (promises) => {
                    let dataAPI = promises[0];
                    dataAPI = Object.values(dataAPI.data.sensors);
                    dataAPI = dataAPI.find((beach) => beach.meta.name === name);
                    beach.data = dataAPI.data;

                    // beach info
                    let id = dataAPI.meta.servicemap_url.split('/');
                    id = id[id.length - 1];

                    const info = await axios.get(
                        'http://www.hel.fi/palvelukarttaws/rest/v4/unit/' + id
                    );

                    let infoBeach = info.data.desc_fi ? info.data.desc_fi : info.data.short_desc_fi;
                    if (!infoBeach) infoBeach = 'No data from API';
                    beach.info = infoBeach;

                    // algae sighting
                    beach.sighting = promises[1]
                        ? {
                              date: promises[1][0].date,
                              distance: promises[1][0].distance,
                              text: promises[1][0].text,
                          }
                        : null;
                });

                beach.hslUrl = `https://reittiopas.hsl.fi/reitti/::undefined,undefined/${beach.address}::${beach.lat},${beach.lon}`;
                beach.mapsUrl = `https://www.google.com/maps/search/?api=1&query=${beach.lat},${beach.lon}`;
                return beach;
            } catch (error) {
                console.log(error);
            }
        },
    },

    Mutation: {
        // CREATE BEACH
        createBeach: async (parent, args) => {
            try {
                const { name, lat, lon } = args;

                const beach = await Beach.findOne({ name });

                if (beach) {
                    throw new UserInputError('Beach already exists');
                }

                const newBeach = new Beach({ name, lat, lon, address, city, forDogs });
                await newBeach.save();
                return newBeach;
            } catch (error) {
                console.log(error);
                return error;
            }
        },
    },
};
