export default class registrationForm {
    constructor() {
        this.inputFields = document.querySelectorAll('#registration-form .input-field')
        this.username = document.querySelector('#usernameReg')
        this.email = document.querySelector('#emailReg')
        this.password = document.querySelector('#passwordReg')
        this.errorMsg()
        this.event();
    }

    //EVENTS
    event() {
        this.username.addEventListener('keyup' , () => this.usernameHandler() )
        this.email.addEventListener('keyup' , () => this.emailHandler() )
    }

    //METHODS
    emailHandler() {
        this.email.errors = false
        this.emailValidateImmedietly(this.email)
        if (this.email.timer) { clearTimeout(this.email.timer) }
        this.email.timer = setTimeout( () => this.emailValidateWait(this.email), 800 )
    }

    emailValidateImmedietly() {
        
    }

    emailValidateWait() {

    }

    usernameHandler() {
        this.username.errors = false
        this.usernameValidateImmedietly(this.username)
        if (this.username.timer) { clearTimeout(this.username.timer) }
        this.username.timer = setTimeout( () => this.usernameValidateWait(this.username), 800 )
    }

    usernameValidateImmedietly(el) {
        if ( this.username.value != "" && !/^([a-zA-Z0-9]+)$/.test(this.username.value)) {
            this.showError(this.username , 'Username can only contains letters & numbers')
        }

        if ( this.username.value.length > 30) {
            this.showError(this.username , "Username can't exced 30 characters")
        }

        if ( !this.username.errors) {
            this.hideError(this.username)
        }
    }

    hideError(el) {
        // const classAdd = ['hidden']
        el.previousElementSibling.classList.add('hidden')
    }

    showError(el , errMsg) {
        
        el.previousElementSibling.innerHTML = errMsg
        el.previousElementSibling.classList.remove('hidden')
        el.previousElementSibling.classList.remove('-translate-y-6')
        el.previousElementSibling.classList.add('transition-all')
        el.errors = true
    }

    usernameValidateWait(el) {
        if ( this.username.value != "" && this.username.value.length < 3 ) {
            this.showError(this.username , "Username must be atleast 3 characters")
        }
    }

    errorMsg() {
        this.inputFields.forEach(  (el) => {
            el.insertAdjacentHTML('beforebegin' , this.alertTemplate())
        })
    }

    alertTemplate() {
        return `
            <div class="bg-red-300 text-red-900 p-2 text-sm rounded-t-md pl-2 -translate-y-6 hidden transform duration-300 translate-x-0"></div>
        `
    }
}