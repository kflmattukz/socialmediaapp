import chatView from '../components/chatView'

export default class Chat {
    constructor () {
        this.chatRoot = document.querySelector('#chat-root');
        this.chatBtn = document.querySelector('#chat-btn');
        this.injectHTML();
        this.closeChat = document.querySelector('.close-chat');
        this.chatForm = document.querySelector('#chat-form');
        this.chatField = document.querySelector('#chat-field');
        this.chatMsg = document.querySelector('#chat-msg');
        this.hideChat();
        this.events();
    }

    //EVENTs
    events () {
        this.chatForm.addEventListener('submit' , (e) => {
            e.preventDefault();
            this.sendMsgToServer()
        })
        this.chatBtn.addEventListener('click' , () => { this.hideChat() });
        this.closeChat.addEventListener('click' , () => { this.hideChat() });
    }

    //METHODs
    injectHTML () {
        this.chatRoot.innerHTML = chatView();
    }

    hideChat () {
        if (!this.openedYet) {
            this.openConnection()
            this.chatMsg.focus()
        }
        this.openedYet = true
        this.chatRoot.classList.toggle('hidden');
    }

    openConnection() {
        this.socket = io()
        this.socket.on('chatMsgFromServer' , (data) => {
            this.msgFromServer(data.message)
        })
    }

    sendMsgToServer() {
        this.socket.emit('chatMsgFromBrowser' , { message: this.chatMsg.value })
        this.chatMsg.value = ''
        this.chatMsg.focus()
    }

    msgFromServer(message) {
        this.chatField.insertAdjacentHTML('beforeend' , `
        <div class="chat bg-white text-gray-700 p-2 self-start my-2 rounded-md shadow mr-3">
            ${ message }
        </div>
        `)

    }
}


