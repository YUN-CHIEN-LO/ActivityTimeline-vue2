const _url = '/activity/record';
const Mock = require('mockjs') //使用mockjs模擬數據 
let data = Mock.mock({
    "data|10-20": [{
        'id|+1': 1,
        'title': '@title',
        'name': '@name',
        'datetime': '@date("yyyy-MM-dd")',
        'email': '@email',
        'bref': '@sentence'
    }]
});
let maxId = data.data.length;
Mock.mock(_url, 'get', (option) => {
    return data;
});

// 新增資料
Mock.mock(_url, 'post', function(option) {
    let req = JSON.parse(option.body);
    data.data.forEach((x) => {
        if (x.id > maxId) maxId = x.id;
    });
    const newID = maxId + 1;
    const newData = {
        id: newID,
        title: req.title,
        name: req.name,
        email: req.email,
        bref: req.bref,
        datetime: new Date().toISOString().slice(0, 10)
    };
    data.data.push(newData);

    // 回傳新增後的整筆資料
    return newData;
});

// 修改單筆資料 (by id)
Mock.mock(/\/activity\/record\/\d./, 'put', function(option) {
    let req = JSON.parse(option.body);
    let matches = option.url.match(/\d+$/);
    let id = null;
    if (matches) {
        id = matches[0];
    }
    id = parseInt(id, 10);
    const newTitle = req.title;
    const newName = req.name;
    const newEmail = req.email;
    const newBref = req.bref;
    const updateData = {
        id: id.toString(),
        title: newTitle,
        name: newName,
        email: newEmail,
        bref: newBref,
        datetime: new Date().toISOString().slice(0, 10)
    };

    data.data.forEach(function(obj, i) {
        if (obj.id === id) {
            obj.title = newTitle;
            obj.name = newName;
            obj.email = newEmail;
            obj.bref = newBref;
        }
    });

    // 回傳更新後的單筆資料
    return updateData;
});

// 刪除單筆資料 (by id)
Mock.mock(/\/activity\/record\/\d./, 'delete', function(option) {
    let matches = option.url.match(/\d+$/);
    let id = null;
    if (matches) {
        id = matches[0];
    }
    id = parseInt(id, 10);
    data.data.forEach(function(obj, i) {
        if (true && obj.id === id) {
            data.data.splice(i, 1);
        }
    });

    // 回傳指定刪除當筆id與刪除後的整筆資料
    return {
        id: id,
        data: data.data
    };
});