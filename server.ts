// Start listening on port 8080 of localhost.
const server = Deno.listen({ port: 8080 });
console.log(`HTTP webserver running.  Access it at:  http://localhost:8080/`);

// Connections to the server will be yielded up as an async iterable.
for await (const conn of server) {
	// In order to not be blocking, we need to handle each connection individually
	// without awaiting the function
	// serveHttp(conn);
	const httpConn = Deno.serveHttp(conn);

	// Each request sent over the HTTP connection will be yielded as an async
	// iterator from the HTTP connection.
	for await (const { request, respondWith } of httpConn) {
		// The native HTTP server uses the web standard `Request` and `Response`
		// objects.

		const { method, url } = request;

		const baseUrl = new URL(url);
		const { pathname } = baseUrl;
		// console.log({ pathname });

		// console.log("baseUrl: ", baseUrl);

		// get param for /hello
		const pattern = new URLPattern({ pathname: "/hello/:name" });
		// console.log({ pattern });
		const parameter = pattern.exec(url); // return 'bob' if /hello/bob
		const name = pattern.exec(url)?.pathname.groups.name;

		const test = pattern.test(url); //return true if pattern matches /hello/:name
		// console.log(test, parameter && parameter.pathname.groups.name);
		// console.log({pathname});

		//match todo id
		const pattern2 = new URLPattern({ pathname: "/todo/:id" });
		const match2 = pattern2.exec(url);
		const id = pattern2.exec(url)?.pathname.groups.id;

		switch (pathname) {
			case "/hello": {
				if(method !== "GET") break;
				const ResponseBody = `Your user-agent is:\n\n${
					request.headers.get("user-agent") ?? "Unknown"
				}`;
				respondWith(
					new Response(ResponseBody, {
						status: 200,
					})
				);

				break;
			}
			case `/hello/${name}`: {
				if (method !== "GET") break;
				const ResponseBody = `Your name is ${name}`;
				respondWith(
					new Response(ResponseBody, {
						status: 200,
					})
				);
				break;
			}
			case "/echo": {
				if (method !== "GET") break;
				let query = baseUrl.searchParams.get("q");
				const ResponseBody = `Your query string is: ${query}`;
				respondWith(
					new Response(ResponseBody, {
						status: 200,
					})
				);

				break;
			}
			case "/redirect": {
				if (method !== "GET") break;
				// respondWith(new Response.redirect(baseUrl.origin, 302));
				respondWith(
					new Response("", {
						status: 302,
						headers: new Headers({
							location: "/",
						}),
					})
				);
				console.log("SUCCESSES REDIRECT TO: ", pathname);
				break;
			}

			case "/login": {
				if (method !== "POST") break;
				const requestJson = await request.json();
				const { name, password } = requestJson;
				let statusCode = 403;

				if (name === "alice" && password === "redqueen") {
					statusCode = 200;
					respondWith(
						new Response("Hello alice", {
							status: statusCode,
						})
					);
				} else {
					respondWith(
						new Response("wrong password", {
							status: statusCode,
						})
					);
				}
				break;
			}
			case `/todo/${id}`: {
				if (method !== "DELETE") break;
				const requestJson = await request.json();

				const { name, password } = requestJson;
				let statusCode = 403;

				if (
					name === "alice" &&
					password === "redqueen" &&
					id === "42"
				) {
					statusCode = 200;
					respondWith(
						new Response("deleted todo", {
							status: statusCode,
						})
					);
				} else {
					respondWith(
						new Response("no permissions", {
							status: statusCode,
						})
					);
				}
				break;
			}
			case `/`: {
				const body = `HOME`;
				respondWith(
					new Response(body, {
						status: 200,
					})
				);
				break;
			}

			default: {
				respondWith(
					new Response("Not found", {
						status: 404,
					})
				);
				break;
			}
		}
	}
}

// deno run --allow-net server.ts
