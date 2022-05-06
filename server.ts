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
	for await (const requestEvent of httpConn) {
		// The native HTTP server uses the web standard `Request` and `Response`
		// objects.

		// const pattern = new URLPattern({
		// 	baseURL: "http://localhost:8080/",
		// 	pathname: "/hello/:name",
		// });
		const { headers, method, redirect, url } = requestEvent.request;
		const baseUrl = new URL(url);
		console.log("PATH NAME: ", baseUrl.pathname);
		const { pathname } = baseUrl;

		switch (pathname) {
			case "/hello":
				const body = `Your user-agent is:\n\n${
					requestEvent.request.headers.get("user-agent") ?? "Unknown"
				}`;
				requestEvent.respondWith(
					new Response(body, {
						status: 200,
					})
				);

				break;

			default:
				const body2 = `Broken D:`;
				requestEvent.respondWith(
					new Response(body2, {
						status: 200,
					})
				);
				break;
		}
	}
}

// deno run --allow-net https://server.ts
