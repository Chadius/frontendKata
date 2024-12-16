import { Outlet, Link } from "react-router-dom";

const Layout = () => {
    return (
        <>
            <nav>
                <ul>
                    <li>
                        <Link to="/counter">Counter</Link>
                    </li>
                    <li>
                        <Link to="/temperatureConverter">Temperature Converter</Link>
                    </li>
                    <li>
                        <Link to="/flightBooker">Flight Booker</Link>
                    </li>
                    <li>
                        <Link to="/timer">Timer</Link>
                    </li>
                    <li>
                        <Link to="/crud">Crud</Link>
                    </li>
                </ul>
            </nav>

            <Outlet />
        </>
    )
};

export default Layout;
