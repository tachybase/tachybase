import { Context } from '@tachybase/actions';

import { generateSalt, hashWithSalt } from '../cryptoUtils';
import { contractService } from '../web3/contractService';

// /api/blockchain:store
/**
 * 存储数据的处理函数
 * @param {Context} ctx 请求上下文
 */
export const store = async (ctx: Context) => {
  const { data } = ctx.action.params.values;
  try {
    for (const item of data) {
      const salt = generateSalt();
      const jsonData = JSON.stringify(item);
      const hashedData = hashWithSalt(jsonData, salt);
      await contractService.storeData(item.id, hashedData, salt);
    }
    ctx.body = '数据存储成功';
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = '数据存储出错';
  }
};

// /api/blockchain:getData?id=xxxx
/**
 * 获取数据的处理函数
 * @param {Context} ctx 请求上下文
 */
export const getDataHandler = async (ctx: Context) => {
  const id = ctx.action.params.id;
  try {
    const { hashedData, salt } = await contractService.getData(id);
    ctx.body = { hashedData, salt };
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = '检索数据时出错';
  }
};

// /api/blockchain:verify
/**
 * 验证数据的处理函数
 * @param {Context} ctx 请求上下文
 */
export const verify = async (ctx: Context) => {
  const { data } = ctx.action.params.values;
  try {
    for (const item of data) {
      const { id } = item;
      // 获取链上数据
      const { hashedData: storedHashedData, salt } = await contractService.getData(id);
      const jsonData = JSON.stringify(item);
      const hashedData = hashWithSalt(jsonData, salt);

      // 比较加密后的结果和链上的加密数据
      if (hashedData === storedHashedData) {
        console.log(`数据ID: ${id} 验证成功: 数据有效且未被篡改`);
      } else {
        console.log(`数据ID: ${id} 验证失败: 数据已被篡改或无效`);
      }
    }
    ctx.body = '数据验证完成';
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = '验证数据时出错';
  }
};

// 事件监听在应用启动时调用
contractService.setupEventListeners();
