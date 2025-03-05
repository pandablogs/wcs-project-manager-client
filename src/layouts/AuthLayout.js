import React from "react";
import { Container } from "@mui/material";
import Header from "../components/common/Header";

const AuthLayout = ({ children }) => {
    return (<>
        <Header />
        <div>{children}</div>
        {/* <footer>Auth Layout Footer</footer> */}
    </>
    );
};

export default AuthLayout;
