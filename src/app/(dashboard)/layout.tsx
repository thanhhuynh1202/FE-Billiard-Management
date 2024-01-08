// RootLayout.js
"use client";
import React, { Suspense, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { isBrowser } from "@/utils/is-browser";
import Main from "./layout/Main";
import Home from "./pages/home";
import AppRoomCTRL from "../(crud)/RoomCRUD/page";
import AppProductCTRL from "../(crud)/ProductCRUD/page";
import AppOrderCTRL from "../(crud)/Order/page";
import AppUserCTRL from "../(crud)/UserCRUD/page";
import AppCustomerCTRL from "../(crud)/CustomerCRUD/page";
import History from "../(crud)/HistoryCRUD/page";
// import AppRoomProductCTRL from "../(crud)/RoomProductCRUD/page";

const RootLayout = () => {
  const [initialRenderComplete, setInitialRenderComplete] = useState(false);

  useEffect(() => {
    setInitialRenderComplete(true);
  }, []);

  if (!initialRenderComplete) {
    return null;
  } else {
    if (isBrowser) {
      return (
        <Suspense fallback={<div>Loading...</div>}>
          <Router>
            <Main>
              <Routes>
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace={true} />}
                />
                <Route path="dashboard" element={<Home />} />
                <Route path="roommanager" element={<AppRoomCTRL />} />
                <Route path="productmanager" element={<AppProductCTRL />}/>
                <Route path="ordermanager" element={<AppOrderCTRL />}/>
                <Route path="usermanager" element={<AppUserCTRL />}/>
                <Route path="customermanager" element={<AppCustomerCTRL />}/>
                <Route path="history" element={<History />}/>

                {/* <Route path="roomproductmanager" element={<AppRoomProductCTRL />}/> */}

              </Routes>
            </Main>
          </Router>
        </Suspense>
      );
    }

    return null;
  }
};

export default RootLayout;
