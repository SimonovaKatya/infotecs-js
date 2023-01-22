let page = 0
const list = document.getElementById('list')
// const container = document.getElementById('container')
const settings = document.getElementById('settings')
let isDrag = false;

const input = document.createElement('input')
input.value = '10';
input.type = 'number'
input.classList.add('numberPosts')
settings.append(input)

// let sortType = document.querySelector('input[name="sort-type"]:checked').value;
// console.log(sortType)

input.addEventListener('input', () => {
    const list = document.getElementById('list')
    list.innerHTML = null;
    page = 1;
    fetchPosts();
})

list.addEventListener(`dragstart`, (evt) => {
    evt.target.classList.add(`selected`);
    document.querySelectorAll('.object:not(.selected)').forEach(object => object.classList.add('unselected'))

    document.getElementById('popup')?.remove()
    isDrag = true;
})

list.addEventListener(`dragend`, (evt) => {
    evt.target.classList.remove(`selected`);
    isDrag = false;
    document.querySelectorAll('.object').forEach(object => object.classList.remove('unselected'))
});


list.addEventListener(`dragover`, (evt) => {
    evt.preventDefault();

    const activeElement = list.querySelector(`.selected`);
    const currentElement = evt.target;

    const isMoveable = activeElement !== currentElement &&
        currentElement.classList.contains(`object`);

    if (!isMoveable) {
        return;
    }

    const nextElement = (currentElement === activeElement.nextElementSibling) ?
        currentElement.nextElementSibling :
        currentElement;

    list.insertBefore(activeElement, nextElement);
});

async function fetchPosts() {
    const loader = document.createElement('div');
    loader.innerText = 'загрузка...'
    document.body.append(loader)
    //
    // const response = await axios.get(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${input.value}`)
    // // const response = await axios.get(`https://dummyjson.com/products/1=${page}&_limit=${input.value}`)
    const response = await axios.get(`https://dummyjson.com/products?skip=${page * input.value}&limit=${input.value}`)

    console.log(response)
    response.data.products.forEach(item => {
        let object = document.createElement('li')
        object.classList.add('object')
        object.innerText = `${item.title} (price: ${item.price}, rating: ${item.rating})`
        object.draggable = true;

        listenShownPopup(object, item);

        list.append(object)
    })
    console.log(list)
    page += 1

    document.getElementById('totalCount').innerText = document.querySelectorAll('.object').length.toString()
    loader.remove()
}

fetchPosts()

function listenShownPopup(object, item) {
    const popup = document.createElement('div')
    popup.innerText = `Заголовок:\n${item.title}\n\nКонтент:\n${item.body}`;
    popup.id = 'popup';
    popup.classList.add('popup')

    object.addEventListener('mouseover', () => {
        if (isDrag) return
        object.append(popup)
    })

    object.addEventListener('mouseout', () => {
        popup.remove()
    })
}
