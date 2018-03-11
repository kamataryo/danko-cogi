const input = document.getElementById('input-content')
const tweet = document.getElementById('tweet')

input.addEventListener('change', e => {
  const text = encodeURIComponent('断固コーギー')
  const url = `${window.location.href.split('?')[0]}words/${encodeURIComponent(
    encodeURIComponent(e.target.value || '')
  )}`
  console.log(url)
  tweet.setAttribute(
    'href',
    `https://twitter.com/intent/tweet?text=${text}&url=${url}`
  )
})
