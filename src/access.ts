export default function (initialState: any) {
  return {
    canReadFoo: true,
    canUpdateFoo: () => true,
    canDeleteFoo: (data: any) => data?.status < 1, // 按业务需求自己任意定义鉴权函数
  };
}
