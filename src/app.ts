import express, { Express } from 'express'
import http, { Server } from 'http'
import { Context } from './types/serverTypes'
import { graphql } from './graphql'
import { rest } from './rest'
import { authRest } from './utils/authRest'
import { rateLimit } from './utils/rateLimit'

export const app = {
  run: async (context: Context) => {
    const app: Express = express()
    const httpServer: Server = http.createServer(app)

    app.use(rateLimit(context))

    const graphqlServer = graphql(context, httpServer)
    await graphqlServer.start()

    graphqlServer.applyMiddleware({
      app,
      path: '/graphql',
    })

    app.use(authRest(context))
    const restServer = rest(context)
    app.use('/rest', restServer)

    httpServer.listen({ port: context.port })
  },
}
