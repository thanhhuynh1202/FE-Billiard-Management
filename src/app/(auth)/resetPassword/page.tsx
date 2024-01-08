"use client";
import { login, resetPassword } from "@/app/services/authService";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button, Form, Input, message, Card, Checkbox } from "antd";
import { LoginDetail, ResetPasswordDetail } from "@/lib/interfaceBase";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const ResetPassword = () => {
  const [form] = Form.useForm<ResetPasswordDetail>();

  const handleSubmit = async (data: ResetPasswordDetail) => {
    try {
      const res = await resetPassword(data);
      if (res) {
        message.success("Mật khẩu đã được gửi, vui lòng kiểm tra email!");
        form.resetFields();
      }
    } catch (error) {
      message.error("Tài khoản hoặc mật khẩu không tồn tại!");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card style={{ width: 500 }}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <h1>Quên mật khẩu</h1>
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên đăng nhập!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              type="username"
              placeholder="Nhập tên đăng nhập"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập email!",
              },
              {
                type: "email",
                message: "Địa chỉ email không hợp lệ!",
              },
            ]}
          >
            <Input
              prefix={<MailOutlined className="site-form-item-icon" />}
              type="email"
              placeholder="Nhập email"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Gửi
            </Button>
          </Form.Item>
          <a href="/signin">Đăng nhập ngay</a>
        </Form>
      </Card>
    </div>
  );
};

export default ResetPassword;
