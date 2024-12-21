import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, onMount } from "solid-js";
import { MetaProvider } from "@solidjs/meta";
import { PocketbaseContextProvider } from "./context/PocketbaseContext";
import Nav from "~/components/Nav";
import "./app.css";

export default function App() {
  onMount(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => {
            console.log('Service Worker registered:', registration);
          })
          .catch(error => {
            console.error('Service Worker registration failed:', error);
          });
      });
    }
  });

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
