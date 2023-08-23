export function getImageUrl(nameEvent){
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

export function createEvent(event, selectorId, nbOfTicketsId){
  
    const ticketCategoryList = event.ticketCategory;
    const categoriesOptions = ticketCategoryList.map(tk=>`<option>${tk.description}</option>`
    );
    const ticketPrice= ticketCategoryList.map(tk=>`<option>${tk.description}-${tk.price} lei</option>`);

    
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
      <p class="description text-gray-700">${ticketPrice.join('\n')}</p>
      
      <div class="inputs">
      <select id="${selectorId}" name="ticketType">
      ${categoriesOptions.join('\n')}
      </select>
      <input id="${nbOfTicketsId}" type="number">
      <button class="buy_ticket" type="button" id="${event.eventID}">Buy now</button>
      <div>
    
    </div>
  `;

  eventCard.innerHTML = contentMarkup;
  const eventsContainer = document.querySelector('.events');
  eventsContainer.appendChild(eventCard);
}


export function createOrder(order,mainContentDiv){
  const orderRow = document.createElement('div');
  orderRow.classList.add('flex-1');
  let optionSelector =" ";
  if (order.ticketCategory=="VIP"){
   optionSelector = "Standard";}
  else{
     optionSelector = "VIP";
  }
const contentMarkup =` <div class="purchases ml-6 mr-6">
<div class="bg-white px-4 py- gap-x-4 grid grid-cols-6 font-bold">
<span class="flex-1 text-center">${order.eventName}</span>
<span class="flex-1 text-center"> 
<input class="flex-1 text-center bg-white" type="text" id="${order.orderId+'number'}" name="Number of tickets" placeholder="${order.numberOfTickets}" disabled/>
</span>
<span class="flex-1 text-center">
<select id="${order.orderId+'s'}" class="flex-1 text-center bg-white" disabled />

   <option>${order.ticketCategory}</option>

   <option>${optionSelector}</option>

</select>
</span>
<span class="flex-1 text-center">${order.orderedAt.slice(0,10)}</span>
<span class="flex-1 text-center">${order.totalPrice}</span>
<div class="flex-1 text-center">
<button id="${order.orderId+'u'}" class="update btn-for-orders" type="button"> <i class="fa-regular fa-pen-to-square"></i> </button>
<button id="${order.orderId+'confirm'}" class="confirm btn-for-orders" type="button" style="visibility:hidden;"><i class="fa-solid fa-check-double"></i> </button>
<button id="${order.orderId+'cancel'}" class="cancel btn-for-orders" type="button" style="visibility:hidden"><i class="fa-solid fa-rectangle-xmark"></i> </button>
<button id="${order.orderId+'d'}" class="delete btn-for-orders" type="button"> <i class="fa-solid fa-trash"></i> </button>
</div>

</div> 
`;
orderRow.innerHTML = contentMarkup;
mainContentDiv.appendChild(orderRow);
}

export const addEvents = (events) =>{
  const eventsDiv = document.querySelector('.events');
  eventsDiv.innerHTML="No events available";

  if(events.length){
    eventsDiv.innerHTML = '';
    events.forEach(eventElement => {
      createEvent(eventElement);
    });
  }
}

function createRadio(type, value) {
  const radioContainer = document.createElement('div');
  const radio = document.createElement('input');

  radio.type = 'radio'; 
  radio.name = type;   
  radio.id = `filter-by-${type}-${value}`;
  radio.value = value;

  radio.addEventListener('change',()=>handleRadioFilter());

  const label = document.createElement('label');
  label.setAttribute('for', `filter-by-${type}-${value}`);
  label.textContent = value;

  radioContainer.appendChild(radio);
  radioContainer.appendChild(label);

  return radioContainer;
}
function handleRadioFilter() {
  const selectedVenue = getCheckedRadioValue('venue');
  const selectedEventType = getCheckedRadioValue('event-type');
}
export function getCheckedRadioValue(groupName) {
  const checkedRadio = document.querySelector(`input[type="radio"][name="${groupName}"]:checked`);
  console.log(groupName);
  if (checkedRadio) {
    return checkedRadio.value;
  }
  return null;
}

export function createRadioForEvents(events) {
  const venuesSet= new Set(events.map((event)=>event.venue.location));
  const eventTypeSet=new Set(events.map((event)=>event.eventType));

  const filtersContainer=document.querySelector('.filters');
  const allFiltersContainer=document.createElement('div');

  const venuesFilterDiv=setupHtmlForVenue(
    filtersContainer,
    allFiltersContainer
  );
  venuesSet.forEach((venue)=>{
  const checkboxContainer=createRadio('venue',venue);

  venuesFilterDiv.appendChild(checkboxContainer);
  });

  const eventTypeFilterDiv= setupHtmlForEventType(filtersContainer,allFiltersContainer);
  eventTypeSet.forEach((eventType)=>{
  const checkboxContainerEvent=createRadio('event-type',eventType);

  eventTypeFilterDiv.appendChild(checkboxContainerEvent);
  });

  allFiltersContainer.appendChild(venuesFilterDiv);
  allFiltersContainer.appendChild(eventTypeFilterDiv);
  filtersContainer.appendChild(allFiltersContainer);
}

function setupHtmlForVenue(filtersContainer, allFiltersContainer) {
  const venueFilterDiv = document.createElement('div');
  venueFilterDiv.classList.add('column');
  
  const venueLabel = document.createElement('label');
  venueLabel.textContent = 'Venue:';
  venueFilterDiv.appendChild(venueLabel);

  allFiltersContainer.appendChild(venueFilterDiv);
  return venueFilterDiv;
}
function setupHtmlForEventType(filtersContainer,allFiltersContainer) {
  const eventTypeFilterDiv = document.createElement('div');
  eventTypeFilterDiv.classList.add('column');

  const eventTypeLabel = document.createElement('label');
  eventTypeLabel.textContent = 'Event Type:';
  eventTypeFilterDiv.appendChild(eventTypeLabel);

  allFiltersContainer.appendChild(eventTypeFilterDiv);
  return eventTypeFilterDiv;
}

