const data = {
  uid: '3jiixjqak8v',
  collection: 'records',
  measures: [
    {
      field: ['items', 'count'],
      aggregation: 'sum',
      alias: 'items.count',
    },
  ],
  dimensions: [
    {
      field: ['items', 'product_id'],
    },
    {
      field: ['movement'],
    },
  ],
  filter: {
    $and: [
      {
        date: {
          $dateBetween: [new Date('2024-02-29T16:00:00.000Z'), new Date('2024-03-31T15:59:59.999Z')],
        },
      },
    ],
  },
  orders: [],
};
// const result = await fetch("https://shcx.daoyoucloud.com/api/charts:query", {
//   "headers": {
//     "accept": "application/json, text/plain, */*",
//     "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
//     "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTcxMDMxNDA2MywiZXhwIjoxNzEwOTE4ODYzfQ.aLc66wn-egDk_VOoackTph0kghLAquqp-Hdr1qN9gdU",
//     "content-type": "application/json",
//     "sec-ch-ua": "\"Chromium\";v=\"122\", \"Not(A:Brand\";v=\"24\", \"Microsoft Edge\";v=\"122\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": "\"macOS\"",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-origin",
//     "x-authenticator": "basic",
//     "x-hostname": "shcx.daoyoucloud.com",
//     "x-locale": "zh-CN",
//     "x-role": "admin",
//     "x-timezone": "+08:00",
//     "x-with-acl-meta": "true",
//     "Referer": "https://shcx.daoyoucloud.com/admin/sujj53fixe7?",
//     "Referrer-Policy": "strict-origin-when-cross-origin"
//   },
//   "body": JSON.stringify(data),
//   "method": "POST"
// });

// {
//   "uid": "9bismho25ro",
//   "collection": "view_record_items",
//   "measures": Array[5],
//   "dimensions": Array[3],
//   "filter": {
//       "$and": [
//           {
//               "$and": [
//                   {
//                       "record": {
//                           "date": {
//                               "$dateBetween": [
//                                   "2024-02-29T16:00:00.000Z",
//                                   "2024-03-31T15:59:59.999Z"
//                               ]
//                           }
//                       }
//                   }
//               ]
//           }
//       ]
//   },
//   "orders": [

//   ]
// }

const result = await fetch('http://127.0.0.1:15000/api/charts:query', {
  headers: {
    accept: 'application/json, text/plain, */*',
    'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
    authorization:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTcxMDQyNDM2NywiZXhwIjoxNzExMDI5MTY3fQ.6XqA8aTAHwkr9UDRjPgQey2c3_pwxfJZJ8gdDn4NxJc',
    'content-type': 'application/json',
    'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Microsoft Edge";v="122"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'x-authenticator': 'basic',
    'x-hostname': '127.0.0.1',
    'x-locale': 'zh-CN',
    'x-role': 'root',
    'x-timezone': '+08:00',
    'x-with-acl-meta': 'true',
    Referer: 'http://127.0.0.1:15000/admin/dihuq9gj0cl',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  },
  body: JSON.stringify(data),
  method: 'POST',
});

console.log(await result.json());
