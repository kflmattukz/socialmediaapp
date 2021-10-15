import Search from "./modules/search";
import Chat from "./modules/chat";
import registrationForm from "./modules/registrationForm"

if ( document.querySelector('#registration-form')) { new registrationForm() }
if ( document.querySelector('#chat-root') ) { new Chat() }
if ( document.querySelector('.search') ) { new Search() }