import React from "react";
import { Container } from "@mui/material";

const NonAuthLayout = ({ children }) => {
    return (
        <div>
            <header>NonAuth Layout Header</header>
            <main>{children}</main>
            <footer>NonAuth Layout Footer</footer>
        </div>
    );
};

export default NonAuthLayout;
