declare namespace API {
  // 登录传参
  type LoginParams = {
    username?: string;
    password?: string;
    uuid?: string;
    remember?: boolean;
    captcha?: string;
  };
}
