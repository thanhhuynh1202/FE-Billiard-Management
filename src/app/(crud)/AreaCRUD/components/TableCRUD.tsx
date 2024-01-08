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
import { AreaDetail, IArea } from "@/lib/interfaceBase";

interface IProps {
  area?: IArea;
  onSubmit: (area: AreaDetail, resetFormData: () => void) => void;
  onDelete: (areaId: number) => void;
  onUpdate: (areaId: number, area: AreaDetail) => void;
}
const initialValues: AreaDetail = {
  name: "",
};
const fullwidth: React.CSSProperties = {
  width: "100%",
};

const TableArea: React.FC<IProps> = (props) => {
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm<AreaDetail>();

  useEffect(() => {
    if (props.area) {
      setEditing(true);
      form.setFieldsValue(props.area);
    }
  }, [form, props.area]);
  const handleSubmit = (data: AreaDetail) => {
    props.onSubmit(data, () => form.resetFields());
  };

  const handleUpdate = async (areaId: any) => {
    props.onUpdate(areaId, form.getFieldsValue());
  };

  const handleDelete = async (areaId: any) => {
    Modal.confirm({
      title: "Bạn có muốn xóa ?",
      okText: "Yes",
      okType: "danger",
      width: "600px",
      onOk: () => {
        props.onDelete(areaId);
      },
    });
    
  };
  const RemovePOP = (
    <div>
      <p>Nhấp vào Edit để xóa khu vực với ID!</p>
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
          {editing ? <h1>Cập nhật khu vực</h1> : <h1>Tạo thêm khu vực</h1>}
        </Form.Item>
        <Form.Item
          name="name"
          label="Tên khu vực"
          rules={[
            {
              required: true,
              message: "Tên khu vực không được để trống!",
            },
          ]}
        >
          <Input name="name" type="text" placeholder="Nhập tên khu vực" />
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
                          handleUpdate(props.area?.id);
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
                    handleDelete(props.area?.id);
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
export default TableArea;
