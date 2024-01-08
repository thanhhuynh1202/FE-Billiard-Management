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
  Modal,
} from "antd";
import React, { useEffect, useState } from "react";
import { IUnit, UnitDetail } from "@/lib/interfaceBase";

interface IProps {
  unit?: IUnit;
  onSubmit: (unit: UnitDetail, resetFormData: () => void) => void;
  onDelete: (unitId: number) => void;
  onUpdate: (unitId: number, area: UnitDetail) => void;
}
const initialValues: UnitDetail = {
  name: "",
};
const fullwidth: React.CSSProperties = {
  width: "100%",
};
const TableUnit: React.FC<IProps> = (props) => {
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm<UnitDetail>();

  useEffect(() => {
    if (props.unit) {
      setEditing(true);
      form.setFieldsValue(props.unit);
    }
  }, [form, props.unit]);
  const handleSubmit = (data: UnitDetail) => {
    props.onSubmit(data, () => form.resetFields());
  };

  const handleUpdate = async (unitId: any) => {
    props.onUpdate(unitId, form.getFieldsValue());
  };

  const handleDelete = async (unitId: any) => {
    Modal.confirm({
      title: "Bạn có muốn xóa ?",
      okText: "Yes",
      okType: "danger",
      width: "600px",
      onOk: () => {
        props.onDelete(unitId);
      },
    });
    
  };
  const RemovePOP = (
    <div>
      <p>Nhấp vào Edit để xóa Loại với ID!</p>
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
            <h1>Cập nhật đơn vị sản phẩm</h1>
          ) : (
            <h1>Tạo thêm đơn vị sản phẩm</h1>
          )}
        </Form.Item>
        <Form.Item
          name="name"
          label="Tên đơn vị sản phẩm"
          rules={[
            {
              required: true,
              message: "Tên đơn vị không được để trống!",
            },
          ]}
        >
          <Input
            name="name"
            type="text"
            placeholder="Nhập tên đơn vị sản phẩm"
          />
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
                          handleUpdate(props.unit?.id);
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
                    handleDelete(props.unit?.id);
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
export default TableUnit;
