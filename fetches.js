export async function fetchEvents(venueLocation, type){
  let response='';
  if(venueLocation ==null && type ==null){
    response = await fetch('http://localhost:8080/api/events', {mode:'cors'});
  }else{
    response = await fetch('http://localhost:8080/api/venueandtype/' + venueLocation +'/' + type, {mode:'cors'});
  }
    
    const data = await response.json();
    return data;
  }

export async function fetchOrders(){
    const response = await fetch('http://192.168.1.187:8081/api/Order/GetAllOrders', {mode:'cors'});
    const data = await response.json();
    console.log(data);
    return data;
  }

export async function getTicketCategoryId(eventId,ticketDescription){
  
    const response = await fetch(`http://localhost:8080/api/ticketCategory/${eventId}/${ticketDescription}`,{mode:'cors'});
    
    const data = await response.json();
    return data.ticketCategoryID;
  }

export async function patchOrder(ordersId, ticketDescription, numberOfTickets){
  await fetch('http://192.168.1.187:8081/api/Order/Patch',{
    mode:'cors',
    method: 'PATCH',
    headers: {
      'Content-Type' : 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      orderId: ordersId,
      ticketCategoryDescription: ticketDescription,
      numberOfTickets: numberOfTickets,
    })
  })
}

export async function deleteOrder(ordersId) {
  try {
    const response = await fetch(`http://192.168.1.187:8081/api/Order/Delete?id=${ordersId}`, {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
        toastr.success(`Order with ID ${ordersId} deleted successfully.`);
    } else {
      toastr.success(`Failed to delete order. Status code: ${response.status}`);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
}