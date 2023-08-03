const fs = require('fs');
const csv = require('csv-parser');


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

const numberOfDestinations = () => {
    readReservationsCSV()
        .then((reservations) => {
            let distinct = []
            console.log("NumberOfDestinations: ");
            reservations.map((reservation) => {
                if (!distinct.includes(reservation['Hotel name'])) {
                    distinct.push(reservation['Hotel name'])
                }
            })
            return distinct.length
        })
        .catch((error) => {
            console.error('An error occurred:', error);
        });
}

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
        const count = { morning: 0, afternoon: 0, evening: 0, night: 0 };
        reservations.forEach((reservation) => {
            const CreatedDateTime = Object.keys(reservation)[0];
            const getTime = reservation[CreatedDateTime].split(" ");
            const time = getTime[1].slice(0, 2);

            if (time > 6 && time < 12) {
                count.morning += 1;
            } else if (time >= 12 && time < 18) {
                count.afternoon += 1;
            } else if (time >= 18 && time < 24) {
                count.evening += 1;
            } else {
                count.night += 1;
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

module.exports = {
    topFiveDestinations,
    whenBookingsAreMade
}