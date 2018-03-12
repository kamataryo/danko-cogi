const input = document.getElementById('input-content')
const tweet = document.getElementById('tweet')

input.addEventListener('change', e => {
  const text = encodeURIComponent('断固コーギー')

  // this code run only with route '/'.
  const url = `${window.location.href.split('?')[0]}words/${encodeURIComponent(
    encodeURIComponent(e.target.value || '')
  )}`
    .replace(/\(/g, '%2528')
    .replace(/\)/g, '%2529')
    .replace(/{/g, '%257B')
    .replace(/}/g, '%257D')

  tweet.setAttribute(
    'href',
    `https://twitter.com/intent/tweet?url=${url}&hashtags=${text}`
  )
})
