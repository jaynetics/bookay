// *******************************************************************
// EDIT THIS ONLY IN <repo-root>/shared, then use sync-code.sh to sync
// *******************************************************************

export class ApiClient {
  constructor({
    historySize = 0,
    onAuthRequired = () => console.log('Auth required'),
    serviceURL,
    suggestSize = 0,
    timeoutSeconds = null,
  }) {
    this.historySize = historySize
    this.onAuthRequired = onAuthRequired
    this.serviceURL = serviceURL && serviceURL.replace(/[/ ]+$/, '')
    this.suggestSize = suggestSize
    this.timeoutMs = (parseInt(timeoutSeconds) || 20) * 1000
  }

  // actions

  login({ username, password }) {
    const body = JSON.stringify({ username, password })

    return new Promise((resolve, reject) => {
      this.fetch(this.loginURL(), { method: 'POST', body })
        .then(({ sessionId }) => {
          this.sessionId = sessionId
          resolve({ sessionId })
        })
        .catch(reject)
    })
  }

  logout() {
    this.sessionId = ''
    return this.fetch(this.logoutURL(), { method: 'DELETE' })
  }

  check({ url, historySize = this.historySize, suggestSize = this.suggestSize }) {
    return this.fetch(this.checkURL({ urlToCheck: url, historySize, suggestSize }))
  }

  create({ type = 'url', name, folderId = null, url = '' }) {
    const body = JSON.stringify({ type, name, folderId, url })
    return this.fetch(this.createItemURL(), { method: 'POST', body })
  }

  update({ id, name = undefined, folderId = undefined, url = undefined }) {
    const body = JSON.stringify({ name, folderId, url })
    return this.fetch(this.itemURL({ id }), { method: 'PUT', body })
  }

  move({ id, intoFolderId }) {
    const body = JSON.stringify({ folderId: intoFolderId })
    return this.fetch(this.itemURL({ id }), { method: 'PUT', body })
  }

  remove({ id }) {
    return this.fetch(this.itemURL({ id }), { method: 'DELETE' })
  }

  dissolve({ id }) {
    return this.fetch(this.dissolveURL({ id }), { method: 'POST' })
  }

  get({ id }) {
    return this.fetch(this.itemURL({ id }))
  }

  getAll({ filter = null, sort = null }) {
    return this.fetch(this.itemsURL({ filter, sort }))
  }

  createImport({ file, folderId }) {
    return new Promise((resolve, reject) => {
      this.convertFileToBase64({ file })
        .then((base64) => {
          const body = JSON.stringify({ file: { base64 } })
          const url = this.createImportURL({ folderId })
          this.fetch(url, { method: 'POST', body }).then(resolve).catch(reject)
        })
        .catch(reject)
    })
  }

  createUser({ username, password, ownPassword }) {
    const body = JSON.stringify({ username, password, ownPassword })
    return this.fetch(this.createUserURL(), { method: 'POST', body })
  }

  getStats() {
    return this.fetch(this.getStatsURL())
  }

  ping() {
    return this.check({ url: 'ping', historySize: 0, suggestSize: 0 })
  }

  fetch(url, { method = 'GET', body = undefined } = {}) {
    return new Promise((resolve, reject) => {
      const timeoutError = new Error(`Timed out after ${this.timeoutMs}ms`)
      const timeout = setTimeout(() => reject(timeoutError), this.timeoutMs)

      fetch(url, { method, body, headers: this.headers })
        .then(res => {
          clearTimeout(timeout)
          if (res && res.ok) return res.json()
          if (res.status === 401) this.onAuthRequired()
          reject(new Error(`${res.status} ${res.statusText} for ${method} ${url}`))
        })
        .then(obj => resolve(obj))
        .catch(err => {
          clearTimeout(timeout)
          reject(err)
        })
    })
  }

  streamBookmarkHealth(callback) {
    this.streamJSONL({ url: this.healthCheckURL(), callback })
  }

  streamJSONL({ url, callback }) {
    fetch(url, { headers: this.headers })
      .then(async (response) => {
        const reader = response.body.getReader()
        const decoder = new TextDecoder('utf-8')
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const lines = decoder.decode(value).replace(/\n$/, '').split("\n")
          for (let i = 0; i < lines.length; i++) {
            const object = JSON.parse(lines[i])
            if (!(await callback(object))) reader.cancel()
          }
        }
      })
  }

  // API URLs

  loginURL() {
    return `${this.serviceURL}/api/login`
  }

  logoutURL() {
    return `${this.serviceURL}/api/logout`
  }

  checkURL({ urlToCheck, historySize, suggestSize }) {
    return `${this.serviceURL}/api/check/${encodeURIComponent(urlToCheck)}` +
      this.toQuery({ historySize, suggestSize })
  }

  itemURL({ id }) {
    return `${this.serviceURL}/api/items/${id}`
  }

  createItemURL() {
    return `${this.serviceURL}/api/items`
  }

  itemsURL({ filter = null, sort = null }) {
    return `${this.serviceURL}/api/items${this.toQuery({ filter, sort })}`
  }

  dissolveURL({ id }) {
    return `${this.serviceURL}/api/items/${id}/dissolve`
  }

  createImportURL({ folderId }) {
    return `${this.serviceURL}/api/imports${this.toQuery({ folderId })}`
  }

  exportURL({ folderId }) {
    return `${this.serviceURL}/api/export${this.toQuery({ folderId })}`
  }

  createUserURL() {
    return `${this.serviceURL}/api/users`
  }

  getStatsURL() {
    return `${this.serviceURL}/api/stats`
  }

  healthCheckURL() {
    return `${this.serviceURL}/api/health_check`
  }

  // webapp URLs

  dashboardURL() {
    return `${this.serviceURL}`
  }

  newItemURL({ url, name }) {
    return `${this.serviceURL}/#/items/create${this.toQuery({ url, name })}`
  }

  editItemURL({ id }) {
    return `${this.serviceURL}/#/items/${id}`
  }

  signUpURL() {
    return `${this.serviceURL}/#/users/create`
  }

  // helpers

  get headers() {
    return new Headers({
      'content-type': 'application/json',
      'x-session-id': this.sessionId,
    })
  }

  get sessionId() {
    return localStorage.getItem(this.sessionIdKey)
  }

  set sessionId(value) {
    localStorage.setItem(this.sessionIdKey, value)
  }

  get sessionIdKey() {
    return 'bookay_session_id'
  }

  toQuery({ ...obj }) {
    return '?' + Object.entries(obj).map(([k, v]) => {
      const string = v && typeof v === 'object' ? JSON.stringify(v) : v || ''
      return `${k}=${encodeURIComponent(string)}`
    }).join('&')
  }

  convertFileToBase64({ file }) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }
}
