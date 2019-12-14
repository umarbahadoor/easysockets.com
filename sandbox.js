const sqlite3 = require('sqlite3').verbose();

(async function () {

    let db = new sqlite3.Database('database.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the database.');
    });

    let getAsync = function (sql, params) {
        return new Promise(function (resolve, reject) {
            db.serialize(() => {
                db.get(sql, params, (err, row) => {
                    if (err) {
                        console.error(err.message);
                        reject(err);
                    } else {
                        resolve(row);
                    }
                });
            });
        });
    };

    let app = await getAsync('SELECT * FROM apps WHERE app_id = ?', ['8F827F7DEE913']);
    console.log(app);

    db.close();

})();
