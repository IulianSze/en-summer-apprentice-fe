import { useStyle } from "./styles";
import { addLoader, removeLoader } from "./src/loader";
import { createEvent, getImageUrl,createOrder,addEvents,createRadioForEvents,getCheckedRadioValue} from "./functions";
import { fetchEvents, fetchOrders,getTicketCategoryId} from "./fetches";
import { updateOrder } from "./modify-and-delete-orders";


// Navigate to a specific URL
function navigateTo(url) {
  history.pushState(null, null, url);
  renderContent(url);
}
// HTML templates
function getHomePageTemplate() {
  return `
   <div id="content" >
      <img src="./src/assets/Endava.png" alt="summer">
      <div class="flex flex-col items-center">
        <div class="w-80">
        <h1>Explore Events </h1>
        <div class="filters flex flex-col">
        <input type="text" id="filter-name" placeholder="Filter by name" class="px-4 mt-4 mb-4 py-2 border" />
        </div>
        <button id="filter-button" class="filter-btn px-4 py-2 text-red rounded-lg">Filter </button>
        <button id="clear-button" class="filter-btn px-4 py-2 text-red rounded-lg">Clear selection </button>
        </div>
      <div class="events flex items-center justify-center flex-wrap">
      </div>
    </div>
  `;
}


function getOrdersPageTemplate() {
  return `
  
  <h1 class="text-2xl mb-4 mt-8 text-center">Purchased Tickets</h1>
  <div id="content">
<div class="purchases ml-6 mr-6">
  <div class="bg-white px-4 py- gap-x-4 grid grid-cols-6 font-bold text-center">
    <span class="flex-1 p-4 bg-gray-200">Name</span>
    <span class="flex-1 p-4 bg-gray-200">Number of tickets</span>
    <span class="flex-1 p-4 bg-gray-200">Description</span>
    <span class="flex-1 p-4 bg-gray-200">Date</span>
    <span class="flex-1 p-4 bg-gray-200">Price</span>
    <span class="flex-1 p-4 bg-gray-200">Edit</span>
  </div>
  </div>
  </div>
 
  `;
}

function setupNavigationEvents() {
  const navLinks = document.querySelectorAll('nav a');  
  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const href = link.getAttribute('href');
      navigateTo(href);
    });
  });
}

function setupMobileMenuEvent() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

function setupPopstateEvent() {
  window.addEventListener('popstate', () => {
    const currentUrl = window.location.pathname;
    renderContent(currentUrl);
  });
}

function setupInitialPage() {
  const initialUrl = window.location.pathname;
  renderContent(initialUrl);
}

async function renderHomePage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML= getHomePageTemplate();

  const selectedVenue = getCheckedRadioValue('venue');
  const selectedEventType = getCheckedRadioValue('event-type');
  

  addLoader();
    const eventsData = await fetchEvents(selectedVenue,selectedEventType);
    setTimeout(() => {
    removeLoader();
  }, 200);
   
  setupFilterEvents(eventsData);
  createRadioForEvents(eventsData);
  eventsData.forEach(event=>{
    const selectorId = event.eventID+'s';
    const nbOfTicketsId=event.eventID+'n';
    createEvent(event,selectorId,nbOfTicketsId);
  
  const buy_btn = document.getElementById(`${event.eventID}`);
  buy_btn.addEventListener("click", () => {

    var e = document.getElementById(selectorId);
    var ticketDescription = e.value;
    console.log(ticketDescription);
    var ticketCategoryID=getTicketCategoryId(event.eventID,ticketDescription);

    ticketCategoryID.then(function(result){
      console.log("result"+result);
      
    
    var nbOfTickets=document.getElementById(nbOfTicketsId).value;

      fetch('http://localhost:8080/api/postorders', 
      {
        mode:'cors',
        method: 'POST',
        headers : { 'Content-type' : 'application/json', Accept : 'application/json'},
        
      body: JSON.stringify({
        ticketCategoryId: result,
        numberOfTickets: nbOfTickets
      }),
      });
  });
  
  toastr.success("Order placed successfully!");
  })
  });
  const filterButton = document.getElementById('filter-button');
    filterButton.addEventListener('click',()=>{
      applyFilters();
    });
  
  const clearButton=document.getElementById('clear-button');
  clearButton.addEventListener('click',()=>{
    deselectRadioButtonsOfType('venue');
    deselectRadioButtonsOfType('event-type');
  addEvents(eventsData);
  });

  
}
function deselectRadioButtonsOfType(type) {
  const radioButtons = document.querySelectorAll(`input[type="radio"][name="${type}"]`);
  
  let foundChecked = false;
  radioButtons.forEach(radio => {
    if (radio.checked) {
      foundChecked = true;
      radio.checked = false;
    }
  });
  
  // If no option is currently checked, check the first one to maintain the radio button behavior
  if (!foundChecked && radioButtons.length > 0) {
    radioButtons[0].checked = true;
  }
}
async function renderOrdersPage(categories) {
  
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML=getOrdersPageTemplate();
  addLoader();
  const orders = await fetchOrders();
    setTimeout(() => {
    removeLoader();
   }, 200);
  
  orders.forEach(order=>{
    createOrder(order,mainContentDiv);
    updateOrder(order);
    
});

}

// Render content based on URL
function renderContent(url) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = '';

  if (url === '/') {
    renderHomePage();
  } else if (url === '/orders') {
    renderOrdersPage()
  }
}

async function applyFilters(){

    const selectedVenue = getCheckedRadioValue('venue');
    const selectedEventType = getCheckedRadioValue('event-type');

    const listOfEvents= await fetchEvents(selectedVenue,selectedEventType);
    addEvents(listOfEvents);
  
}

function liveSearch(events){
  const filterInput=document.querySelector('#filter-name');

  if(filterInput){
    const searchValue = filterInput.value;

    if(searchValue !== undefined){
      const filteredEvents = events.filter((event)=>
      event.eventName.toLowerCase().includes(searchValue.toLowerCase())
      );
       addEvents(filteredEvents);
    }
  }
}

function setupFilterEvents(events){
  const nameFilterInput = document.querySelector('#filter-name');

  if(nameFilterInput){
    const filterInterval=500;
    nameFilterInput.addEventListener('keyup',()=>{
      setTimeout(liveSearch(events),filterInterval);
    });
  }
}


// Call the setup functions
setupNavigationEvents();
setupMobileMenuEvent();
setupPopstateEvent();
setupInitialPage();

