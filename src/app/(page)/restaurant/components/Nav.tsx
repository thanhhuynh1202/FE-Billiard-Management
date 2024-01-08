"use client";
import React, { useState } from "react";
import { Button, Col, Menu, MenuProps, Row, Typography } from "antd";
import { useAuth } from "@/app/hooks/use-auth";
import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";

const Nav = () => {
  const router = useRouter();
  const logOut = () => {
    deleteCookie("access_token");
    window.location.reload();
  };
  const { data } = useAuth();
  //@ts-ignore
  const username = data?.username;
  // console.log(data/)
  const items: MenuProps["items"] = [
    {
      label: username ? (
        username
      ) : (
        <Button onClick={() => router.push("/signin")}>Đăng nhập</Button>
      ),
      key: "SubMenu",
      //   icon: <SettingOutlined />,
      children: data
        ? [
            {
              key: "1",
              label: "Thông tin tài khoản",
            },
            {
              key: "2",
              label: <a onClick={() => router.push("/")}>Về Dashboard</a>,
            },
            {
              key: "3",
              danger: true,
              label: <a onClick={() => logOut()}>Đăng xuất</a>,
            },
          ]
        : [],
    },
  ];
  const [current, setCurrent] = useState("mail");

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };
  return (
    <>
      <Row
        style={{
          marginBottom: "15px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography style={{ fontWeight: "500", fontSize: "23px", flex: 1, padding:"10px" }}>
          Billiard Manager
        </Typography>
        <Col>
            <Menu
              onClick={onClick}
              theme="light"
              mode="horizontal"
              selectedKeys={[current]}
              items={items}
              style={{ justifyContent: "flex-end" }}
            />
        </Col>
      </Row>
    </>
  );
};
export default Nav;
