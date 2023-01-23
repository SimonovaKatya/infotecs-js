let page = 0
const list = document.getElementById('list')
const input = document.getElementById('number-products')
const totalCount = document.getElementById('total-count')
let isDrag = false;

// возможность указывать, сколько элементов нужно отобразить в текущем списке
input.addEventListener('input', () => {
    const list = document.getElementById('list')
    list.innerHTML = null;
    page = 1;
    fetchProducts();
})


// перетаскивание элементов внутри списка
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

//получение элементов с api
async function fetchProducts() {
    const loader = document.createElement('div');
    loader.innerText = 'загрузка...'
    document.body.append(loader)
    const response = await axios.get(`https://dummyjson.com/products?skip=${page * input.value}&limit=${input.value}`)
    response.data.products.forEach(item => {
        let object = document.createElement('li')
        object.classList.add('object')
        object.innerText = `${item.title} (price: ${item.price}, rating: ${item.rating})`
        object.draggable = true;
        listenShownPopup(object, item);
        list.append(object)
    })
    page += 1
    totalCount.innerText = document.querySelectorAll('.object').length.toString()
    loader.remove()
}

// вызов функции
fetchProducts()

// создание всплывающей панель
function listenShownPopup(object, item) {
    const popup = document.createElement('div')
    popup.innerText = `Наименование:\n${item.title}\n\nОписание:\n${item.description}`;
    popup.id = 'popup';
    popup.classList.add('popup')

    setOpenCloseListeners(object, popup);
}

// навешивание на панель обработчиков событий
function setOpenCloseListeners(object, popup) {
    object.addEventListener('mouseover', () => {
        if (isDrag) return
        object.append(popup)
    })

    object.addEventListener('mouseout', () => {
        popup.remove()
    })
}

