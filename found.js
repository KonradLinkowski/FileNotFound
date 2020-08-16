(() => {
  const $path = document.querySelector('#path')
  const $files = document.querySelector('#files')

  const hashString = str => str.split('').reduce((hash, char) => (((hash << 5) - hash) + char.charCodeAt(0)) | 0, 0)

  const updatePath = () => {
    const hash = window.location.hash.slice(1)
    if (!hash.match(/^\/[a-z]*(\/[a-z]+)*$/)) {
      window.location.hash = ''
    }

    while ($path.firstChild) {
      $path.removeChild($path.firstChild)
    }

    const parts = hash.split('/')
    parts.forEach((name, i) => {
      const $a = document.createElement('a')
      const href = '#' + parts.slice(0, i + 1).join('/')
      $a.classList.add('link')
      $a.href = href
      $a.textContent = name + '/'
      $path.appendChild($a)
    })
  }

  const generateFileName = random => {
    const length = Math.floor(random() * 15) + 1
    const start = 'a'.charCodeAt(0)
    const end = 'z'.charCodeAt(0)
    const name = Array(length).fill(0).map(() => String.fromCharCode(Math.floor(random() * (end - start)) + start)).join('')
    return name
  }

  const generateFileLink = name => {
    const hash = window.location.hash.slice(1)
    const parts = [...hash.split('/'), name].filter(e => e)
    return '#/' + parts.join('/')
  }

  const createFile = name => {
    const $file = document.createElement('li')
    $file.classList.add('item')
    const $a = document.createElement('a')
    $a.classList.add('link', 'folder')
    $a.textContent = name
    $a.href = generateFileLink(name)
    $file.appendChild($a)
    return $file
  }

  const renderFiles = files => {
    while ($files.firstChild) {
      $files.removeChild($files.firstChild)
    }

    files.forEach(file => {
      const $f = createFile(file)
      $files.appendChild($f)
    })
  }

  const onHashChange = () => {
    updatePath()
    const fileCount = Math.abs(hashString(window.location.hash)) % 25 + 10
    const random = new Math.seedrandom(window.location.hash)
    const files = Array(fileCount).fill(0).map(() => generateFileName(random))
    renderFiles(files) 
  }

  window.addEventListener('hashchange', onHashChange)

  onHashChange()
})()
