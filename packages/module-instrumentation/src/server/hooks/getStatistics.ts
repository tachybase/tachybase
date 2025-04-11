type FilterConfig = {
  filterKey: string | string[];
  filterValues?: Record<string, any>;
  dedupBy?: string;
  minCount: number;
};

export function countDataByEventFrequency(data: any[], config: FilterConfig): number {
  const { filterKey, filterValues = {}, dedupBy, minCount = 1 } = config;

  const matchKey = (itemKey: string) => {
    if (Array.isArray(filterKey)) return filterKey.includes(itemKey);
    return itemKey === filterKey;
  };

  const matchesValues = (values: Record<string, any>) => {
    return Object.entries(filterValues).every(([k, v]) => values[k] === v);
  };

  // 分组：key = dedupBy 字段，value = 所有匹配记录
  const groupMap = {};

  for (const item of data) {
    if (!matchKey(item.key)) continue;
    if (!matchesValues(item.values)) continue;

    const key = dedupBy ? item.values[dedupBy] : '__no_dedup__';
    if (!key) continue;

    if (!groupMap[key]) groupMap[key] = [];
    groupMap[key].push(item);
  }

  // 统计满足 minCount 的分组
  let count = 0;
  for (const key in groupMap) {
    if (groupMap[key].length >= minCount) {
      count++;
    }
  }

  return count;
}

// const data = [
//   {
//     "createdAt": "2025-04-10T02:39:03.039Z",
//     "updatedAt": "2025-04-10T02:39:03.039Z",
//     "id": 120,
//     "type": "applications-create",
//     "key": "create-multiapp",
//     "values": {
//       "meta": {
//         "userId": 9,
//         "recordId": "a_uehtjg5xxxn",
//         "createdAt": "2025-04-10T02:39:03.031Z"
//       },
//       "payload": {
//         "name": "a_uehtjg5xxxn"
//       }
//     }
//   },
//   {
//     "createdAt": "2025-04-10T02:39:11.277Z",
//     "updatedAt": "2025-04-10T02:39:11.277Z",
//     "id": 121,
//     "type": "click",
//     "key": "multiapp_start",
//     "values": {
//       "UserId": 9,
//       "appName": "a_uehtjg5xxxn",
//       "version": "1.0.6",
//       "createdAt": "2025-04-10T02:39:11.272Z"
//     }
//   },
//   {
//     "createdAt": "2025-04-10T02:39:14.709Z",
//     "updatedAt": "2025-04-10T02:39:14.709Z",
//     "id": 122,
//     "type": "click",
//     "key": "multiapp_stop",
//     "values": {
//       "UserId": 9,
//       "appName": "a_uehtjg5xxxn",
//       "version": "1.0.6",
//       "createdAt": "2025-04-10T02:39:14.704Z"
//     }
//   },
//   {
//     "createdAt": "2025-04-10T02:39:15.922Z",
//     "updatedAt": "2025-04-10T02:39:15.922Z",
//     "id": 123,
//     "type": "click",
//     "key": "multiapp_start",
//     "values": {
//       "UserId": 9,
//       "appName": "a_uehtjg5xxxn",
//       "version": "1.0.6",
//       "createdAt": "2025-04-10T02:39:15.919Z"
//     }
//   },
//   {
//     "createdAt": "2025-04-10T02:39:29.087Z",
//     "updatedAt": "2025-04-10T02:39:29.087Z",
//     "id": 124,
//     "type": "click",
//     "key": "multiapp_stop",
//     "values": {
//       "UserId": 9,
//       "appName": "a_uehtjg5xxxn",
//       "version": "1.0.6",
//       "createdAt": "2025-04-10T02:39:29.084Z"
//     }
//   },
//   {
//     "createdAt": "2025-04-10T02:39:15.922Z",
//     "updatedAt": "2025-04-10T02:39:15.922Z",
//     "id": 999,
//     "type": "click",
//     "key": "multiapp_start",
//     "values": {
//       "UserId": 8,
//       "appName": "1",
//       "version": "1.0.6",
//       "createdAt": "2025-04-10T02:39:15.919Z"
//     }
//   },
//   {
//     "createdAt": "2025-04-10T02:39:15.922Z",
//     "updatedAt": "2025-04-10T02:39:15.922Z",
//     "id": 998,
//     "type": "click",
//     "key": "multiapp_start",
//     "values": {
//       "UserId": 8,
//       "appName": "1",
//       "version": "1.0.6",
//       "createdAt": "2025-04-10T02:39:15.919Z"
//     }
//   },
//   {
//     "createdAt": "2025-04-10T02:39:15.922Z",
//     "updatedAt": "2025-04-10T02:39:15.922Z",
//     "id": 997,
//     "type": "click",
//     "key": "multiapp_start",
//     "values": {
//       "UserId": 8,
//       "appName": "1",
//       "version": "1.0.6",
//       "createdAt": "2025-04-10T02:39:15.919Z"
//     }
//   },
//   {
//     "createdAt": "2025-04-10T02:39:15.922Z",
//     "updatedAt": "2025-04-10T02:39:15.922Z",
//     "id": 996,
//     "type": "click",
//     "key": "multiapp_start",
//     "values": {
//       "UserId": 7,
//       "appName": "2",
//       "version": "1.0.6",
//       "createdAt": "2025-04-10T02:39:15.919Z"
//     }
//   },
//   {
//     "createdAt": "2025-04-10T02:39:15.922Z",
//     "updatedAt": "2025-04-10T02:39:15.922Z",
//     "id": 995,
//     "type": "click",
//     "key": "multiapp_start",
//     "values": {
//       "UserId": 7,
//       "appName": "2",
//       "version": "1.0.6",
//       "createdAt": "2025-04-10T02:39:15.919Z"
//     }
//   },
//   {
//     "createdAt": "2025-04-10T02:39:15.922Z",
//     "updatedAt": "2025-04-10T02:39:15.922Z",
//     "id": 994,
//     "type": "click",
//     "key": "multiapp_start",
//     "values": {
//       "UserId": 7,
//       "appName": "2",
//       "version": "1.0.6",
//       "createdAt": "2025-04-10T02:39:15.919Z"
//     }
//   },
//   {
//     "createdAt": "2025-04-10T02:39:15.922Z",
//     "updatedAt": "2025-04-10T02:39:15.922Z",
//     "id": 993,
//     "type": "click",
//     "key": "multiapp_start",
//     "values": {
//       "UserId": 7,
//       "appName": "2",
//       "version": "1.0.6",
//       "createdAt": "2025-04-10T02:39:15.919Z"
//     }
//   },
//   {
//     "createdAt": "2025-04-10T02:39:15.922Z",
//     "updatedAt": "2025-04-10T02:39:15.922Z",
//     "id": 992,
//     "type": "click",
//     "key": "multiapp_start",
//     "values": {
//       "UserId": 7,
//       "appName": "2",
//       "version": "1.0.6",
//       "createdAt": "2025-04-10T02:39:15.919Z"
//     }
//   },
//   {
//     "createdAt": "2025-04-10T05:49:18.127Z",
//     "updatedAt": "2025-04-10T05:49:18.127Z",
//     "id": 125,
//     "type": "click",
//     "key": "sign-in-err",
//     "values": {
//       "account": "tachybase",
//       "version": "1.0.6",
//       "createdAt": "2025-04-10T05:49:18.126Z",
//       "deviceInfo": {
//         "language": "zh-CN",
//         "platform": "MacIntel",
//         "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36"
//       },
//       "error_status": 401,
//       "error_message": {
//         "errors": [
//           {
//             "message": "用户名邮箱或者密码有误,请重新输入"
//           }
//         ]
//       },
//       "signup_method": "account"
//     }
//   },
//   {
//     "createdAt": "2025-04-10T05:49:28.141Z",
//     "updatedAt": "2025-04-10T05:49:28.141Z",
//     "id": 126,
//     "type": "click",
//     "key": "sign-in",
//     "values": {
//       "account": "fanyukun",
//       "version": "1.0.6",
//       "createdAt": "2025-04-10T05:49:28.128Z",
//       "deviceInfo": {
//         "language": "zh-CN",
//         "platform": "MacIntel",
//         "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36"
//       },
//       "signup_method": "account"
//     }
//   }
// ]

// const config = {
//   filterKey: 'multiapp_start',
//   filterValues: {},
//   dedupBy: 'UserId',
//   minCount: 3
// }

// const result = countUsersByEventFrequency(data, config)
// console.log("%c Line:188 🍺 result", "font-size:18px;color:#6ec1c2;background:#465975", result);
