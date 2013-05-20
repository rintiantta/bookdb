// 더미 데이터베이스
exports = module.exports = (function () {
    // 모듈을 추출합니다.
    var fs = require('fs');
    var uuid = require('uuid');

    // 변수를 선언합니다.
    var db = {};
    var save = function (callback) {
        // db.txt 파일에 db 객체를 JSON 형식으로 저장합니다.
        fs.writeFile('db.txt', JSON.stringify(db), function () {
            callback();
        });
    };
    var load = function (callback) {
        try {
            // db.txt 파일을 utf8 형식으로 읽습니다.
            var data = fs.readFileSync('db.txt', 'utf8');

            // db 객체에 파일을 불러옵니다.
            db = JSON.parse(data);
        } catch (exception) { }
    };

    // 데이터베이스를 불러옵니다.
    load();

    return {
        core: function () { return db; },
        getAll: function (collection, callback) {
            if (db[collection]) {
                // 콜백함수로 컬렉션을 전달합니다.
                callback(db[collection]);
            } else {
                // 콜백함수로 빈 배열을 전달합니다.
                callback([]);
            }
        },
        getOne: function (collection, id, callback) {
            // 컬렉션 존재 확인
            if (db[collection]) {
                // 데이터를 찾습니다.
                for (var i = 0; i < db[collection].length; i++) {
                    if (db[collection][i]._id == id) {
                        // 콜백함수로 데이터를 전달합니다.
                        callback(db[collection][i]);

                        // 함수 종료
                        return;
                    }
                }
            }

            // 데이터가 없으면 콜백함수로 null을 전달합니다.
            callback(null);
        },
        insert: function (collection, object, callback) {
            // 컬렉션이 없으면 컬렉션을 생성합니다.
            if (!db[collection]) { db[collection] = []; }

            // 데이터에 _id 속성을 추가해서 컬렉션에 넣습니다.
            object._id = uuid.v1();
            db[collection].push(object);

            // 데이터베이스를 저장합니다.
            save(function () {
                // 콜백 함수를 실행합니다.
                callback(object);
            });
        },
        update: function (collection, id, object, callback) {
            // 컬렉션 존재 확인
            if (db[collection]) {
                // 데이터를 찾습니다.
                for (var i = 0; i < db[collection].length; i++) {
                    if (db[collection][i]._id == id) {
                        // 속성을 변경합니다.
                        for (var key in object) {
                            if (key != '_id') {
                                db[collection][i][key] = object[key];
                            }
                        }

                        // 데이터베이스를 저장합니다.
                        save(function () {
                            // 콜백함수로 수정된 데이터를 전달합니다.
                            callback(db[collection][i]);
                        });

                        // 함수 종료
                        return;
                    }
                }
            }

            // 데이터가 없으면 콜백함수로 null을 전달합니다.
            callback(null);
        },
        remove: function (collection, id, callback) {
            // 컬렉션 존재 확인
            if (db[collection]) {
                // 데이터를 찾습니다.
                for (var i = 0; i < db[collection].length; i++) {
                    if (db[collection][i]._id == id) {
                        // 콜백함수로 제거할 데이터를 전달합니다.
                        callback(db[collection][i]);

                        // 데이터를 제거합니다.
                        db[collection].splice(i, 1);

                        // 함수 종료
                        return;
                    }
                }
            }

            // 데이터가 없으면 콜백함수로 null을 전달합니다.
            callback(null);
        }
    };
})();
