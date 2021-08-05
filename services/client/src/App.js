import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ProtectedRoute from "./components/protected-route";
import Home from "./pages/home";
import EmployeeDash from "./pages/employee-dash";
import CustomerDash from "./pages/customer-dash";
import "./styles/App.css";
import "antd/dist/antd.css";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <ProtectedRoute exact path="/employee/dash" component={EmployeeDash} />
        <ProtectedRoute exact path="/customer/dash" component={CustomerDash} />
        <Route path="*">
          <div>
            <h1>404 Not Found</h1>
            <p>The page you are looing for does not exist.</p>
          </div>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
