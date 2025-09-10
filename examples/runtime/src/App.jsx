import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import StaticCSSPage from "./pages/StaticCSSPage";
import DynamicCSSPage from "./pages/DynamicCSSPage";
import ConditionalCSSPage from "./pages/ConditionalCSSPage";
import AIJSONPage from "./pages/AIJSONPage";
import ThemeSwitchingPage from "./pages/ThemeSwitchingPage";
import UserCustomizationPage from "./pages/UserCustomizationPage";
import VanillaJSPage from "./pages/VanillaJSPage";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/static-css" element={<StaticCSSPage />} />
        <Route path="/dynamic-css" element={<DynamicCSSPage />} />
        <Route path="/conditional-css" element={<ConditionalCSSPage />} />
        <Route path="/ai-json" element={<AIJSONPage />} />
        <Route path="/theme-switching" element={<ThemeSwitchingPage />} />
        <Route path="/user-customization" element={<UserCustomizationPage />} />
        <Route path="/vanilla-js" element={<VanillaJSPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
