const list = document.getElementById('list')
const input = document.getElementById('number-products')
const totalCount = document.getElementById('total-count')
const loader = document.getElementById('loader');

let page = 0
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


list.addEventListener(`dragover`, (event) => {
    event.preventDefault();

    const activeElement = list.querySelector(`.selected`);
    const currentElement = event.target;

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

//получение элементов
async function fetchProducts() {
    beforeProductsQuery();
    await pruductsQuery()
    afterProductsQuery();
}

// получение первых элементов
fetchProducts()

// инициализация продукта
function setupProduct(item) {
    let object = document.createElement('li')
    object.classList.add('object')
    object.innerText = `${item.title} (price: ${item.price}, rating: ${item.rating})`
    object.draggable = true;
    setupPopup(object, item);
    list.append(object);
}

// настройка всплывающей панели
function setupPopup(object, item) {
    const popup = createPopup(object, item);
    listenShownPopup(object, popup);
}

// создание всплывающей панели
function createPopup(object, item) {
    const popup = document.createElement('div')
    popup.innerText = `Наименование:\n${item.title}\n\nОписание:\n${item.description}`;
    popup.id = 'popup';
    popup.classList.add('popup')
    return popup;
}

// навешивание на панель обработчиков событий
function listenShownPopup(object, popup) {
    object.addEventListener('mouseover', () => {
        if (isDrag) return
        object.append(popup)
    })

    object.addEventListener('mouseout', () => {
        popup.remove()
    })
}

// показать лоудер
function showLoader() {
    loader.style.display = 'block';
}

// скрыть лоудер
function hideLoader() {
    loader.style.display = 'none';
}

// действия перед запросом на сервер
function beforeProductsQuery() {
    showLoader()
}

//получение элементов с api
async function pruductsQuery() {
    const response = await axios.get(`https://dummyjson.com/products?skip=${page * input.value}&limit=${input.value}`)
    response.data.products.forEach(setupProduct.bind(null))
}

//действия после запроса на сервер
function afterProductsQuery() {
    page += 1
    totalCount.innerText = document.querySelectorAll('.object').length.toString()
    hideLoader()
}

