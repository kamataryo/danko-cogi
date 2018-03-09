const fastify = require('fastify')()
const ejs = require('ejs')
const { promisify } = require('util')
const readFile = promisify(require('fs').readFile)
const path = require('path')

fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'assets'),
  prefix: '/assets/'
})

const { COGI_FACEBOOK_APP_ID, COGI_TWITTER_ID, COGI_HOME_URL } = process.env

readFile('./templates/protest.html.ejs').then(file => {
  const protest = file.toString()

  fastify
    .get('/', (req, rep) => {
      const { content } = req.query
      rep.header('Content-Type', 'text/html').send(
        ejs.render(protest, {
          content,
          COGI_FACEBOOK_APP_ID,
          COGI_TWITTER_ID,
          COGI_HOME_URL
        })
      )
    })
    .get('/cogi.svg', (req, rep) => {
      rep.sendFile('cogi.svg')
    })
    .get('/cogi.png', (req, rep) => {
      console.log('aaa')
      rep.sendFile('cogi.png')
    })

  fastify.listen(3000, '127.0.0.1', err => {
    if (err) {
      throw err
    } else {
      console.log(`server listening on ${fastify.server.address().port}`)
    }
  })
})
