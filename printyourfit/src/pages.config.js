import Community from './pages/Community';
import Contact from './pages/Contact';
import Home from './pages/Home';
import Measurements from './pages/Measurements';
import Pattern from './pages/Pattern';
import Refine from './pages/Refine';
import Upload from './pages/Upload';
import Login from './pages/Login';
import __Layout from './Layout.jsx';

export const PAGES = {
    "Community": Community,
    "Contact": Contact,
    "Home": Home,
    "Measurements": Measurements,
    "Pattern": Pattern,
    "Refine": Refine,
    "Upload": Upload,
    "Login": Login,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};
