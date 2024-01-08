"use client";
import { Button, Form, Input, Row, Col, Space, Card, Popover, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { CategoryDetail, ICategory } from "@/lib/interfaceBase";

interface IProps {
  category?: ICategory;
  onSubmit: (category: CategoryDetail, resetFormData: () => void) => void;
  onDelete: (categoryId: number) => void;
  onUpdate: (categoryId: number, area: CategoryDetail) => void;
}
const initialValues: CategoryDetail = {
  name: "",
};
const fullwidth: React.CSSProperties = {
  width: "100%",
};
const TableCategory: React.FC<IProps> = (props) => {
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm<CategoryDetail>();

  useEffect(() => {
    if (props.category) {
      setEditing(true);
      form.setFieldsValue(props.category);
    }
  }, [form, props.category]);
  const handleSubmit = (data: CategoryDetail) => {
    props.onSubmit(data, () => form.resetFields());
  };

  const handleUpdate = async (categoryId: any) => {
    props.onUpdate(categoryId, form.getFieldsValue());
  };

  const handleDelete = async (categoryId: any) => {
    Modal.confirm({
      title: "Bạn có muốn xóa ?",
      okText: "Yes",
      okType: "danger",
      width: "600px",
      onOk: () => {
        props.onDelete(categoryId);
      },
    });
  };
  const RemovePOP = (
    <div>
      <p>Nhấp vào Edit để xóa danh mục với ID!</p>
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
            <h1>Cập nhật danh mục sản phẩm</h1>
          ) : (
            <h1>Tạo thêm danh mục sản phẩm</h1>
          )}
        </Form.Item>
        <Form.Item
          name="name"
          label="Tên danh mục"
          rules={[
            {
              required: true,
              message: "Tên danh mục không được để trống!",
            },
          ]}
        >
          <Input name="name" type="text" placeholder="Nhập tên danh mục" />
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
                          handleUpdate(props.category?.id);
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
                    handleDelete(props.category?.id);
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
export default TableCategory;
