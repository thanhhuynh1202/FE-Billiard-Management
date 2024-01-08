"use client";
import { login } from "@/app/services/authService";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button, Form, Input, message, Card, Checkbox } from "antd";
import { LoginDetail } from "@/lib/interfaceBase";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

const Signin = () => {
  const [form] = Form.useForm<LoginDetail>();

  const success = () => {
    message.success("Đăng nhập thành công!");
  };

  const handleSubmit = async (data: LoginDetail) => {
    try {
      const jwtTokenData = await login(data);
      console.log(JSON.parse(JSON.stringify(jwtTokenData)));
      const error = () => {
        //@ts-ignore
        message.error(jwtTokenData.message);
      };
      //@ts-ignore
      if (JSON.parse(JSON.stringify(jwtTokenData?.tokenType)) === "Bearer") {
        window.location.reload();
      }
      // console.log(jwtTokenData.status);
      //@ts-ignore
      if (JSON.parse(JSON.stringify(jwtTokenData?.tokenType)) === "Bearer") {
        success();
      } else {
        error();
      }
    } catch (error) {
      console.log(error);
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
          <h1>Đăng nhập</h1>
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
            name="password"
            label="Mật khẩu"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Nhập mật khẩu"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
          <a href="/resetPassword">Quên mật khẩu ?</a>
        </Form>
      </Card>
    </div>
  );
};

export default Signin;
