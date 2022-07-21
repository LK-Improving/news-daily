import React, {
  forwardRef,
  MutableRefObject,
  Ref,
  useImperativeHandle,
  useState,
} from 'react';
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popover,
  Radio,
  Tree,
  TreeSelect,
} from 'antd';
import { useBoolean, useGetState, useMount } from 'ahooks';
import {
  reqMenuList,
  reqMenuSave,
  reqMenuUpdate,
  roleApi,
} from '@/services/api';
import { RoleType } from '@/pages/sys/role';
import { treeDataTranslate } from '@/utils';
import { MenuType } from '@/pages/sys/menu';
import { API } from '@/services/typings';

export type event = { init: (id: number) => void };

interface ModelProps {
  event: MutableRefObject<event>;
  getRoleList: Function;
}

const RoleAddOrUpdate: React.FC<ModelProps> = (props) => {
  const [confirmLoading, { set: setConfirmLoading }] = useBoolean(false);

  const [visible, setVisible] = useState<boolean>(false);

  const [dataForm, setDataForm, getDataForm] = useGetState<{
    [P in keyof RoleType]?: RoleType[P];
  }>({
    roleId: 0,
    roleName: '',
    remark: '',
    menuIdList: [],
  });

  const [treeData, setTreeData] = useState<Array<MenuType>>([]);

  const [form] = Form.useForm();

  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>(
    dataForm.menuIdList!,
  );

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  // 初始化
  const init = async (id: number) => {
    await getTreeData();
    if (id) {
      const res = (await roleApi.reqRoleInfo(id)) as API.ResultType & {
        role: RoleType;
      };
      if (res && res.code === 0) {
        setCheckedKeys(res.role.menuIdList);
        form.setFieldsValue({
          roleId: res.role.roleId,
          roleName: res.role.roleName,
          remark: res.role.remark,
          menuIdList: res.role.menuIdList,
        });
      }
    }
    setVisible(true);
  };

  useImperativeHandle(props.event, () => ({
    init,
  }));

  const onCheck = (checkedKeysValue: any) => {
    console.log('onCheck', checkedKeysValue);
    form.setFieldsValue({ menuIdList: checkedKeysValue });
    setCheckedKeys(checkedKeysValue);
  };

  const onFinish = async (val: any) => {
    if (!val.roleId) {
      setConfirmLoading(true);
      const res: any = await roleApi.reqRoleSave(val);
      setTimeout(() => {
        if (res && res.code === 0) {
          message.success({
            content: '添加成功',
            duration: 1,
            onClose: props.getRoleList(),
          });
          handleCancel();
        } else {
          message.error(res.msg);
        }
        setConfirmLoading(false);
      }, 1000);
    } else {
      setConfirmLoading(true);
      const res: any = await roleApi.reqRoleUpdate(val);
      setTimeout(() => {
        if (res && res.code === 0) {
          message.success({
            content: '修改成功',
            duration: 1,
            onClose: props.getRoleList(),
          });
          handleCancel();
        } else {
          message.error(res.msg);
        }
        setConfirmLoading(false);
      }, 1000);
    }
  };
  // 取消操作
  const handleCancel = () => {
    setConfirmLoading(false);
    form.resetFields();
    setCheckedKeys([]);
    setVisible(false);
  };

  // 获取树结构数据
  const getTreeData = async () => {
    const res = (await reqMenuList()) as Array<MenuType>;
    const tempList = res.filter((item) => item.type !== 2);
    setTreeData(treeDataTranslate(tempList, 'menuId'));
  };

  return (
    <Modal
      title={dataForm.roleId ? '修改' : '添加'}
      visible={visible}
      onCancel={handleCancel}
      footer={
        <Form.Item>
          <Button
            type="primary"
            loading={confirmLoading}
            onClick={form.submit}
            htmlType="submit"
          >
            确定
          </Button>
          <Button type="link" htmlType="button" onClick={handleCancel}>
            取消
          </Button>
        </Form.Item>
      }
      confirmLoading={confirmLoading}
    >
      <Form
        name="basic"
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        onFinish={onFinish}
        autoComplete="off"
        initialValues={dataForm}
      >
        <Form.Item name="roleId" hidden={true}>
          <Input />
        </Form.Item>

        <Form.Item
          label="角色名称"
          name="roleName"
          rules={[{ required: true, message: '角色名称不嫩为空!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="备注" name="remark">
          <Input />
        </Form.Item>

        {treeData.length > 0 ? (
          <Form.Item label="授权" name="menuIdList">
            <Tree
              checkable
              defaultExpandAll={true}
              onCheck={onCheck}
              checkedKeys={checkedKeys}
              treeData={treeData}
              fieldNames={{
                title: 'name',
                key: 'menuId',
                children: 'children',
              }}
            />
          </Form.Item>
        ) : null}
      </Form>
    </Modal>
  );
};

export default RoleAddOrUpdate;
