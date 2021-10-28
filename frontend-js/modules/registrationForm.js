import axios from "axios"

export default class registrationForm {
    constructor() {
        this.formSignup = document.querySelector('#registration-form');
        this.inputFields = document.querySelectorAll('#registration-form .input-field')
        this.username = document.querySelector('#usernameReg')
        this.username.previousValue = ""
        this.email = document.querySelector('#emailReg')
        this.email.previousValue = ""
        this.password = document.querySelector('#passwordReg')
        this.password.previousValue = ""
        this.username.isUnique = false
        this.email.isUnique = false
        this._csrf = document.querySelector('[name="_csrf"]').value
        this.errorMsg()
        this.event();
    }

    //EVENTS
    event() {
        this.formSignup.addEventListener('submit' , e => {
            e.preventDefault()
            this.formSubmitHandler()
        })
        this.username.addEventListener('keyup' , () => this.isDifferent(this.username , this.usernameHandler))
        this.email.addEventListener('keyup' , () => this.isDifferent(this.email , this.emailHandler))
        this.password.addEventListener('keyup' , () => this.isDifferent(this.password , this.passwordHandler))

        //BLUER EVENT
        this.username.addEventListener('blur' , () => this.isDifferent(this.username , this.usernameHandler))
        this.email.addEventListener('blur' , () => this.isDifferent(this.email , this.emailHandler))
        this.password.addEventListener('blur' , () => this.isDifferent(this.password , this.passwordHandler))
    }

    //METHODS
    formSubmitHandler() {
        this.usernameValidateImmedietly()
        this.usernameValidateWait()
        this.emailValidateWait()
        this.passwordValidateImmedietly()
        this.passwordValidateWait()

        if (this.username.isUnique && 
            !this.username.errors &&
            this.email.isUnique &&
            !this.email.errors &&
            !this.password.errors) {
                this.formSignup.submit()
            }
    }

    isDifferent(el, handler) {
        if (el.previousValue != el.value) {
            handler.call(this)
        }
        el.previousValue = el.value;
    }

    emailHandler() {
        this.email.errors = false
        if (this.email.timer) { clearTimeout(this.email.timer) }
        this.email.timer = setTimeout( () => this.emailValidateWait(this.email), 800 )
    }

    emailValidateWait() {
        if (!/^\S+@\S+$/.test(this.email.value)) {
            this.showError(this.email , 'please input a valid email address');
        }

        if ( !this.email.errors ) {
            // this.hideError(this.email)
            axios.post('/isEmailExist' , { email: this.email.value , _csrf : this._csrf } )
            .then( responses => {
                if ( responses.data ) {
                    this.showError(this.email , 'email already been used , please try another email')
                    this.email.isUnique = false
                } else {
                    this.email.isUnique = true
                    this.hideError(this.email)
                }
            } )
            .catch( () => {
                console.log('something went wrong , please try again later');
            })
        }
    }

    usernameHandler() {
        this.username.errors = false
        this.usernameValidateImmedietly(this.username)
        if (this.username.timer) { clearTimeout(this.username.timer) }
        this.username.timer = setTimeout( () => this.usernameValidateWait(this.username), 800 )
    }

    passwordHandler() {
        this.password.errors = false
        this.passwordValidateImmedietly(this.password)
        if (this.password.timer) { clearTimeout(this.password.timer) }
        this.password.timer = setTimeout( () => this.passwordValidateWait(this.password), 800 )
    }

    passwordValidateImmedietly() {
        if ( this.password.value.length > 50) {
            this.showError(this.password , "password can't exceed 50 characters.")
        }

        if (!this.password.errors) {
            this.hideError(this.password)
        }
    }

    passwordValidateWait() {
        if ( this.password.value.length < 6 ) {
            this.showError(this.password , "password must be atleast 6 characters.")
        }
    }

    usernameValidateImmedietly(el) {
        if ( this.username.value == "" && !/^([a-zA-Z0-9]+)$/.test(this.username.value)) {
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

        if ( !this.username.errors ) {
            axios.post('/isUserExist_' , { username: this.username.value , _csrf : this._csrf } )
            .then( responses => {
                if ( responses.data ) {
                    console.log(responses.data)
                    this.showError(this.username , 'Username Already taken, please type another username')
                    this.username.isUnique = false
                } else {
                    this.username.isUnique = true
                }
            } ).catch ( () => {
                console.log('some error accure ,please try again later')
            } )
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