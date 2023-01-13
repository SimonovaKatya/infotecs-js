let page = 1

const input = document.createElement('input')
input.value = '10';
input.type = 'number'
document.body.append(input)

input.addEventListener('input', () => {
    const list = document.getElementById('list')
    list.innerHTML = null;
    page = 1;
    fetchPosts();
})


async function fetchPosts() {
    const loader = document.createElement('div');
    loader.innerText = 'загрузка...'
    document.body.append(loader)

    const list = document.getElementById('list')
    const response = await axios.get(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${input.value}`)
    console.log(response.data)
    response.data.forEach(item => {
        let object = document.createElement('li')
        object.classList.add('object')
        object.innerText = item.title

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

    // const div = document.createElement('div')
    // div.innerHTML = 'Я ДИВ!!!!!!'
    // popup.append(div)

    object.addEventListener('mouseover', () => {
        object.append(popup)
    })

    object.addEventListener('mouseout', () => {
        popup.remove()
    })
}


// const item = document.querySelector('.item')
// const placeholders = document.querySelectorAll('.placeholder')
//
// item.addEventListener('dragstart', dragstart)
// item.addEventListener('dragend', dragend)
//
// for(const placeholder of placeholders){
//     placeholder.addEventListener('dragover', dragover) /*над плейсхоледром куда мы можем поместить*/
//     placeholder.addEventListener('dragenter', dragenter)/*заходим на территорию*/
//     placeholder.addEventListener('dragleave', dragleave)/*перенесли, но вышли отуда*/
//     placeholder.addEventListener('drop', drop)/*когда отпустили*/
// }
//
// function dragstart(event){
//     console.log('drag start', event.target);
//     // event.target.classList.add('hold')
//     // setTimeout(()=> event.target.classList.add('hide'), 0 )
// }
//
// function dragend(event){
//     console.log('drag end');
//     event.target.classList.remove('hold')
//     event.target.classList.remove('hide')
// }
//
// function dragover(event){
//     event.preventDefault()
//     console.log('dragover');
// }
//
// function dragenter(event){
//     event.target.classList.add('hovered')
//     console.log('dragenter');
// }
//
// function dragleave(event){
//     event.target.classList.remove('hovered')
//     console.log('dragleave');
// }
//
// function drop(event){
//     event.target.classList.remove('hovered')
//     event.target.append(item)
//     console.log('drop');
// }

