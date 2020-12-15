export default class Menu {
  static items = []

  static addItem = ({ icon, text, func, keyboardNav = false }) => {
    const html = `
      <div class="icon">${icon}</div>
      <div class="text${keyboardNav ? ' with-keyboard-nav' : ''}">
        ${text.replace(/[<>]/g, '')}
      </div>
    `
    Menu.append(new MenuItem({ html, text, func }))
  }

  static addDivider = ({ text }) => {
    Menu.append(new MenuItem({ html: `<div class="divider">${text}</div>` }))
  }

  static append = (item) => {
    document.body.appendChild(item.element)
    Menu.items.push(item)
  }

  static showLoader = () => {
    Menu.clear()
    Menu.append(loaderItem)
  }

  static showLogin = (client) => {
    Menu.clear()
    Menu.append(buildLoginFormItem(client))
  }

  static clear = () => {
    Menu.items.forEach(item => item.element.remove())
    Menu.items = []
  }

  static showError = (error) => {
    if (/401/.test(error)) return // handled by onAuthRequired
    Menu.clear()
    Menu.addItem({
      icon: '😕',
      text: 'N/A (click for details)',
      func: () => alert(error.message || error),
    })
  }

  static setupHotkeys = ({ withHints }) => {
    if (withHints) {
      document.body.classList.add('with-keyboard-hints')
    }
    (new MenuHotkeyListener()).listen()
  }

  static get actionItems() {
    return this.items.filter((item) => !!item.func)
  }
}

class MenuItem {
  constructor({ html, text = '', func = null }) {
    this.element = document.createElement('div')
    Object.assign(this.element, { className: 'item', innerHTML: html })
    this.func = func
    func && this.element.addEventListener('click', func)
    func && this.element.classList.add('action')
    this.text = text
  }

  static SELECTED_CLASS = 'selected'

  select = () =>
    this.element.classList.add(MenuItem.SELECTED_CLASS)

  deselect = () =>
    this.element.classList.remove(MenuItem.SELECTED_CLASS)

  get selected() {
    return this.element.classList.contains(MenuItem.SELECTED_CLASS)
  }

  trigger = () =>
    this.element.click()
}

class MenuHotkeyListener {
  listen = () =>
    document.addEventListener('keydown', this.onKeyDown)

  onKeyDown = (event) =>
    this.selectItemByTabOrArrowKey(event) ||
    this.triggerCurrentlySelectedItem(event) ||
    this.triggerAnyItemByFirstLetter(event)

  selectItemByTabOrArrowKey = ({ keyCode, shiftKey }) => {
    if (keyCode === 9 || keyCode === 38 || keyCode === 40) { // tab/up/down
      const [item, index] = this.currentlySelectedItem
      item && item.deselect()

      let direction
      if (keyCode === 9) direction = shiftKey ? -1 : 1
      else direction = keyCode === 38 ? -1 : 1

      let nextIndex = index + direction
      if (nextIndex < 0) nextIndex = Menu.actionItems.length - 1
      else if (nextIndex >= Menu.actionItems.length) nextIndex = 0

      Menu.actionItems[nextIndex].select()
      return true
    }
  }

  triggerCurrentlySelectedItem = ({ keyCode }) => {
    if (keyCode === 13 || keyCode === 32) { // space/enter
      const [item, _] = this.currentlySelectedItem
      item && item.trigger()
      return true
    }
  }

  triggerAnyItemByFirstLetter = ({ keyCode }) => {
    const item = Menu.actionItems.find(item =>
      item.text.toLowerCase().charCodeAt(0) === keyCode ||
      item.text.toUpperCase().charCodeAt(0) === keyCode
    )
    item && item.trigger()
    return !!item
  }

  get currentlySelectedItem() {
    for (let i = 0; i < Menu.actionItems.length; i++) {
      const item = Menu.actionItems[i]
      if (item.selected) return [item, i]
    }
    return [null, -1]
  }
}

const loaderItem = new MenuItem({
  html: `<div class="loader">
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
  </div>`
})

const buildLoginFormItem = (client) => {
  const html = `<form>
    <label>User</label>
    <input name='username' type='text'></input>
    <label>Password</label>
    <input name='password' type='password'></input>
    <button type='submit'>Log in</button>
    <p>
      No account yet?
      <a target='_blank' href="${client.signUpURL()}">Create one!</a>
    </p>
  </form>`

  const item = new MenuItem({ html })

  item.element.querySelector('form').onsubmit = (event) => {
    event.preventDefault()
    Menu.showLoader()
    const username = item.element.querySelector('[name=username]').value
    const password = item.element.querySelector('[name=password]').value
    client.login({ username, password })
      .then(() => document.location.reload())
      .catch(() => alert('Wrong!'))
  }

  return item
}
