// import {allTask} from '.././index.js'

const modal = document.querySelector('.input_modal_container');
const form = modal.querySelector("form");
console.log(modal);
const inputs = form.querySelectorAll('input');
const outPutMid = document.querySelector(".mid_priority");


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
    return taskObj[`${item.name}`] = item.value;

  });
  const id = data.taskid
  taskObj.taskid = id;

  const oldTask = allTask;

  allTask = {...oldTask, [`${id}`]:{...taskObj}};

  console.log(taskObj);
  console.log(allTask);

  // displayTask(allTask);


}


export default handleSubmit;
