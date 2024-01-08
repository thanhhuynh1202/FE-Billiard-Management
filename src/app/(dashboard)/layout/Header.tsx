import { useState, useEffect } from "react";

import {
  Row,
  Col,
  Breadcrumb,
  Badge,
  Dropdown,
  Button,
  List,
  Avatar,
  Input,
  Drawer,
  Typography,
  Switch,
  Menu,
  MenuProps,
} from "antd";

import {
  SearchOutlined,
  StarOutlined,
  TwitterOutlined,
  FacebookFilled,
} from "@ant-design/icons";

import { NavLink, Link } from "react-router-dom";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/use-auth";
import { deleteCookie } from "cookies-next";

const profile = [
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    key={0}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10ZM12 7C12 8.10457 11.1046 9 10 9C8.89543 9 8 8.10457 8 7C8 5.89543 8.89543 5 10 5C11.1046 5 12 5.89543 12 7ZM9.99993 11C7.98239 11 6.24394 12.195 5.45374 13.9157C6.55403 15.192 8.18265 16 9.99998 16C11.8173 16 13.4459 15.1921 14.5462 13.9158C13.756 12.195 12.0175 11 9.99993 11Z"
      fill="#111827"
    ></path>
  </svg>,
];

interface HeaderProps {
  name: string; // Assuming name is a string, adjust the type accordingly
  subName: string; // Assuming subName is a string, adjust the type accordingly
  onPress: () => void; // Assuming onPress is a function, adjust the type accordingly
}
const Header: React.FC<HeaderProps> = ({ name, subName, onPress }) => {
  const router = useRouter();
  const { data } = useAuth();
  //@ts-ignore
  const username = data?.fullname;
  console.log(data);
  const { Title, Text } = Typography;
  const logOut = () => {
    deleteCookie("access_token");
    window.location.replace("/");
  };
  useEffect(() => window.scrollTo(0, 0));
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
            // {
            //   key: "2",
            //   label: <a onClick={() => router.push("/")}>Về Dashboard</a>,
            // },
            {
              key: "2",
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
      <Row gutter={[24, 0]}>
        <Col span={24} md={6}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <NavLink to="/">Pages</NavLink>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{name.replace("/", "")}</Breadcrumb.Item>
          </Breadcrumb>
          <div className="ant-page-header-heading">
            <span
              className="ant-page-header-heading-title"
              style={{ textTransform: "capitalize" }}
            >
              {subName.replace("/", "")}
            </span>
          </div>
        </Col>
        <Col span={24} md={18} className="header-control">
          <Button
            type="link"
            className="sidebar-toggler"
            onClick={() => onPress()}
          >
            Menu
          </Button>
          {/* <Button
            className="btn-sign-in"
          >
            {profile}
            <span>{username}</span>
          </Button> */}
          <Menu
            onClick={onClick}
            theme="light"
            selectedKeys={[current]}
            items={items}
          />
          <Button style={{ marginRight: "20px" }} href="/restaurant">
            Trang thu ngân
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default Header;
