import {deleteOrder,patchOrder } from "./fetches";
import { addLoader ,removeLoader} from "./src/loader";
import { fetchOrders } from "./fetches";
export function updateOrder(order){
    const updateBtnId=order.orderId+'u';
    const nbOfTicketsId=order.orderId +'number';
    const selectorId = order.orderId+'s';
    const deleteBtnId = order.orderId+'d';
    const confirmUpdateIdBtn=order.orderId+'confirm'; 
    const cancelBtnId = order.orderId+'cancel';

    const updatebtn= document.getElementById(updateBtnId);
    const deleteBtn=document.getElementById(deleteBtnId);
    const nbOfTicketsField= document.getElementById(nbOfTicketsId);
    const selectorField = document.getElementById(selectorId);
    const confirmField=document.getElementById(confirmUpdateIdBtn);
    const cancelBtn= document.getElementById(cancelBtnId);
    

    

    updatebtn.addEventListener("click", () => {
       updatebtn.style.visibility='hidden';
       nbOfTicketsField.disabled=false;
       nbOfTicketsField.classList="editable";
      
      selectorField.disabled=false;
      selectorField.classList="editable";

    confirmField.style.visibility='visible';
      confirmField.style.margin="auto";
    confirmField.classList="editable ";

    deleteBtn.style.visibility='hidden';

    cancelBtn.style.visibility='visible';
    cancelBtn.style.margin="auto";
    cancelBtn.classList="editable";

    });

    cancelBtn.addEventListener("click",()=>{
        updatebtn.style.visibility='visible';
        updatebtn.classList="btn-for-orders flex-1 text-center"
        updatebtn.style.margin="0";

        nbOfTicketsField.disabled=true;
        nbOfTicketsField.classList="flex-1 text-center bg-white"

        selectorField.disabled=true;
        selectorField.classList="flex-1 text-center bg-white"

        confirmField.style.visibility='hidden';
        

        deleteBtn.style.visibility='visible';
        deleteBtn.style.margin="0";
        
       cancelBtn.style.visibility='hidden';
      
    });

confirmField.addEventListener("click",()=>{
    const ordersId= order.orderId;
    const ticketDescription = selectorField.value;
    const numberOfTickets = nbOfTicketsField.value;
   patchOrder(ordersId,ticketDescription,numberOfTickets);
   updatebtn.style.visibility='visible';
        updatebtn.classList="btn-for-orders flex-1 text-center"
        updatebtn.style.margin="0";

        nbOfTicketsField.disabled=true;
        nbOfTicketsField.classList="flex-1 text-center bg-white"

        selectorField.disabled=true;
        selectorField.classList="flex-1 text-center bg-white"

        confirmField.style.visibility='hidden';
        
        deleteBtn.style.visibility='visible';
        deleteBtn.style.margin="0";
        
        cancelBtn.style.visibility='hidden';
        location.reload();
})

deleteBtn.addEventListener("click",()=>{
  const ordersId= order.orderId;
  const deleteConfirmation = confirm('Are you sure you want to delete the order?');
  if(deleteConfirmation){
  deleteOrder(ordersId);
  location.reload();
    }
})
}