//引入mockjs 
// import Mock form './mock';

const Mock = require('mockjs') //使用mockjs模擬數據 
Mock.mock('/api/events', (req, res) => {
    return Mock.mock({
        "data|10-20": [{
            'id|+1': 1,
            'title': '@title',
            'name': '@name',
            'datetime': '@date("yyyy-MM-dd")',
            'email': '@email',
            'bref': '@sentence'
        }]
    })
});