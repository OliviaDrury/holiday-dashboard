const fs = require('fs');
const csv = require('csv-parser');

const euroExchangeRate = 0.86;
const INRExchangeRate = 0.0096;
const USDExchangeRate = 0.79;

function readReservationsCSV() {
    return new Promise((resolve, reject) => {
        const reservations = [];
        fs.createReadStream('./reservations.csv').pipe(csv())
            .on('data', (data) => {
                reservations.push(data);
            })
            .on('end', () => {
                resolve(reservations);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

const numberOfDestinations = async () => {
    try {
        const reservations = await readReservationsCSV()
        let distinct = []
        reservations.map((reservation) => {
            if (!distinct.includes(reservation['Hotel name'])) {
                distinct.push(reservation['Hotel name'])
            }
        })
        console.log("NumberOfDestinations: ", distinct.length);
        return distinct.length
    }
    catch (error) {
        console.error('An error occurred:', error);
    }
}

const totalSpent = async () => {
    try {
        const reservations = await readReservationsCSV()
        let total = 0;

        reservations.map((reservation) => {
            let reservationPrice = reservation['Price'];
            if (reservationPrice.endsWith('EUR')) {
                let euroPrice = parseFloat(reservationPrice.slice(0, - 3));
                total += (euroPrice * euroExchangeRate);
            } else if (reservationPrice.endsWith('INR')) {
                let INRPrice = parseFloat(reservationPrice.slice(0, - 3));
                total += (INRPrice * INRExchangeRate);
            } else if (reservationPrice.endsWith('USD')) {
                let USDPrice = parseFloat(reservationPrice.slice(0, reservationPrice.length - 3));
                total += (USDPrice * USDExchangeRate);
            } else
                total += parseFloat((reservationPrice.slice(0, reservationPrice.length - 3)));
        })

        console.log("total of trips: ", total.toFixed(2));
        return total.toFixed(2);
    }
    catch (error) {
        console.error('An error occurred:', error);
    }
}

// const MostVisitedRegion = async () => {
//     try {
//         const reservations = await readReservationsCSV()
//         let distinct = []
//         reservations.map((reservation) => {
//             if (!distinct.includes(reservation['Hotel name'])) {
//                 distinct.push(reservation['Hotel name'])
//             }
//         })
//         console.log("NumberOfDestinations: ", distinct.length);
//         return distinct.length
//     }
//     catch (error) {
//         console.error('An error occurred:', error);
//     }
// }

const topFiveDestinations = async () => {
    try {
        const reservations = await readReservationsCSV()
        const count = {};
        reservations.forEach((reservation) => {
            const destination = reservation['Hotel name'];
            count[destination] = count[destination] ? count[destination] + 1 : 1
        })

        let sorted = Object.keys(count).sort((a, b) => count[b] - count[a]);
        let top5 = sorted.slice(0, 5);
        console.log("Top 5: ", top5)

        return top5;
    }
    catch (error) {
        console.error('An error occurred:', error);
        return { error: error.message };
    };
}

const whenBookingsAreMade = async () => {
    try {
        const reservations = await readReservationsCSV();
        const count = { Morning: 0, Afternoon: 0, Evening: 0, Night: 0 };
        reservations.forEach((reservation) => {
            const CreatedDateTime = Object.keys(reservation)[0];
            const getTime = reservation[CreatedDateTime].split(" ");
            const time = getTime[1].slice(0, 2);

            if (time > 6 && time < 12) {
                count.Morning += 1;
            } else if (time >= 12 && time < 18) {
                count.Afternoon += 1;
            } else if (time >= 18 && time < 24) {
                count.Evening += 1;
            } else {
                count.Night += 1;
            }
        })
        console.log("When bookings are made: ", count)
        return count;

    }
    catch (error) {
        console.error('An error occurred:', error);
    };
}

numberOfDestinations();
topFiveDestinations();
whenBookingsAreMade();
totalSpent();

module.exports = {
    topFiveDestinations,
    whenBookingsAreMade,
    numberOfDestinations,
    totalSpent
}