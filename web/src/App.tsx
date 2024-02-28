import { useState } from "react";
import { Button } from "./component/Button";
import { Console } from "./component/Console";
import { RestartConsole } from "./component/RestartConsole";

export default function App() {
  const [restartMode, setRestartMode] = useState(false);
  return (
    <main className="w-full h-full flex flex-col justify-center items-center p-5 gap-2">
      <section>
        <Button onClick={() => setRestartMode(!restartMode)}>
          {restartMode ? "Back to console" : "Restart Server"}
        </Button>
      </section>
      {restartMode ? <RestartConsole /> : <Console />}
    </main>
  );
}
