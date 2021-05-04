import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import "./App.css";
import { ClickExample } from "./Click";

const examples: {
  route: string
  title: string
  component: () => JSX.Element
}[] = [{
  route: '/click',
  title: 'click',
  component: ClickExample
}]

function App() {
  return (
    <Router>
    <div>
      <nav>
        <ul>
          {examples.map((o, index) => {
            return (
              <li key={index}>
            <Link to={o.route}>{o.title}</Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <Switch>
        {examples.map((o, index) => {
          return <Route path={o.route} component={o.component} />
        })}
      </Switch>
    </div>
  </Router>

  );
}

export default App;
