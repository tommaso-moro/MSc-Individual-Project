import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { createBrowserHistory } from 'history';

//import pages components
import HomePage from './components/pages/HomePage.js';
import NavBar from './components/UIComponents/NavBar';
import AboutPage from './components/pages/AboutPage';

import 'antd/dist/antd.css';
import TagsExplorationPage from './components/pages/TagsExplorationPage';




function App() {
  return (
    <Router history={createBrowserHistory()}>
      <div className="App" style={{"height": "100vh"}}>
        <div style={{marginTop: '2rem', marginBottom: '1rem'}}>
          <NavBar/>
        </div>
        <Route path="/" exact component={HomePage}></Route>
        <Route path="/about" exact component={AboutPage}></Route>
        <Route path="/topics_comparison" exact component={TagsExplorationPage}></Route>
      </div>
    </Router>
  );
}

export default App;
