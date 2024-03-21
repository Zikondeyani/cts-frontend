export const db = window.sqlitePlugin.openDatabase({ name: 'commodity_tracking_db.db', location: 'default' });

export const initializeDatabase = () => {
    db.transaction(tx => {
        tx.executeSql(`
            CREATE TABLE IF NOT EXISTS LoadingPlans (
                id INTEGER PRIMARY KEY,
                createdon TIMESTAMP,
                updatedon TIMESTAMP,
                loadingplannumber TEXT,
                quantity INTEGER,
                balance INTEGER,
                isarchived BOOLEAN,
                isactive INTEGER,
                startdate TIMESTAMP,
                enddate TIMESTAMP,
                commodityid INTEGER,
                warehouseid INTEGER,
                transporterid INTEGER,
                districtid INTEGER,
                activityid INTEGER,
                userid TEXT,
                projectid INTEGER
            )
        `);
    });
};


export const saveLoadingPlanOffline = (LoadingPlan) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql('INSERT INTO LoadingPlans (data) VALUES (?)', [JSON.stringify(LoadingPlan)], () => {
                resolve();
            }, (error) => {
                reject(error);
            });
        });
    });
};

export const getLoadingPlanReports = () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM LoadingPlans', [], (tx, resultSet) => {
                let reports = [];
                for (let i = 0; i < resultSet.rows.length; i++) {
                    reports.push(JSON.parse(resultSet.rows.item(i).data));
                }
                resolve(reports);
            }, (error) => {
                reject(error);
            });
        });
    });
};

