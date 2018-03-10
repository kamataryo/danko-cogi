const fastify = require('fastify')()
const ejs = require('ejs')
const { promisify } = require('util')
const readFile = promisify(require('fs').readFile)
const path = require('path')
const url = require('url')
const { registerFont, createCanvas, loadImage } = require('canvas')

const {
  COGI_FACEBOOK_APP_ID,
  COGI_TWITTER_ID,
  COGI_HOME_URL,
  COGI_PORT,
  COGI_FONT_PATH
} = process.env

registerFont(COGI_FONT_PATH, { family: 'sourceHanCodeJP' })

fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'assets'),
  prefix: '/assets/'
})

const render = protest => (req, rep) => {
  const components = decodeURIComponent(req.params['*']).split('/')
  components.shift() // eliminate '^/'
  const content = components.join('/')
  if (content.length > 255) {
    rep
      .header('Content-Type', 'text/plane')
      .code(400)
      .send('文字長すぎ')
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

const renderOGP = (req, rep) => {
  const uricomponents = req.params['*'].split('.')
  if (uricomponents[uricomponents.length - 1] === 'png') {
    uricomponents.pop() // eliminate '.png'
  }
  const content = decodeURIComponent(uricomponents.join('.'))

  if (content.length > 255) {
    rep
      .header('Content-Type', 'text/plane')
      .code(400)
      .send('文字長すぎ')
  }

  const canvas = createCanvas(1200, 630)
  const ctx = canvas.getContext('2d')
  loadImage(path.join(__dirname, 'assets/ogp.png')).then(image => {
    ctx.drawImage(image, 0, 0, 1200, 630)
    ctx.font = '48px "sourceHanCodeJP"'
    ctx.fillText(content, 60, 90)
    ctx.strokeStyle = 'black'

    rep
      .header('Content-Type', 'image/png')
      // .header('Content-Length', base64String.length)
      .send(canvas.toBuffer())
  })
}

readFile(path.join(__dirname, 'templates/protest.html.ejs')).then(file => {
  const protest = file.toString()

  fastify
    .get('/cogi.svg', (req, rep) => rep.sendFile('cogi.svg'))
    .get('/ogp.png', (req, rep) => rep.sendFile('ogp.png'))
    .get('/favicon.ico', (req, rep) => rep.send('favicon.ico'))
    .get('/assets/ogp_*', renderOGP)
    .get('*', render(protest))

  fastify.listen(COGI_PORT || 3000, '127.0.0.1', err => {
    if (err) {
      throw err
    } else {
      console.log(`server listening on ${fastify.server.address().port}`)
    }
  })
})
