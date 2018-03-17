const input = document.getElementById('input-content')
const tweet = document.getElementById('tweet')
const confirm = document.getElementById('confirm-image')

input.addEventListener('change', e => {
  const content = e.target.value || ''
  const text = encodeURIComponent('断固コーギー')

  // this code run only with route '/'.
  const url = `${window.location.href.split('?')[0]}words/${encodeURIComponent(
    encodeURIComponent(content)
  )}`
  const imageURL = `${
    window.location.href.split('?')[0]
  }images/${encodeURIComponent(encodeURIComponent(content))}`
    .replace(/\(/g, '%2528')
    .replace(/\)/g, '%2529')
    .replace(/{/g, '%257B')
    .replace(/}/g, '%257D')

  if (content) {
    tweet.setAttribute(
      'href',
      `https://twitter.com/intent/tweet?url=${url}&hashtags=${text}`
    )
    confirm.setAttribute('href', imageURL)
    confirm.setAttribute('style', 'display:inline;')
  } else {
    confirm.setAttribute('style', 'display:none;')
  }
})
