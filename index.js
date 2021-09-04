const mysql = require('mysql2/promise');

const app = {}

app.init = async () => {
    // prisijungti prie duomenu bazes
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'taxi',
    });

    let sql = '';
    let rows = [];

    // **1.** _Isspausdinti, kiek buvo kelioniu_
    sql = 'SELECT * FROM `trips`';

    [rows] = await connection.execute(sql);
    const tripsCount = rows.length;
    console.log(`Visi taksistai bendrai ivykde ${tripsCount} keliones.`);

    // ** 2. ** _Isspausdinti, visu taksistu vardus_

    sql = 'SELECT `driver` FROM `trips` ';
    [rows] = await connection.execute(sql);
    let driverName = [];
    for (let i = 0; i < rows.length; i++) {
        const vairuotojas = rows[i].driver;
        if (!driverName.includes(vairuotojas)) {
            driverName.push(vairuotojas);
        }
    }
    console.log(`Taksistais dirba: ${driverName.join(', ')}.`);

    // **3.** _Isspausdinti, koki atstuma nuvaziavo visu kelioniu metu_
    sql = 'SELECT `distance` FROM `trips`';
    [rows] = await connection.execute(sql);
    let driveDistance = 0;
    for (let i = 0; i < rows.length; i++) {
        driveDistance += +rows[i].distance;
    }
    console.log(`Visu kelioniu metu nuvaziuota ${driveDistance} km.`);

    // **4.** _Isspausdinti, koks yra vidutinis Jono ivertinimas_
    sql = 'SELECT `rating` FROM `trips` WHERE `driver` LIKE "Jonas"';
    [rows] = await connection.execute(sql);
    let ratingSum = 0;
    for (let i = 0; i < rows.length; i++) {
        ratingSum += rows[i].rating;
    }
    const ratingAvarage = ratingSum / rows.length;

    console.log(`Jono ivertinimas yra ${ratingAvarage} zvaigzdutes.`);

    // **5.** _Isspausdinti, kokia yra vidutine kelioniu kaina_
    sql = 'SELECT `price`, `distance` FROM `trips`';
    [rows] = await connection.execute(sql);

    let allPrice = 0;
    let allDistance = 0;
    for (let i = 0; i < rows.length; i++) {
        allDistance += +rows[i].distance;
        allPrice += +rows[i].price;
    }
    const avarageDistacePrice = allPrice / allDistance;

    console.log(`Vidutine kelioniu kaina yra ${(avarageDistacePrice).toFixed(2)} EUR/km.`);

}

app.init();

module.exports = app;