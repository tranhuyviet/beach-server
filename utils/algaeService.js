import axios from 'axios';

const geolib = require('geolib');
const algaeUrl =
    'http://www.jarviwiki.fi/w/api.php?action=ask&query=%5B%5BHavainto%3A%3A%2B%5D%5D%5B%5BSeuranta%3A%3A%21Testiseuranta%5D%5D%5B%5BKoordinaatit%3A%3A%2B%5D%5D%5B%5BP%C3%A4iv%C3%A4m%C3%A4%C3%A4r%C3%A4%3A%3A%3E2020-8-29%5D%5D%5B%5BObsCode%3A%3Aalg%5D%5D%7C%3FObsCode%7C%3FP%C3%A4iv%C3%A4m%C3%A4%C3%A4r%C3%A4%7C%3FSiteID%7C%3FKoordinaatit%7C%3FDataJSON%7C%3FDisplay_fi%7C%3FYll%C3%A4pito%7Csort%3DP%C3%A4iv%C3%A4m%C3%A4%C3%A4r%C3%A4%7Corder%3Ddescending%7Climit%3D1000&format=json';
let matches = [];

export async function getAlgaeData(beaches) {
    matches = [];
    return axios.get(algaeUrl, { crossdomain: true }).then((res) => {
        return getMatchingBeaches(beaches, res.data.query.results);
    });
}

const formatDates = () => {
    matches.map((match) => {
        match.date = getDate(match.sighting.Päivämäärä[0]);
        match.text = match.sighting['Display fi'][0];
    });
};

const getDate = (date) => {
    const currentDate = Date.now();
    const datetest = currentDate - new Date(date * 1000);
    return Math.round(datetest / (1000 * 60 * 60 * 24));
};

function getMatchingBeaches(beachArray, algaeArray) {
    beachArray.forEach((beach) => {
        let closestSightingMatch = {
            beach: '',
            sighting: '',
        };
        //find closest algae sighting

        Object.keys(algaeArray).forEach((algaeHavainto) => {
            const algaeObj = algaeArray[algaeHavainto];

            if (closestSightingMatch.beach !== '') {
                if (closestSightingMatch.distance) {
                    const distance = geolib.getDistance(
                        { latitude: beach.lat, longitude: beach.lon },
                        {
                            latitude: algaeObj.printouts.Koordinaatit[0].lat,
                            longitude: algaeObj.printouts.Koordinaatit[0].lon,
                        }
                    );

                    if (distance < closestSightingMatch.distance) {
                        closestSightingMatch = {
                            beach: beach,
                            sighting: algaeObj.printouts,
                            distance: distance,
                        };
                    }
                }
            } else {
                closestSightingMatch = {
                    beach: beach,
                    sighting: algaeObj.printouts,
                    distance: 9999999999,
                };
            }
        });
        matches.push(closestSightingMatch);
    });

    formatDates();

    return matches;
}
