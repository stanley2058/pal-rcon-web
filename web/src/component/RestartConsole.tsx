import { useState } from "react";
import { CommandRow } from "./CommandRow";
import { getApiUrl } from "../utils/api";

export function RestartConsole() {
  const [value, setValue] = useState("");
  const [response, setResponse] = useState<string[]>([]);

  return (
    <form
      className="rounded-md border border-solid border-gray-300 w-full max-w-3xl h-full max-h-[600px] flex flex-col justify-center items-center bg-gray-800 font-mono"
      onSubmit={async (e) => {
        e.preventDefault();
        setValue("");
        if (value.toLowerCase() !== "restart") return;
        setResponse(() => ["Restart in progress, please wait..."]);
        for await (const partial of sendRestartUpdate()) {
          setResponse((r) => [...r, partial]);
        }
        setResponse((r) => [...r, "Restart & update in done!"]);
      }}
    >
      <section className="w-full grow px-1.5 py-1.5 flex flex-col gap-0.5 overflow-auto">
        {response.map((r, i) => (
          <CommandRow
            type="response"
            shouldScroll={i === response.length - 1}
            key={i}
          >
            {r}
          </CommandRow>
        ))}
      </section>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder='Type in "restart" to confirm the restart'
        className="w-full rounded-b-[5px] px-1.5 py-0.5 bg-gray-700 outline-none focus:bg-gray-600"
      />
    </form>
  );
}

async function* sendRestartUpdate() {
  const res = await fetch(`${getApiUrl()}/update`, {
    method: "POST",
  });
  if (!res.body) return;
  const reader = res.body.getReader();
  const enc = new TextDecoder("utf-8");

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const values = enc.decode(value).split("\n\n");
    for (const lines of values) {
      for (const line of lines.split("\n")) {
        if (line.startsWith("data:")) yield line.replace(/^data:[ ]+/, "");
        console.log(line);
      }
    }
  }
}
