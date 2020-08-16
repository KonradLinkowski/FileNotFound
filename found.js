(() => {
  const $path = document.querySelector('#path')
  const $folderView = document.querySelector('#folder-view')
  const $fileView = document.querySelector('#file-view')
  const $imageView = document.querySelector('#image-view')

  const $files = document.querySelector('#files')
  const $image = document.querySelector('#image')
  const $file = document.querySelector('#file')

  const fileTypes = ['folder', 'file', 'image']

  const exts = {
    folder: '',
    file: '.txt',
    image: '.png'
  }

  const hashString = str => str.split('').reduce((hash, char) => (((hash << 5) - hash) + char.charCodeAt(0)) | 0, 0)

  const changeView = view => {
    $folderView.hidden = view !== 'folder'
    $fileView.hidden = view !== 'file'
    $imageView.hidden = view !== 'image'
  }

  const randomString = (random, minLength = 1, maxLength = 15) => {
    const length = Math.floor(random() * (maxLength - minLength)) + minLength
    const start = 'a'.charCodeAt(0)
    const end = 'z'.charCodeAt(0)
    const name = Array(length).fill(0).map(() => String.fromCharCode(Math.floor(random() * (end - start)) + start)).join('')
    return name
  }

  const getFileType = name => {
    const hash = Math.abs(hashString(name))
    const type = fileTypes[hash % 3]
    return type
  }

  const generateFileLink = name => {
    const hash = window.location.hash.slice(1)
    const parts = [...hash.split('/'), name].filter(e => e)
    return '#/' + parts.join('/')
  }

  const createFile = (name, type) => {
    const $file = document.createElement('li')
    $file.classList.add('item')
    const $a = document.createElement('a')
    $a.classList.add('link', type)
    $a.textContent = name + exts[type]
    $file.appendChild($a)
    $a.href = generateFileLink(name)
    return $file
  }

  const renderFolder = files => {
    while ($files.firstChild) {
      $files.removeChild($files.firstChild)
    }

    files.forEach(({ name, type }) => {
      const $f = createFile(name, type)
      $files.appendChild($f)
    })
  }

  const generateFolder = () => {
    const fileCount = Math.abs(hashString(window.location.hash)) % 25 + 10
    const random = new Math.seedrandom(window.location.hash)
    const files = Array(fileCount).fill(0).map(() => {
      const name = randomString(random)
      const type = getFileType(name)
      return { name, type }
    })
    const folders = files.filter(f => f.type === 'folder')
    const notFolders = files.filter(f => f.type !== 'folder')
    
    const sortedFiles = [
      ...folders.sort((a, b) => a.name.localeCompare(b.name)),
      ...notFolders.sort((a, b) => a.name.localeCompare(b.name))
    ]

    renderFolder(sortedFiles)
  }

  const renderFile = text => {
    $file.textContent = text
  }

  const generateFile = name => {
    const hash = Math.abs(hashString(name))

    const random = new Math.seedrandom(hash)

    const wordCount = random() * 500 + 100 | 0
    
    const words = Array(wordCount).fill(0).map(() => randomString(random, 3, 20))

    const text = words.join(' ')

    renderFile(text)
  }

  const renderImage = (src, name) => {
    $image.src = src
    $image.alt = name
  }

  const generateImage = name => {
    const $canvas = document.createElement('canvas')
    $canvas.width = 500
    $canvas.height = 500
    const ctx = $canvas.getContext('2d')

    const hash = Math.abs(hashString(name))
    const random = new Math.seedrandom(hash)

    const figureCount = random() * 30 + 5 | 0

    for (let i = 0; i < figureCount; i += 1) {
      const color = `hsl(${random() * 360 | 0}, ${50}%, ${50}%)`
      ctx.fillStyle = color
      const x = random() * 500 | 0
      const y = random() * 500 | 0
      const w = random() * 50 + 5 | 0
      const h = random() * 50 + 5 | 0
  
      ctx.fillRect(x, y, w, h)
    }

    renderImage($canvas.toDataURL(), name)
  }

  const updatePath = () => {
    const hash = window.location.hash.slice(1)
    if (!hash.match(/^\/[a-z]*(\/[a-z]+)*$/)) {
      window.location.hash = ''
    }

    while ($path.firstChild) {
      $path.removeChild($path.firstChild)
    }

    const parts = hash.split('/')

    if (parts.slice(0, -1).some(part => getFileType(part) !== 'folder')) {
      window.location.hash = ''
      return
    }

    parts.forEach((name, i) => {
      const type = getFileType(name)
      const ext = exts[type] || '/'
      const $a = document.createElement('a')
      const href = '#' + parts.slice(0, i + 1).join('/')
      $a.classList.add('link')
      $a.href = href
      $a.textContent = name + ext
      $path.appendChild($a)
    })
  }

  const onHashChange = () => {
    updatePath()
    const thisFileName = window.location.hash.split('/').slice(-1)[0]
    if (thisFileName === '') {
      generateFolder()
      changeView('folder')
      return
    }

    const thisFileType = getFileType(thisFileName)
    
    const typeMachine = {
      folder: generateFolder,
      file: generateFile,
      image: generateImage
    }

    typeMachine[thisFileType](thisFileName)
    changeView(thisFileType)
  }

  window.addEventListener('hashchange', onHashChange)

  onHashChange()
})()
