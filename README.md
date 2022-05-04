## Goal: create a api server in Deno

- No imports (including std of Deno)
    - Deno.listen, Deno.serveHttp(2 ways), Response API, request API, url API, url pattern API
    - async iterator/async generator consumer: for await(const_of _) {}

- (get->curl, postman use curl)

### Tasks:

1. [x] GET /hello -> will return the user-agent(a identifier what system user is using)
2. [ ] GET /hello/:name -> will return hello {name} (using: url pattern API,request API)
3. [ ] GET /echo?q=hi_monkey -> wil return the q param is: 'hi_monkey' ()
4. [ ] GET /redirect -> redirect the user to the home page '/' with a 302 status code (using: Response API)
5. [ ] POST /login -> will take a {name: 'bob', password: 'hello'}.
        If the name is 'alice' and the password is 'redqueen' return 200 ok, otherwise 403 forbidden
6. [ ] DELETE /todo/:id -> will take a body {name: 'bob', password: 'hello'}.
        If the name is 'alice' and the password is 'redqueen' and the id is 42 -> return 200 ok, otherwise 403
7. [ ] All other non-matching routes will return a 404 'Not Found'
