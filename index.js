const fastify = require('fastify')()
const ejs = require('ejs')
const { promisify } = require('util')
const readFile = promisify(require('fs').readFile)
const path = require('path')
const url = require('url')

const {
  COGI_FACEBOOK_APP_ID,
  COGI_TWITTER_ID,
  COGI_HOME_URL,
  COGI_PORT,
} = process.env

fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'assets'),
  prefix: '/assets/'
})

readFile('./templates/protest.html.ejs').then(file => {
  const protest = file.toString()

  const render = (req, rep) => {
    const content = url.parse(req.params['*']).pathname.split('/')[1]

    if (content.length > 255) {
      rep.header('Content-Type', 'text/plane').code(400).send('文字長すぎ')
    }

    rep.header('Content-Type', 'text/html').send(
      ejs.render(protest, {
        content,
        COGI_FACEBOOK_APP_ID,
        COGI_TWITTER_ID,
        COGI_HOME_URL
      })
    )
  }

  fastify
    .get('/cogi.svg', (req, rep) => rep.sendFile('cogi.svg'))
    .get('/cogi.png', (req, rep) => rep.sendFile('cogi.png'))
    .get('*', render)

  fastify.listen(COGI_PORT || 3000, '127.0.0.1', err => {
    if (err) {
      throw err
    } else {
      console.log(`server listening on ${fastify.server.address().port}`)
    }
  })
})
