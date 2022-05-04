/**
    Goal: create a api server in deno

    - No imports (including std of Deno)
        - Deno.listen, Deno.serveHttp(2 ways), Response API, request API, url API, url pattern API
        - async iterator/async generator consumer: for await(const_of _) {}
      (get->curl, postman use curl)
    1. [x] GET /hello -> will return the user-agent(a identifier what system user is using)
    2. [] GET /hello/:name -> will return hello {name} (using: url pattern API,request API)
    3. [] GET /echo?q=hi_monkey -> wil return the q param is: 'hi_monkey' ()
    4. [] GET /redirect -> redirect the user to the home page '/' with a 302 status code (using: Response API)
    5. [] POST /login -> will take a {name: 'bob', password: 'hello'}.
          If the name is 'alice' and the password is 'redqueen' return 200 ok, otherwise 403 forbidden
    6. [] DELETE /todo/:id -> will take a body {name: 'bob', password: 'hello'}.
          If the name is 'alice' and the password is 'redqueen' and the id is 42 -> return 200 ok, otherwise 403
    7. [] All other non-matching routes will return a 404 'Not Found'
 */

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
