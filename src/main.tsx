import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { bootstrapLocalData } from "@/lib/localdb";

bootstrapLocalData();
createRoot(document.getElementById("root")!).render(<App />);
