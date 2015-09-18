module.exports = {
    getData: (func) => {
        return new Promise((resolve, reject) => {
            func((error, data) => {
                if (error) {
                    reject(error);
                }
                resolve(data);
            });
        });
    }
};