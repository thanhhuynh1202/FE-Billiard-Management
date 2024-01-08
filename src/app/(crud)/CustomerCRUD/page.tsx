"use client";
import React, { useEffect, useState } from "react";
import { Col, Flex, Row, message } from "antd";
import CustomerController from "./components/ListCustomer";
const AppCustomerCTRL: React.FC = () => {
  return (
    <>
      <CustomerController />
    </>
  );
};

export default AppCustomerCTRL;
