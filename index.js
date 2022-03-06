import handleSubmit from './handlers/handleSubmit.js'
//IMPORTS
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const showUserButton = document.querySelector(".showUserButton");
const newTask = document.querySelector(".addTaskButton");

export const modal = document.querySelector("#formModal");
const inputFormCreate = modal.querySelector(".input_form");
const editTaskFormButton = modal.querySelector(".formEditBtn");
const modalEdit = document.querySelector("#editModal");
const newTaskCloseButton = modal.querySelector(".closeBtn");
const createTaskButton = modal.querySelector(".submitBtn");
const editTaskButton = modalEdit.querySelector(".editBtn");
const inputFormEdit = modalEdit.querySelector(".input_form");
let inputs;
let inputsEditForm;
const assignedToDropDownOptions = modal.querySelector("#assigned_to");
const assignedToDropDownOptionsEdit = modalEdit.querySelector("#assigned_to");

const showUserButton = document.querySelector('.showUserButton');
const showTaskButton = document.querySelector('.showTaskButton');

const highPriorityList = document.querySelector(".high_priority_list");
const midPriorityList = document.querySelector(".mid_priority_list");
const lowPriorityList = document.querySelector(".low_priority_list");

 const draggables = document.querySelectorAll('.draggable')
 const containers = document.querySelectorAll('.container')



//------------------------------------------------------------------------------

//###################
//*****
//STATES
let userData =[];
export var allTask = {};
//###################



//*****
//fetch user data
async function fetchUserData() {
  var myHeaders = new Headers();
  myHeaders.append("AuthToken", "UrM4YHgb1FcqEf1tuKwmAMMX5MxFZ12a");

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };

  const response = await fetch(
    "https://devza.com/tests/tasks/listusers",
    requestOptions
  );

  const data = await response.json();

  //!!operations to be carried out when user_data_is_fetched
  // A) Store in local State
  console.log(data.users);
  userData = [...data.users]
  // B) add userName to DropDownOptionOF createTask(deligate to)
  let html = userData.map((el, i) => {
    console.log(el);
    return `<option value=${el.id}>${el.name}</option>`
  }).join('');
  assignedToDropDownOptions.innerHTML = html;
  assignedToDropDownOptionsEdit.innerHTML = html;
  // C) Also, Now catch all the inputs
  inputs = modal.querySelectorAll(".input");
  console.log(inputs);

  inputsEditForm = modalEdit.querySelectorAll(".input");
  console.log(inputsEditForm);






  return data;
}














//*****
//modal open when create-new-task clicked
function handleNewTaskClick(event) {
  console.log("Here");
  modal.classList.remove("hidden");
  modal.classList.add("show");
  // createTaskButton.removeAttribute("disabled");
  // editTaskButton.setAttribute("disabled", true);



}

//*****
//modal open when edit-task clicked
function handleEditTaskClick(target ) {
  console.log("Here");

  modalEdit.classList.remove("hidden");
  modalEdit.classList.add("show");
  // createTaskButton.setAttribute("disabled", true);
  // editTaskButton.removeAttribute("disabled");

  inputFormEdit.setAttribute("data-taskid", `${target .id}`)


}

//*****
//on modal...close-click
function handleTaskCloseClick(event) {
  modal.classList.remove("show");
  modal.classList.add("hidden");
}
//*****
//Edit Modal Close
function handleEditCloseClick(event) {
  modalEdit.classList.remove("show");
  modalEdit.classList.add("hidden");
}

//*****
//on modal...close-click
function handleTaskCreateClick(event) {
  event.preventDefault();
  console.log(event.target);

  handleSubmit(event);
  event.target.disabled = true;


  // A) API FUnction [[++++]]
  async function handleSubmit(event) {

    event.preventDefault();
    console.log(event.target);

    const myHeaders = new Headers();
    myHeaders.append("AuthToken", "UrM4YHgb1FcqEf1tuKwmAMMX5MxFZ12a");

    const createData = new URLSearchParams();

    for(const pair of new FormData(event.target)){
      createData.append(pair[0], pair[1])
    }


    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: createData,
      redirect: 'follow'
    }

    const request = await fetch('https://devza.com/tests/tasks/create', requestOptions);

    const data = await request.json();

    console.log(data);//here you get id...store id to operate delete as well

    //storing in local state
    let taskObj = {
      // taskid:"",
    };

    console.log(inputs);

    inputs.forEach((item, i) => {
      console.log(item);
      return taskObj[`${item.name}`] = item.value;

    });
    const id = data.taskid
    taskObj.taskid = id;
    userData.forEach((el, i) => {
      if(el.id === taskObj.assigned_to) {
        taskObj.assigned_name = el.name;
      }
    })
    // console.log(taskObj.assigned_name);
    // taskObj.assigned_name = id;

    fetchFromTaskList();

    // B) Store in Local
    const oldTask = allTask;

    allTask = {...oldTask, [`${id}`]:{...taskObj}};

    console.log(taskObj);
    console.log(allTask);

    inputs.forEach((item, i) => {
      // console.log(item);
      item.value = "";

    });


    // c) display
    displayTask(allTask);

    // d) clear the form
    handleTaskCloseClick();
  }





}

//*****
//task list fetch function
async function fetchFromTaskList() {

  const response = await fetch('https://devza.com/tests/tasks/list', {
    method: 'get',
    headers :{
      AuthToken: "UrM4YHgb1FcqEf1tuKwmAMMX5MxFZ12a",
    }
  });

  const data = await response.json();

  console.log(data);

  return data;
}


function displayTask(allTask) {
  console.log("@--+>", allTask);
  const list_of_all_id= [...Object.keys(allTask)]
  const corresponding_id_data = [...Object.values(allTask)]

  let highPriorityListDisplay = [];
  let midPriorityListDisplay = [];
  let lowPriorityListDisplay = [];

  list_of_all_id.forEach((idValue, i) => {
    console.log(corresponding_id_data[i].priority);
    if(corresponding_id_data[i].priority == 1){
      console.log(corresponding_id_data[i]);
      highPriorityListDisplay.push(corresponding_id_data[i]);
    }
    if(corresponding_id_data[i].priority == 2){
      console.log(corresponding_id_data[i]);
      midPriorityListDisplay.push(corresponding_id_data[i]);
    }
    if(corresponding_id_data[i].priority == 3){
      console.log(corresponding_id_data[i]);
      lowPriorityListDisplay.push(corresponding_id_data[i]);
    }
  });

  const whatToLoop = [highPriorityListDisplay, midPriorityListDisplay, lowPriorityListDisplay];
  console.log(whatToLoop);
  whatToLoop.forEach((priority, i) => {
    console.log(priority);


    let html = "";

      html += priority.map((item, i) => {
        console.log("---->" +item);
        return (`
          <li id="one" draggable="true">
                  <span class="task_text">${item.message}</span>

                  <span class="assigned_to">
                    <span class="user_logo">
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/843/843315.png"
                        alt="user"
                        />
                        </span>
                        <span class="user_name">${item.assigned_name}</span>
                        </span>

                        <span class="assigned_to">
                        <span class="clock_logo">
                        <img
                        src="https://img.icons8.com/external-xnimrodx-lineal-color-xnimrodx/344/external-time-online-marketing-xnimrodx-lineal-color-xnimrodx.png"
                        alt="clock"
                        />
                        </span>
                        <span class="user_time">${item.due_date} </span>
                        </span>

                        <span class="assigned_to_functions">
                        <button name="edit" id=${item.taskid} class="edit_logo">
                        <img
                        src="https://img.icons8.com/flat-round/344/available-updates--v1.png"
                        alt="edit"
                        name="edit" id=${item.taskid}
                        />
                        </button>

                        <br />
                        <br />

                        <button name="close" id=${item.taskid} class="delete_logo">
                        <img
                        src="https://img.icons8.com/plasticine/344/filled-trash.png"
                        alt="delete"
                        name="close" id=${item.taskid}
                        />
                        </button>
                        </span>

                        <br />
                        </li>
                        <div></div>
                        `)
                      }).join("");


                      if(i==0 ){
                        // && highPriorityList !== null){
                        console.log('why is it so?');
                        highPriorityList.innerHTML = html
                      };
                      if(i==1 ){
                        // && midPriorityList !== null){
                        midPriorityList.innerHTML = html
                      };
                      if(i==2 ){
                        // && lowPriorityList !== null){
                        lowPriorityList.innerHTML = html
                      };
  });

}





// //*****
// //Drag function
// draggables.forEach((draggable, i) => {
//
//   draggable.addEventListener('dragstart', () => {
//     draggable.classList.add('dragging')
//   })
//
//   draggable.addEventListener('dragend', () => {
//     draggable.classList.add('dragging')
//   })
// });
//
// containers.forEach((container, i) => {
//   container.addEventListener('dragover', e => {
//     e.preventDefault();
//     const afterElement = getDragAfterElement(container, e.clientY);
//     const draggable = highPriorityList.querySelector('.dragging')
//     // if (afterElement == null) {
//     //   console.log(draggable);
//     //   container.appendChild(draggable)
//     // } else {
//       container.insertBefore(draggable, afterElement);
//     // }
//   })
// });
//
// function getDragAfterElement(container, y) {
//   const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')]
//
//   return draggableElements.reduce((closest, child) => {
//     const box = child.getBoundingClientRect();
//     const offset = y - box.top -box.height / 2
//
//     if(offset < 0 && offset > closest.offset) {
//       return { offset: offset, element: child}
//     } else {
//       return closest;
//     }
//   }, {offset : Number.NEGATIVE_INFINITY }).element
// }
//
//







//*****
//deleteTask function
async function deleteTask(taskid){
  // B) Local Function

  console.log('** ', taskid);
  delete allTask[`${taskid}`];
  highPriorityList.innerHTML = "";
  displayTask(allTask);

  // A) API FUnction
  const myHeaders = new Headers();
  myHeaders.append("AuthToken", "UrM4YHgb1FcqEf1tuKwmAMMX5MxFZ12a");

  const formdata = new FormData();
  formdata.append("taskid",`${taskid}`)

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: formdata,
    redirect: 'follow'
  }

  const request = await fetch('https://devza.com/tests/tasks/delete', requestOptions);

  const data = await request.json();

  console.log(data)

}

//*****
//Edit Task open Modal
async function editTask(target) {
  console.log(target);
  const corresponding_id_data = [...Object.values(allTask)]

  //loop allTask..find id
  corresponding_id_data.forEach((currentValue, i) => {

    if(currentValue.taskid === target.id){
      // console.log(item);
      const preSetValues = [...Object.values(currentValue)]
      inputsEditForm.forEach((itemm, i) => {
        // console.log(currentValue);
        return itemm.value = preSetValues[i];

      });

      handleEditTaskClick(target);


    }

  });

  // editTaskClick()


  // present another form with preset value of that id...
  //
  // and edit

  // var myHeaders = new Headers();
  // myHeaders.append("AuthToken", "UrM4YHgb1FcqEf1tuKwmAMMX5MxFZ12a");
  //
  // const createData = new URLSearchParams();
  //
  // for(const pair of new FormData(inputForm)){
  //   createData.append(pair[0], pair[1])
  // }
  //
  // createData.append('taskid', `${target.id}`)
  //
  // var requestOptions = {
  //   method: 'POST',
  //   headers: myHeaders,
  //   body: createData,
  //   redirect: 'follow'
  // };
  //
  // fetch("https://devza.com/tests/tasks/update", requestOptions)
  //   .then(response => response.text())
  //   .then(result => console.log(result))
  //   .catch(error => console.log('error', error));
  //
  // inputs.forEach((item, i) => {
  //   // console.log(item);
  //   item.value = "";
  //
  // });

}

//*****
// Edit task
 async function handleEditTaskSubmit(event) {
   console.log("Here as well");
   event.preventDefault();


   var myHeaders = new Headers();
   myHeaders.append("AuthToken", "UrM4YHgb1FcqEf1tuKwmAMMX5MxFZ12a");

   const createData = new URLSearchParams();

   for(const pair of new FormData(event.target)){
     createData.append(pair[0], pair[1])
   }

   createData.append('taskid', `${event.target.dataset.taskid}`)
   console.log(event.target.dataset.taskid);

   var requestOptions = {
     method: 'POST',
     headers: myHeaders,
     body: createData,
     redirect: 'follow'
   };

   const request = await fetch('https://devza.com/tests/tasks/update', requestOptions);

   const data = await request.json();

   console.log(data);



   let taskObj = {
     // taskid:"",
   };

   console.log(inputsEditForm);

   inputsEditForm.forEach((item, i) => {
     console.log(item);
     return taskObj[`${item.name}`] = item.value;

   });
   const id = data.taskid
   taskObj.taskid = id;
   userData.forEach((el, i) => {
     if(el.id === taskObj.assigned_to) {
       taskObj.assigned_name = el.name;
     }
   })
   // console.log(taskObj.assigned_name);
   // taskObj.assigned_name = id;

   fetchFromTaskList();

   // B) Store in Local
   const oldTask = allTask;

   allTask = {...oldTask, [`${id}`]:{...taskObj}};

   console.log(taskObj);
   console.log(allTask);

   inputsEditForm.forEach((item, i) => {
     // console.log(item);
     item.value = "";

   });


   // c) display
   displayTask(allTask);

   // d) clear the form
   handleEditCloseClick();

 }


//******
//Handle Delete Button on card
function handleClickOn_H_L(event) {
  console.log(event.target.name);
  if(event.target.name === "close"){
    console.log(event.target);

    deleteTask(event.target.id);
  }
  else if (event.target.name === "edit") {

    console.log(event.target.matches('form'));
    editTask(event.target)
  }
}


//*****
//show list of users
function handleshowUserButtonClick() {

}
handleshowTaskButtonClick



//------------------------------------------------------------------------------
fetchUserData();
newTask.addEventListener("click", handleNewTaskClick);


newTaskCloseButton.addEventListener("click", handleTaskCloseClick);

inputFormCreate.addEventListener("submit", handleTaskCreateClick);
inputFormEdit.addEventListener("submit", handleEditTaskSubmit);

highPriorityList.addEventListener("click", handleClickOn_H_L);
midPriorityList.addEventListener("click", handleClickOn_H_L);
lowPriorityList.addEventListener("click", handleClickOn_H_L);

showUserButton.addEventListener('click', handleshowUserButtonClick}
showTaskButton.addEventListener('click', handleshowTaskButtonClick}
//-------------------------------------
