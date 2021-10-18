const searchResult = (posts) => {
    if (posts.length > 0 ) {
        return `
        <dir class="mx-auto z-20">
        <div class="border border-gray-600 border-opacity-30 rounded-tl-md rounded-tr-md overflow-hidden shadow">
            <div class="bg-blue-500 p-2 ">
                <span class="text-white font-medium text-base tracking-wide ml-3">Search: (${ posts.length > 1 ? `${ posts.length  } items found` : '1 item found' })</span>
            </div>

            
            ${ posts.map( post => {

                const postDate = new Date(post.created_at)
                return `
                <a href="/post/${ post._id }" class="bg-white flex items-center gap-3 p-2 row-result border-b border-gray-300">
                    <img src="https://avatars.dicebear.com/api/initials/${ post.author.username }.svg" alt="Profile Picture" class="w-8 h-8 rounded-full">
                    <div class="text-base font-medium text-gray-600">${ post.title }</div>
                    <div class="text-sm font-regular text-gray-500 flex-grow">post on ${ postDate.getDate() }/${ postDate.getMonth() }/${ postDate.getFullYear() }</div>
                    <div class="flex items-center text-blue-600 justify-end">
                        <div class="text-xs">
                            Show Post &nbsp;
                        </div>
                        <div class="inline-block">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                        </div>
                    </div>
                </a>
                `
            }).join('') }

        </div>
    </dir>
        `
    } else {
        return `<div class="text-center text-3xl font-light text-gray-200">Not found any post on that '<strong>Keyword</strong>'</div>`
    }
}

module.exports = searchResult;