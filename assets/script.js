const input = document.getElementById('input-content')
const tweet = document.getElementById('tweet')

input.addEventListener('change', e => {
  const title = encodeURIComponent('断固コーギー')
  const url = `${window.location.href.split('?')[0]}words/${encodeURIComponent(
    e.target.value || ''
  )}`

  tweet.setAttribute(
    'href',
    `https://twitter.com/intent/tweet?text=${title}&url=${url}`
  )
})
