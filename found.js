(() => {
  const $path = document.querySelector('#path')
  const $folderView = document.querySelector('#folder')
  const $fileView = document.querySelector('#file')
  const $imageView = document.querySelector('#image')

  const $files = document.querySelector('#files')
  const fileTypes = ['folder', 'file', 'image']

  const hashString = str => str.split('').reduce((hash, char) => (((hash << 5) - hash) + char.charCodeAt(0)) | 0, 0)

  const changeView = view => {
    $folderView.hidden = view !== 'folder'
    $fileView.hidden = view !== 'file'
    $imageView.hidden = view !== 'image'
  }

  const generateFileName = random => {
    const length = Math.floor(random() * 15) + 1
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
    $a.textContent = name
    $file.appendChild($a)
    $a.href = generateFileLink(name)
    return $file
  }

  const renderFiles = files => {
    while ($files.firstChild) {
      $files.removeChild($files.firstChild)
    }

    files.forEach(({ name, type }) => {
      const $f = createFile(name, type)
      $files.appendChild($f)
    })

    changeView('folder')
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
      const $a = document.createElement('a')
      const href = '#' + parts.slice(0, i + 1).join('/')
      $a.classList.add('link')
      $a.href = href
      $a.textContent = name + '/'
      $path.appendChild($a)
    })
  }

  const generateFolder = () => {
    const fileCount = Math.abs(hashString(window.location.hash)) % 25 + 10
    const random = new Math.seedrandom(window.location.hash)
    const files = Array(fileCount).fill(0).map(() => {
      const name = generateFileName(random)
      const type = getFileType(name)
      return { name, type }
    })
    const folders = files.filter(f => f.type === 'folder')
    const notFolders = files.filter(f => f.type !== 'folder')
    
    const sortedFiles = [
      ...folders.sort((a, b) => a.name.localeCompare(b.name)),
      ...notFolders.sort((a, b) => a.name.localeCompare(b.name))
    ]

    renderFiles(sortedFiles)
  }

  const generateFile = () => {
    changeView('file')
  }

  const generateImage = () => {
    changeView('image')
  }

  const onHashChange = () => {
    updatePath()
    const thisFileName = window.location.hash.split('/').slice(-1)[0]
    if (thisFileName === '') {
      generateFolder()
      return
    }

    const thisFileType = getFileType(thisFileName)
    
    const typeMachine = {
      folder: generateFolder,
      file: generateFile,
      image: generateImage
    }

    typeMachine[thisFileType]()
  }

  window.addEventListener('hashchange', onHashChange)

  onHashChange()
})()
