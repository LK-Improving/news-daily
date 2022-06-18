/**
 * 获取uuid
 */
export function getUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    return (
      c === 'x' ? (Math.random() * 16) | 0 : (<any>'r&0x3') | (<any>'0x8')
    ).toString(16);
  });
}
