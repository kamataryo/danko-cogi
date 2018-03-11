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

const render = template => (req, rep) => {
  const content = req.params['*'] || ''
  if (content.length > 255) {
    rep
      .header('Content-Type', 'text/plane')
      .code(400)
      .send('文字長すぎ')
  }

  const OGP_DESCRIPTION = content || 'コーギーが抗議します。'
  const OGP_URL = COGI_HOME_URL + encodeURIComponent(content)
  const OGP_IMAGE_URL = COGI_HOME_URL + `images/${encodeURIComponent(content)}`
  const COGI_IMAGE_PATH = `/assets/cogi${content.length % 2}.svg`

  rep.header('Content-Type', 'text/html').send(
    ejs.render(template, {
      content,
      COGI_FACEBOOK_APP_ID,
      COGI_TWITTER_ID,
      COGI_HOME_URL,
      OGP_DESCRIPTION,
      OGP_URL,
      OGP_IMAGE_URL,
      COGI_IMAGE_PATH
    })
  )
}

const renderOGP = (req, rep) => {
  const content = req.params['*'] || ''

  if (content.length > 255) {
    rep
      .header('Content-Type', 'text/plane')
      .code(400)
      .send('文字長すぎ')
  }

  const canvas = createCanvas(1200, 630)
  const ctx = canvas.getContext('2d')
  ctx.beginPath()

  loadImage(path.join(__dirname, `assets/cogi${content.length % 2}.svg`)).then(
    image => {
      ctx.fillStyle = 'rgb(248, 248, 248)'
      ctx.fillRect(0, 0, 1200, 630)

      ctx.drawImage(image, 450, 120, 700, 700 * 0.707073719)

      ctx.font = '48px "sourceHanCodeJP"'
      const max = [1120, 490, 390, 340, 340, 390, 480, 510]

      const lines = [...content]
        .reduce(
          (prev, char) => {
            const index = prev.length - 1
            const nextLength = ctx.measureText(prev[index] + char).width
            console.log(nextLength, max[index])
            if (nextLength > max[index]) {
              prev.push(char)
            } else {
              prev[index] += char
            }
            return prev
          },
          ['']
        )
        .filter((_0, index) => index < max.length)

      console.log(lines)

      lines.forEach((line, index) => {
        ctx.fillStyle = 'black'
        ctx.fillText(line, 60, 90 + index * 48 * 1.4)
      })

      const imageBuffer = canvas.toBuffer()
      rep
        .header('Content-Type', 'image/png')
        .header('Content-Length', imageBuffer.length)
        .send(imageBuffer)
    }
  )
}

readFile(path.join(__dirname, 'templates/index.html.ejs')).then(file => {
  const template = file.toString()

  fastify
    .get('/favicon.ico', (req, rep) => rep.send('favicon.ico'))
    .get('/reset.css', (req, rep) => rep.send('reset.css'))
    .get('/style.css', (req, rep) => rep.send('style.css'))
    .get('/script.js', (req, rep) => rep.send('script.js'))
    .get('/cogi0.svg', (req, rep) => rep.sendFile('cogi0.svg'))
    .get('/cogi1.svg', (req, rep) => rep.sendFile('cogi1.svg'))
    .get('/ogp.png', (req, rep) => rep.sendFile('ogp.png'))
    .get('/images/*', renderOGP)
    .get('/words/*', render(template))
    .get('/', render(template))

  fastify.listen(COGI_PORT || 3000, '127.0.0.1', err => {
    if (err) {
      throw err
    } else {
      process.stdout.write(
        `server listening on ${fastify.server.address().port}`
      )
    }
  })
})
