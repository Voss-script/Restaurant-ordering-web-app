import { menuArray } from "./data.js"

const mainContent = document.getElementById('main-content')
const menuContainer = document.getElementById('menu-container')
const modal = document.getElementById('modal')
const paymentForm = document.getElementById('payment-form')
const basket = document.getElementById('basket') 

let allItemsInOrder = []

document.addEventListener('click', e => {
    if (e.target.dataset.add) {
        basket.style.display = 'flex'
        basket.style.flexDirection = 'column'
        addToOrder(e.target.dataset.add) 
    } else if (e.target.dataset.remove) {
        removeFromOrder(e.target.dataset.remove)
    } else if (e.target.id === 'complete-order-btn') {
        e.preventDefault()
        modal.style.display = 'block'
        mainContent.style.opacity = '0.5'
    } else if (e.target.id === 'modal-close-btn') {
        modal.style.display = 'none'
        mainContent.style.opacity = '1'
    }
})

paymentForm.addEventListener('submit', e => {
    e.preventDefault()
    modal.style.display = 'none'
    mainContent.style.opacity = '1'
    const paymentFormData = new FormData(paymentForm)
    const fullName = paymentFormData.get('full-name')
    thanksMessage(fullName)
})

menuContainer.innerHTML = menuArray.map( menuItem => {
    return `<div class="menu-item">
                <div class="left">
                    <img src="${menuItem.image}" alt="" class="item-images">
                </div>
                <div>
                    <h2>${menuItem.name}</h2>
                    <p class="small">${menuItem.ingredients.join(', ')}</p>
                    <p class="price">$${menuItem.price}</p>
                </div>
                <div class="add-btn">
                    <img src="assets/add-btn.png" alt="" data-add="${menuItem.id}" class="btn-images">
                </div>
            </div>`
}).join('')

function addToOrder(menuItemId) {
    const ItemToAdd = menuArray.find( item => item.id === Number(menuItemId))
    if (ItemToAdd) {
        allItemsInOrder.push(ItemToAdd)
        renderBasket(allItemsInOrder)
    } else {
        console.error('Item not found')
    }
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    })
}

function renderBasket(itemsInOrder) {
    if (itemsInOrder.length === 0) {
        document.getElementById('order-el').innerHTML = '<p>Your basket is empty.</p>'
        return
    }

    let basketHtml = ''
    itemsInOrder.forEach((item) => {
        basketHtml += `
            <div class="order-item-el">
                <div class="left">
                    <h4>${item.name}</h4>
                    <p class="remove" data-remove="${item.id}">remove</p>
                </div>
                <p class="price">$${item.price}</p>
            </div>`
    })

    document.getElementById('order-el').innerHTML = basketHtml
    calculateTotalPrice()
}

function calculateTotalPrice() {
    const totalPrice = allItemsInOrder
        .map( item => item.price)
        .reduce((total, currentElement) => total + currentElement, 0)
    renderTotalPrice(totalPrice)
}

function renderTotalPrice(totalPrice) {
    document.getElementById('total-price-el').innerHTML = `
        <p>Total price:</p>
        <p class="price">$${totalPrice}</p>`
}

function removeFromOrder(menuItemId) {
    const itemToRemove = allItemsInOrder.find(item => item.id === Number(menuItemId)) 
    if (itemToRemove) {
        const indexOfItemToRemove = allItemsInOrder.indexOf(itemToRemove)
        if (indexOfItemToRemove !== -1) {
            allItemsInOrder.splice(indexOfItemToRemove, 1)
        }
    } else {
        console.error('Item not found') 
    }

    if (allItemsInOrder.length === 0) {
        document.getElementById('basket').style.display = 'none'
    } else {
        renderBasket(allItemsInOrder)
    }
}

function thanksMessage(fullName) {
    document.getElementById('basket').innerHTML = `
        <div class="thank-you-message-container">
            <p class="thank-you-message">Thanks, ${fullName}! Your order is on its way!</p>
        </div>`
}