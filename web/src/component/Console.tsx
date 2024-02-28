import { ReactNode, useState, useRef } from "react";
import { CommandRow } from "./CommandRow";
import { Help } from "./Help";
import { getApiUrl } from "../utils/api";

export type CommandHistory = {
  type: "request" | "response";
  content: ReactNode;
  isError: boolean;
};

export function Console() {
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<CommandHistory[]>([
    { type: "request", isError: false, content: "Help" },
    { type: "response", isError: false, content: <Help /> },
  ]);
  const commandIndex = useRef(-1);

  return (
    <form
      className="rounded-md border border-solid border-gray-300 w-full max-w-3xl h-full max-h-[600px] flex flex-col justify-center items-center bg-gray-800 font-mono"
      onSubmit={(e) => {
        e.preventDefault();
        if (!command) return;
        switch (command.toLowerCase()) {
          case "help": {
            setHistory((h) => [
              ...h,
              { type: "request", content: command, isError: false },
              {
                type: "response",
                content: <Help shouldScroll />,
                isError: false,
              },
            ]);
            break;
          }
          case "clear":
          case "cls": {
            setHistory([]);
            break;
          }
          default: {
            sendCommand(command).then((r) => setHistory((h) => [...h, r]));
            setHistory((h) => [
              ...h,
              { type: "request", content: command, isError: false },
            ]);
          }
        }
        setCommand("");
        commandIndex.current = -1;
      }}
    >
      <section className="w-full grow px-1.5 py-1.5 flex flex-col gap-0.5 overflow-auto">
        {history.map((h, i) => (
          <CommandRow
            type={h.type}
            isError={h.isError}
            key={i}
            shouldScroll={i === history.length - 1}
          >
            {h.content}
          </CommandRow>
        ))}
      </section>
      <input
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        onKeyDown={(e) => {
          switch (e.key) {
            case "ArrowUp": {
              e.preventDefault();
              if (history.length === 0) break;
              if (commandIndex.current === -1)
                commandIndex.current = history.length / 2 - 1;
              else if (commandIndex.current > 0) commandIndex.current--;
              const prevCmd = history
                .filter((h) => h.type === "request")
                ?.[commandIndex.current].content?.toString();
              if (prevCmd) setCommand(prevCmd);
              break;
            }
            case "ArrowDown": {
              e.preventDefault();
              if (history.length === 0) break;
              const end = history.length / 2 - 1;
              if (commandIndex.current === end) {
                setCommand("");
                break;
              }
              if (commandIndex.current === -1) commandIndex.current = end;
              else if (commandIndex.current < end) commandIndex.current++;
              const nextCmd = history
                .filter((h) => h.type === "request")
                ?.[commandIndex.current].content?.toString();
              if (nextCmd) setCommand(nextCmd);
              break;
            }
            case "l": {
              if (!e.ctrlKey && !e.metaKey) break;
              e.preventDefault();
              setHistory([]);
              break;
            }
          }
        }}
        placeholder="Input command here..."
        className="w-full rounded-b-[5px] px-1.5 py-0.5 bg-gray-700 outline-none focus:bg-gray-600"
      />
    </form>
  );
}

async function sendCommand(command: string): Promise<CommandHistory> {
  const res = await fetch(`${getApiUrl()}/console`, {
    method: "POST",
    body: JSON.stringify({ command }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    return {
      type: "response",
      content:
        "The server failed to process this request, please contact the site admin.",
      isError: true,
    };
  }
  const { response, isError } = await res.json();
  return {
    type: "response",
    content: response,
    isError,
  };
}
