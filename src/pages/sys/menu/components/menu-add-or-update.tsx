import React, { MutableRefObject, useImperativeHandle, useState } from 'react';
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popover,
  Radio,
  TreeSelect,
} from 'antd';
import { useBoolean, useGetState } from 'ahooks';
import { menuApi, userApi } from '@/services/api';
import { MenuType } from '@/pages/sys/menu';
import { API } from '@/services/typings';
import { UserType } from '@/pages/sys/user';
import { treeDataTranslate } from '@/utils';

export type event = { init: (id: number) => void };

interface ModelProps {
  event: MutableRefObject<event>;
  refreshDataList: Function;
}

const MenuAddOrUpdate: React.FC<ModelProps> = (props) => {
  const [confirmLoading, { set: setConfirmLoading }] = useBoolean(false);

  const [visible, setVisible] = useState<boolean>(false);

  const [menuList, setMenuList] = useState<Array<MenuType>>([]);

  const [type, setType] = useState<number>(1);

  const [dataForm, setDataForm, getDataForm] = useGetState<MenuType>({
    icon: '',
    name: '',
    orderNum: 0,
    parentId: 0,
    type: 1,
    url: '',
  });

  const [form] = Form.useForm();

  const getMenuList = async () => {
    const res = (await menuApi.reqMenuList()) as Array<MenuType>;
    if (res && res.length >= 1) {
      const tempList = res.filter((item) => item.type !== 2);
      console.log(tempList);
      setMenuList(treeDataTranslate(tempList, 'menuId'));
    }
  };

  // 初始化
  const init = async (id: number) => {
    setDataForm({ ...dataForm, menuId: id | 0 });
    await getMenuList();
    if (getDataForm().menuId) {
      const res = (await menuApi.reqMenuInfo(
        getDataForm().menuId!,
      )) as API.ResultType & {
        menu: MenuType;
      };
      if (res && res.code === 0) {
        setType(res.menu.type!);
        form.setFieldsValue({
          menuId: res.menu.menuId,
          name: res.menu.name,
          type: res.menu.type,
          parentId: res.menu.parentId,
          url: res.menu.url,
          orderNum: res.menu.orderNum,
          icon: res.menu.icon,
        });
      }
    }
    setVisible(true);
  };

  useImperativeHandle(props.event, () => ({
    init,
  }));

  const onFinish = async (val: any) => {
    if (!val.menuId) {
      setConfirmLoading(true);
      const res: any = await menuApi.reqMenuSave(val);
      setTimeout(() => {
        if (res && res.code === 0) {
          message.success({
            content: '添加成功',
            duration: 1,
            onClose: props.refreshDataList(),
          });
          handleCancel();
        } else {
          message.error(res.msg);
        }
        setConfirmLoading(false);
      }, 1000);
    } else {
      setConfirmLoading(true);
      const res: any = await menuApi.reqMenuUpdate(val);
      setTimeout(() => {
        if (res && res.code === 0) {
          message.success({
            content: '修改成功',
            duration: 1,
            onClose: props.refreshDataList(),
          });
          handleCancel();
        } else {
          message.error(res.msg);
        }
        setConfirmLoading(false);
      }, 1000);
    }
  };

  const handleCancel = () => {
    setVisible(false);
    setConfirmLoading(false);
    form.resetFields();
  };

  return (
    <Modal
      title={dataForm.menuId ? '修改' : '添加'}
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
        <Form.Item name="menuId" hidden={true}>
          <Input />
        </Form.Item>

        <Form.Item label="类型" name="type">
          <Radio.Group
            onChange={(e) => {
              setType(e.target.value);
            }}
          >
            <Radio value={0}>目录</Radio>
            <Radio value={1}>菜单</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="菜单名称"
          name="name"
          rules={[{ required: true, message: '菜单名称不嫩为空!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="上级菜单"
          name="parentId"
          rules={[{ required: true, message: '上级菜单不能为空!' }]}
        >
          <TreeSelect
            style={{ width: '100%' }}
            // value={value}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={[
              {
                name: '一级菜单',
                menuId: '0',
                children: menuList,
              },
            ]}
            placeholder="Please select"
            treeDefaultExpandAll
            fieldNames={{
              label: 'name',
              value: 'menuId',
              children: 'children',
            }}
          ></TreeSelect>
        </Form.Item>

        {type === 1 ? (
          <Form.Item
            label="菜单URL"
            name="url"
            rules={[{ required: true, message: '菜单URl不能为空!' }]}
          >
            <Input />
          </Form.Item>
        ) : null}

        <Form.Item label="排序号" name="orderNum">
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item label="菜单图标" name="icon">
          <Popover
            content={<div>23</div>}
            title="选一个喜欢的图标吧！"
            placement={'topLeft'}
          >
            <Input />
          </Popover>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MenuAddOrUpdate;
