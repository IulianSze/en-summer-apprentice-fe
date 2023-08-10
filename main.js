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
      <div class="events flex items-center justify-center flex-wrap">
      </div>
    </div>
  `;
}

function getOrdersPageTemplate() {
  return `
  <div></div>
    <div id="content" class="hidden">
    <h1 class="text-2xl mb-4 mt-8 text-center">Purchased Tickets</h1>
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
async function fetchEvents(){
  const response = await fetch('http://localhost:8080/api/events', {mode:'cors'});
  const data = await response.json();
  return data;
}

async function getTicketCategoryId(eventId,ticketDescription){
  
  const response = await fetch(`http://localhost:8080/api/ticketCategory/${eventId}/${ticketDescription}`,{mode:'cors'});
  
  const data = await response.json();
  return data.ticketCategoryID;
}

async function renderHomePage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML=getHomePageTemplate();

  const eventsData = await fetchEvents();
  eventsData.forEach(event=>{
    const selectorId = event.eventID+'s';
    const nbOfTicketsId=event.eventID+'n';
    
    
  // Create the event card element
  const eventCard = document.createElement('div');
  eventCard.classList.add('event-card'); 
  // Create the event content markup
  var ImgUrl=getImageUrl(event.eventName);
  const contentMarkup = `
    <header>
      <h2 class="event-title text-2xl font-bold">${event.eventName}</h2>
    </header>
    <div class="event-card-content">
    <div class="event-card-image">
      <img class="event-image" src="${ImgUrl}"> 
      </div>
      <div class="event-card-data"
      <alt="${event.eventName}"  w-full height-200 rounded object-cover mb-4">
      <p class="description text-gray-700">${event.eventDescription}</p>
      <div class="inputs">
      <select id="${selectorId}" name="ticketType">
      <option value="Standard">Standard</option>
     <option value="VIP">VIP</option>
      </select>
      <input id="${nbOfTicketsId}" type="number">
      <button class="buy_ticket" type="button" id="${event.eventID}">Buy now</button>
      <div>
    
    </div>
  `;

  eventCard.innerHTML = contentMarkup;
  const eventsContainer = document.querySelector('.events');
  // Append the event card to the events container
  eventsContainer.appendChild(eventCard);
  const buy_btn = document.getElementById(`${event.eventID}`);
  console.log(buy_btn);
 
 

  buy_btn.addEventListener("click", () => {

    console.log(event.eventID);
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
  })
  });
  
}

function renderOrdersPage(categories) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getOrdersPageTemplate();
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

 function getImageUrl(nameEvent){
  var imgUrl;
  if (nameEvent=="Electric Castle"){
    imgUrl="https://cdn.knd.ro/media/521/2861/1713/20331525/1/cand-are-loc-electric-castle-2023-vezi-unde-se-tine-cel-mai-electrizant-festival-al-verii-1.jpg"
   }
  if(nameEvent=="Untold")
    imgUrl="https://funkytravel.ro/wp-content/uploads/2021/08/untold-.jpg"
  if(nameEvent=="Meci de fotbal")
    imgUrl="https://imgresizer.eurosport.com/unsafe/1200x0/filters:format(jpeg)/origin-imgresizer.eurosport.com/2019/09/18/2679033-55402970-2560-1440.jpg"
  if(nameEvent=="Wine festival")
   imgUrl="https://images.squarespace-cdn.com/content/v1/5640ee33e4b0c7ff8f6fc584/1506512313090-H5EA2LYS4KYQE3D65SNX/shutterstock_391495360.jpg?format=2500w"
   if(nameEvent=="Danseaza pentru sanatate")
   imgUrl="https://www.oradesibiu.ro/wp-content/uploads/2016/07/balet-1.jpg"
  return imgUrl;
 }

// Call the setup functions
setupNavigationEvents();
setupMobileMenuEvent();
setupPopstateEvent();
setupInitialPage();
