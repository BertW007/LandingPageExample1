import Module from '../module'
import $ from 'jquery'

export default class Email extends Module {
  handleEmailAddress () {
    const adr = this.content.text().trim().toLowerCase().replace('(at)', '@').replace(/\(dot\)/g, '.')
    const contact = $('<span>')
    contact.addClass('.contact-email')
    contact.html(`<a href="mailto:${adr}?subject=${this.subject}">${adr}</a>`)
    this.content.replaceWith(contact)
  }

  init () {
    this.content = this.find('.contact-email')
    this.subject = 'Contact with us'
    this.handleEmailAddress()
  }
}
