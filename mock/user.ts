import {
  Request,
  Response,
} from 'umi/node_modules/@umijs/deps/compiled/express';

// 默认admin权限
const ADMIN_ACCESS = 'admin';

/**
 * 当前用户的权限,如果为空则未登录
 */
const access = ADMIN_ACCESS;

const getAccess = () => {
  return access;
};

export default {
  'POST /login/account': (req: Request, res: Response) => {
    const { username, password, type } = req.body;
    if (type === 'account') {
      if (username === 'admin' && password === 'admin') {
        res.send({
          status: 'ok',
          type,
          currentAuthority: 'admin',
        });
        return;
      }
      if (username === 'user' && password === '123456') {
        res.send({
          status: 'ok',
          type,
          currentAuthority: 'user',
        });
        return;
      } else {
        res.send({
          status: false,
        });
        return;
      }
    }
    if (type === 'mobile') {
      res.send({
        status: 'ok',
      });
      return;
    }
    res.send({
      status: false,
    });
    return;
  },
  'GET /currentUser': (req: Request, res: Response) => {
    if (!getAccess()) {
      res.status(401).send({
        success: true,
        data: {
          isLogin: false,
        },
        errorCode: '401',
        errorMsg: '请先登录！',
      });
      return;
    }
    if (getAccess() === 'admin') {
      res.send({
        success: true,
        data: {
          username: 'admin',
          nickname: '管理员',
          userid: '001',
          avatar: 'http://dummyimage.com/100x100',
          access: getAccess(),
          country: 'China',
          geographic: {
            province: '宁夏回族自治区',
            city: '益阳市',
          },
          address: '重庆果洛藏族自治州三都水族自治县',
          phone: 18569641151,
        },
      });
      return;
    }
    if (getAccess() === 'user') {
      res.send({
        success: true,
        data: {
          username: 'user',
          nickname: '普通用户',
          userid: '002',
          avatar: 'http://dummyimage.com/100x100',
          access: getAccess(),
          country: 'China',
          geographic: {
            province: '宁夏回族自治区',
            city: '益阳市',
          },
          address: '重庆果洛藏族自治州三都水族自治县',
          phone: 18569641151,
        },
      });
      return;
    }
  },
};
