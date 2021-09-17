const overlaySearch = () => {
    return `
    <div class="overlay-search w-screen h-screen bg-gray-600 bg-opacity-40 absolute inset-0 z-10 hidden">
        
    <button class="close-overlay absolute text-white bg-gray-700 rounded-full p-1 top-3 right-3 hover:bg-gray-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
    </button>

    <div class="bg-gray-100 relative flex justify-center">
        <div class="group w-1/2 mx-auto ring ring-blue-500 absolute top-10 flex items-center border rounded-lg border-blue-500 border-opacity-50">
            <span class="inline-block bg-gray-700 py-1 px-2 rounded-tl-lg rounded-bl-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-200 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
            </span>
            <input type="text" class="px-2 p-1 flex-grow text-2xl text-gray-700 rounded-tr-lg rounded-br-lg outline-none group-focus:text-gray-800" id="input-search">
        </div>

        <div class="result absolute top-20 mt-5 w-3/4">
        
        </div>

        <div>
            <div style="border-top-color:transparent" class="search-loading absolute top-40 right-1/2 w-16 h-16 border-4 border-gray-600 border-solid rounded-full animate-spin hidden">
            </div>
        </div>

    </div>
</div>
    `
}
module.exports = overlaySearch;