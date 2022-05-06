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

		const { headers, method, redirect, url } = request;

		const baseUrl = new URL(url);
		const { pathname } = baseUrl;

		// get param for /hello
		const pattern = new URLPattern({ pathname: "/hello/:name" });
		const parameter = pattern.exec(url); // return 'bob' if /hello/bob
		const name = pattern.exec(url)?.pathname.groups.name;


		const test = pattern.test(url); //return true if pattern matches /hello/:name
		// console.log(test, parameter && parameter.pathname.groups.name);

		switch (pathname) {
			case "/hello": {
				const body = `Your user-agent is:\n\n${
					request.headers.get("user-agent") ?? "Unknown"
				}`;
				respondWith(
					new Response(body, {
						status: 200,
					})
				);

				break;
			};
			case `/hello/${name}`: {
				const body = `Your name is ${name}`;
				respondWith(
					new Response(body, {
						status: 200,
					})
				);
				break;
			};
			case "/echo": {
				let query = baseUrl.searchParams.get("q")
				const body = `Your query string is: ${query}`;
				respondWith(
					new Response(body, {
						status: 200,
					})
				);

				break;
			};

			default: {
				const body = `Broken D:`;
				respondWith(
					new Response(body, {
						status: 200,
					})
				);
				break;
			}
		}
	}
}

// deno run --allow-net server.ts
