"use client";
import {
  Button,
  Form,
  Input,
  Row,
  Col,
  Space,
  Card,
  Popover,
  InputNumber,
  Modal,
  Radio,
} from "antd";
import React, { useEffect, useState } from "react";
import { CustomerDetail, ICustomer } from "@/lib/interfaceBase";

interface IProps {
  customer?: ICustomer;
  onSubmit: (customer: CustomerDetail, resetFormData: () => void) => void;
  onDelete: (customerId: number) => void;
  onUpdate: (customerId: number, area: CustomerDetail) => void;
  editing: boolean;
}
const initialValues: CustomerDetail = {
  name: "",
  email: "",
  phone: "",
  balance: 0,
  gender: ""
};
const fullwidth: React.CSSProperties = {
  width: "100%",
};
const TableCustomer: React.FC<IProps> = (props) => {
  const [editing, setEditing] = useState<boolean>(false);
  const [form] = Form.useForm<CustomerDetail>();
  console.log(props.editing);
  useEffect(() => {
    if (props.editing) {
      if (props.customer) {
        setEditing(props.editing);
        form.setFieldsValue(props.customer);
      }
    } else {
      setEditing(props.editing);
      form.resetFields();
    }
  }, [props.editing, form, props.customer]);
  const handleSubmit = (data: CustomerDetail) => {
    console.log(data)
    props.onSubmit(data, () => form.resetFields());
  };

  const handleUpdate = async (customerId: any) => {
    props.onUpdate(customerId, form.getFieldsValue());
  };

  const handleDelete = async (customerId: any) => {
    Modal.confirm({
      title: "Bạn có muốn xóa ?",
      okText: "Yes",
      okType: "danger",
      width: "600px",
      onOk: () => {
        props.onDelete(customerId);
      },
    });
  };
  const RemovePOP = (
    <div>
      <p>Nhấp vào Edit để xóa khách hàng với ID!</p>
    </div>
  );

  const handleClick = async (event: any) => {};
  return (
    <Card>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onSubmitCapture={(e) => {
          e.preventDefault;
        }}
        initialValues={initialValues}
      >
        <Form.Item style={{ textAlign: "center" }}>
          {editing ? (
            <h1>Cập nhật khách hàng</h1>
          ) : (
            <h1>Tạo thêm khách hàng</h1>
          )}
        </Form.Item>
        <Form.Item
          name="name"
          label="Tên khách hàng"
          rules={[
            {
              required: true,
              message: "Tên khách hàng không được để trống!",
            },
          ]}
        >
          <Input name="name" type="text" placeholder="Nhập tên khách hàng" />
        </Form.Item>

        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              required: true,
              message: "Email không được để trống!",
            },
            {
              type: "email",
              message: "Không đúng định dạng Email!",
            },
          ]}
        >
          <Input
            name="email"
            type="email"
            placeholder="Nhập E-mail khách hàng"
          />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[
            {
              required: true,
              message: "Số điện thoại không được để trống!",
            },
            {
              min: 10,
              max: 11,
              message: "Số điện thoại từ 10-11 số!",
            },
            {
              pattern: new RegExp(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g),
              message: "Không đúng định dạng số điện thoại!",
            },
          ]}
        >
          <Input
            name="phone"
            type="text"
            minLength={10}
            maxLength={11}
            placeholder="Nhập Số điện thoại khách hàng"
          />
        </Form.Item>

        <Form.Item
          name="balance"
          label="Ghi nợ"
          rules={[
            {
              required: true,
              message: "Ghi nợ không được để trống!",
            },
            {
              type: "number",
              message: "Ghi nợ phải là số!",
            },
          ]}
        >
          <InputNumber
            formatter={(value) => `${value}%`}
            name="balance"
            min={0}
            max={100}
          />
        </Form.Item>
        <Form.Item
          label="Giới tính"
          name="gender"
          rules={[
            { required: true, message: "Vui lòng chọn !" },
          ]}
        >
          <Radio.Group>
            <Radio value="Male" checked>NAM</Radio>
            <Radio value="Female">NỮ</Radio>
            <Radio value="Other">Khác</Radio>
            {/* Add more roles as needed */}
          </Radio.Group>
        </Form.Item>
        <Row gutter={32} justify={"center"}>
          <Col span={16}>
            <Space direction="vertical" style={fullwidth}>
              <Space direction="vertical" style={fullwidth}>
                <Row gutter={16}>
                  <Col span={12}>
                    {editing ? (
                      <Button
                        htmlType="button"
                        onClick={(e) => {
                          setEditing(false);
                          handleClick(e.preventDefault());
                          form.resetFields();
                        }}
                        size="large"
                        block
                      >
                        Hủy
                      </Button>
                    ) : (
                      <Button
                        htmlType="submit"
                        type="primary"
                        size="large"
                        block
                      >
                        Thêm
                      </Button>
                    )}
                  </Col>
                  <Col span={12}>
                    {editing ? (
                      <Button
                        type="primary"
                        size="large"
                        block
                        onClick={() => {
                          handleUpdate(props.customer?.id);
                        }}
                      >
                        Sửa
                      </Button>
                    ) : (
                      <Button type="primary" size="large" block disabled>
                        Sửa
                      </Button>
                    )}
                  </Col>
                </Row>
              </Space>
            </Space>
          </Col>
          <Col className="gutter-row" span={6}>
            <Space direction="vertical" style={fullwidth}>
              {!editing ? (
                <Popover content={RemovePOP} title="Lưu ý!">
                  <Button type="primary" size="large" danger block disabled>
                    Xóa
                  </Button>
                </Popover>
              ) : (
                <Button
                  type="primary"
                  size="large"
                  danger
                  block
                  onClick={() => {
                    handleDelete(props.customer?.id);
                  }}
                >
                  Xóa
                </Button>
              )}
            </Space>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};
export default TableCustomer;
