import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { MetaProvider } from "@solidjs/meta";
import { PocketbaseContextProvider } from "./context/PocketbaseContext";
import Nav from "~/components/Nav";
import "./app.css";

export default function App() {
  return (
    <MetaProvider>
      <PocketbaseContextProvider>
        <Router root={props => (
          <>
            <Nav />
            <Suspense>{props.children}</Suspense>
          </>
        )}>
          <FileRoutes />
        </Router>
      </PocketbaseContextProvider>
    </MetaProvider>
  );
}
