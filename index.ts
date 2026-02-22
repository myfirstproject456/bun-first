import figlet from "figlet";
import index from "./index.html";
process.env.BUN_CONFIG_VERBOSE_FETCH = "true";

const server = Bun.serve({
  port: 3000,

  async fetch(req) {
    const url = new URL(req.url);

    // /
    if (url.pathname === "/") {
      return new Response("Home");
    }

    // /todo
    if (url.pathname === "/todo") {
      const todoLists = [
        { title: "my first title" },
        { title: "my second title" },
      ];

      return new Response(JSON.stringify(todoLists), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // /fetch/1
    if (url.pathname.startsWith("/fetch")) {
      const id: string = url.pathname.split("/")[2] || "1";
      return fetchPostById(id);
    }

    // /figlet
    if (url.pathname === "/figlet") {
      const body = figlet.textSync("Bun!");
      return new Response(body, {
        headers: { "Content-Type": "text/plain" },
      });
    }

    // /hashp
    if (url.pathname === "/hashp") {
      const password = "super-secure-pa$$word";

      const bcryptHash = await Bun.password.hash(password, {
        algorithm: "bcrypt",
        cost: 4, // number between 4-31
      });
      const isMatch = await Bun.password.verify(password, bcryptHash);
      return new Response(JSON.stringify({ isMatch }), {
        headers: { "Content-Type": "text/plain" },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
});

async function fetchPostById(id: string) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  const data = await res.json();

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}

console.log("Server running on http://localhost:3000");
console.log(`Listening on ${server.url}`);
