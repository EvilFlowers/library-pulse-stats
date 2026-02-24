import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { bootstrapLocalData } from "@/lib/localdb";

async function start() {
  await bootstrapLocalData();
  createRoot(document.getElementById("root")!).render(<App />);
}
start();
