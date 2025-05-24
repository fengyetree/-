import { createRoot } from "react-dom/client";
import App from "./App";
import React from 'react';
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
// 仅开发环境加载 stagewise toolbar
if (process.env.NODE_ENV === 'development') {
    import('@stagewise/toolbar-react').then(({ StagewiseToolbar }) => {
      const config = { plugins: [] };
      const toolbarRoot = document.getElementById('stagewise-toolbar-root');
      if (toolbarRoot) {
        createRoot(toolbarRoot).render(<StagewiseToolbar config={config} />);
      }
    });
}


