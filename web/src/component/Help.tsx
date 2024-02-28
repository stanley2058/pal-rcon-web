import { ReactNode, useRef, useEffect } from "react";
import { cn } from "../utils/cn";

type TableElementProps = { className?: string; children: ReactNode };
function Tr(props: TableElementProps) {
  return (
    <tr
      className={cn(
        "odd:bg-gray-900 even:bg-gray-800 border-none",
        props.className,
      )}
    >
      {props.children}
    </tr>
  );
}
function Td(props: TableElementProps) {
  return (
    <td className={cn("px-1.5 border-none", props.className)}>
      {props.children}
    </td>
  );
}
function Th(props: TableElementProps) {
  return (
    <th className={cn("px-1.5 border-none", props.className)}>
      {props.children}
    </th>
  );
}

export function Help(props: { shouldScroll?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!props.shouldScroll || !ref.current) return;
    ref.current.scrollIntoView({ behavior: "smooth" });
  }, [props.shouldScroll]);
  return (
    <div ref={ref} className="rounded bg-gray-700">
      <table style={{ borderCollapse: "separate" }}>
        <thead>
          <tr>
            <Th>Command</Th>
            <Th>Description</Th>
          </tr>
        </thead>
        <tbody>
          <Tr>
            <Td>/AdminPassword</Td>
            <Td>Obtain administrative privileges using a password.</Td>
          </Tr>
          <Tr>
            <Td>/Shutdown &lt;Seconds&gt; &lt;MessageText&gt;</Td>
            <Td>
              Shutdown the server.
              <br />
              If &lt;Seconds&gt; is specified, the server will shut down after
              the specified time has elapsed.
              <br />
              The server participant will be notified of what you have entered
              in &lt;MessageText&gt;.
            </Td>
          </Tr>
          <Tr>
            <Td>/DoExit</Td>
            <Td>Force stop the server.</Td>
          </Tr>
          <Tr>
            <Td>/Broadcast &lt;MessageText&gt;</Td>
            <Td>Send message to all player in the server.</Td>
          </Tr>
          <Tr>
            <Td>/KickPlayer &lt;SteamID&gt;</Td>
            <Td>Kick player by &lt;SteamID&gt; from the server.</Td>
          </Tr>
          <Tr>
            <Td>/BanPlayer &lt;SteamID&gt;</Td>
            <Td>Ban player by &lt;SteamID&gt; from the server.</Td>
          </Tr>
          <Tr>
            <Td>/TeleportToPlayer &lt;SteamID&gt;</Td>
            <Td>Teleport to &lt;SteamID&gt;.</Td>
          </Tr>
          <Tr>
            <Td>/TeleportToMe &lt;SteamID&gt;</Td>
            <Td>Player &lt;SteamID&gt; is teleport to me.</Td>
          </Tr>
          <Tr>
            <Td>/ShowPlayers</Td>
            <Td>Show information on all connected players.</Td>
          </Tr>
          <Tr>
            <Td>/Info</Td>
            <Td>Show server information.</Td>
          </Tr>
          <Tr>
            <Td>/Save</Td>
            <Td>Save the world data.</Td>
          </Tr>
          <Tr>
            <td colSpan={2} className="px-1.5 border-none">
              <a
                rel="noreferrer"
                target="_blank"
                href="https://tech.palworldgame.com/settings-and-operation/commands#command-list"
                className="text-cyan-300 underline hover:text-cyan-100"
              >
                See official documentation for more.
              </a>
            </td>
          </Tr>
        </tbody>
      </table>
    </div>
  );
}
