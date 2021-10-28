import axios from 'axios';
import overlaySearch from '../components/overlaySearch';
import searchResult from '../components/searchResult';

export default class Search {
    constructor () {
        this.injectHTML();
        this.searchBtn = document.querySelector('.search');
        this.overlaySearch = document.querySelector('.overlay-search');
        this.inputSearch = document.querySelector('#input-search');
        this.btnCloseOverlay = document.querySelector('.close-overlay');
        this.searchLoading = document.querySelector('.search-loading');
        this.resultRoot = document.querySelector('.result');
        this.previousValue = '';
        this.timerWaiting;
        this._csrf = document.querySelector('[name="_csrf"]').value
        this.event();
    }



    //EVENT
    event () {
        //Event click open overlay
        this.searchBtn.addEventListener('click', () => this.openOverlay());
        //Event click close overlay
        this.btnCloseOverlay.addEventListener('click', () => this.closeOverlay())
        //
        this.inputSearch.addEventListener('keydown' , () => this.searchHandler())
    }

    //METHOD
    // Open overlay
    openOverlay() {
        this.overlaySearch.classList.remove('hidden');
        this.inputSearch.focus();
    }
    // Close overlay
    closeOverlay() {
         this.overlaySearch.classList.add('hidden');
         this.inputSearch.value = '';
         this.hideLoadingAnimate();
         this.resultRoot = '';
    }

    showLoadingAnimate() {
        this.searchLoading.classList.remove('hidden');
    }

    hideLoadingAnimate() {
        this.searchLoading.classList.add('hidden');
    }

    searchHandler () {
        let value = this.inputSearch.value;
        clearTimeout(this.timerWaiting);
        this.showLoadingAnimate();
        if (value == "") {
            this.hideLoadingAnimate();
            this.resultRoot.innerHTML = '';
        }

        if (value != "" && value != this.previousValue) {
            this.timerWaiting = setTimeout( () => this.showResult(), 750)
        }

        this.previousValue = value;
    }

    showResult() {
        this.resultRoot.innerHTML = ''
        axios.post('/search' , { searchTerm: this.inputSearch.value , _csrf : this._csrf })
        .then( response => {
            this.hideLoadingAnimate();
            this.resultRoot.insertAdjacentHTML('beforeend', searchResult(response.data));
        }).catch((err) => {
            this.hideLoadingAnimate()
            console.log('search failed '+ err)
        })
    }

    injectHTML () {
        document.body.insertAdjacentHTML('beforebegin' , overlaySearch());
    }
}