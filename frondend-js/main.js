import Search from "./modules/search";
import Chat from "./modules/chat";

if ( document.querySelector('#chat-root') ) { new Chat() }
if ( document.querySelector('.search') ) { new Search() }