const resultList = ({ _id, title, created_at, author }) => {
    let postDate = new Date(created_at)
    return `<div class="bg-white flex items-center gap-3 p-2">
                <img src="https://avatars.dicebear.com/api/initials/${ author.username }.svg" alt="Profile Picture" class="w-8 h-8 rounded-full">
                <div class="text-base font-medium text-gray-600">${ title }</div>
                <div class="text-sm font-regular text-gray-500 flex-grow">post on ${ postDate.getDate() }/${ postDate.getMonth() }/${ postDate.getFullYear() }</div>
                <a href="/post/${ _id }" class="flex items-center text-blue-600 justify-end">
                    <div class="text-xs">
                        Show Post &nbsp;
                    </div>
                    <div class="inline-block">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </div>
                </a>
            </div>`
}

module.exports = resultList;