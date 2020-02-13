import React, { useState, useEffect } from "react";
import "./App.css";
import Grid from "./components/Grid";
import Welcome from "./components/Welcome";

function App() {
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {isLoading ? <Welcome /> : <Grid />}
      </header>
    </div>
  );
}

export default App;
