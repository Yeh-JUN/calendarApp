



// 今天
const today = new Date();
//取得年/月/日
const year = today.getFullYear();
let month = today.getMonth();
const date = today.getDate();

const preMon = document.getElementById('pre-month').addEventListener('click', PreMon);
const nexMon = document.getElementById('next-month').addEventListener('click' , NextMon);
const reset = document.querySelector('.reset-calendar').addEventListener('click' , Reset);

function Init(){
    let dItems = document.querySelector('.day-items');
    dItems.innerHTML = "";

    document.getElementById('year-month').innerText = 
    `${new Date(year,month,1).getFullYear()} - ${new Date(year,month,1).getMonth() +1}`;


    //取得第一天是"禮拜幾" , 禮拜天日"0" , 禮拜一是"1",..禮拜四是"4"
    //是getDay
    let firstDay = new Date(year , month , 1).getDay();

    //取得當月有"幾天"
    //0是上個月最後一天
    let dayOfMonth = new Date(year , month + 1 , 0).getDate();


    let day = 1;
    let rows = Math.ceil((dayOfMonth + firstDay) / 7);
    //此月有幾"周"
    for(let row = 0 ; row < rows; row++){
        
        //一周有7天,由0~6表示
        for(let col = 0; col < 7; col++){
            //建立"單格"
            let dayElm = document.createElement('div');
            dayElm.classList.add('day-item');
            dayElm.setAttribute('data-date' , `${year}-${month + 1}-${day}`)
            //建立單格"日期"
            let span = document.createElement('span');
            span.classList.add('day-num');

            dayElm.appendChild(span);
            if(row == 0 && col < firstDay){
                //上個月
                
            }
            else{
                if(day <= dayOfMonth){
                    span.innerText = day;

                    if(localStorage.getItem(`${year}-${month + 1}-${day}`) != null){
                        let ul = document.createElement('ul');
                        let todoList = JSON.parse(localStorage.getItem(`${year}-${month + 1}-${day}`));
                        todoList.forEach(item=>{
                            let li = document.createElement('li');
                            li.setAttribute("style" , "list-style:none");
                            li.innerText = item.title;
                            li.classList.add('todoList-li');
                            li.setAttribute('data-date' , `${year}-${month + 1}-${day}`);
                        ul.appendChild(li);
                        });
                        dayElm.appendChild(ul);
                    }

                    // dayElm事件
                    dayElm.addEventListener('click' , function(e){
                        let target;
                        let todoListChange = document.getElementById('info-todo-item-change');
                        todoListChange.value = '';
                        if(e.target.localName == "li" || e.target.localName == 'ul'){
                            //點擊li返回父層
                            target = e.target.offsetParent;
                            
                            $('#infoModal').modal('show');
                            updateValueCheck();
                        } else{
                            target = e.target;
                            $('#inputModal').modal('show');
                            let todoItem = document.getElementById('todo-item');
                            todoItem.value = '';
                            inputValueCheck();
                            
                        }
                        // *注意bootstrap本4跟5不同
                        //document.getElementById('date').value = `${year}-${month + 1}-${target.childNodes[0].data}`;
                        document.getElementById('date').value = `${year}-${month + 1}-${e.target.childNodes[0].innerText}`;
                        console.log(document.getElementById('date').value);
                        document.getElementById('info-date').value = e.target.dataset.date;
                        document.getElementById('info-todo-item').value = e.target.innerText;
                    },false);
                }
                else{
                    //下個月
                }
                day++;
            }
            dItems.appendChild(dayElm);
        }
    }
}
//初始化月曆
Init();

let addTodoItem = document.getElementById('todo-item');
addTodoItem.addEventListener('keyup' , displaySave);
let SaveItem = document.getElementById('save-btn');

//display-save btn
function displaySave(){
    if(addTodoItem.value === ''){
        SaveItem.setAttribute('disabled' , "true");
    }else{
        SaveItem.removeAttribute('disabled');
    }
    Init();
}

// check add-Value
function inputValueCheck(){
        //save-btn
    if(addTodoItem.value === ''){
        SaveItem.setAttribute('disabled' , "true");
        console.log("input true")
    }else{
        SaveItem.removeAttribute('disabled');
        console.log("input false");
    }
    Init();
}

//Save TodoList
function SaveTodoItem(){
    let date = document.getElementById('date').value;
    let todoItem = document.getElementById('todo-item').value;
    
    let todoObj = {
        title: todoItem
    };
    let todoList =[];
    if(localStorage.getItem(date) == null){
        todoList.push(todoObj);
    }else{
        todoList = JSON.parse(localStorage.getItem(date));
        todoList.push(todoObj);
    }
    localStorage.setItem(date , JSON.stringify(todoList));
    Init();
}

//display-change
let inputChange = document.getElementById('info-todo-item-change');
inputChange.addEventListener('keyup' , displayChange);
let changeBtn = document.querySelector('.change-btn');

//display-change btn
function displayChange(){
    if(inputChange.value === ''){
        changeBtn.setAttribute('disabled' , "true");
    }else{
        changeBtn.removeAttribute('disabled');
    }
    Init();
}
//check change-value
function updateValueCheck(){
    if(inputChange.value === ''){
        changeBtn.setAttribute('disabled' , "true");
    }else{
        changeBtn.removeAttribute('disabled');
    }
    Init();
    
}

//Update Set
function EditTodoItem(){
    const date = document.getElementById('info-date').value;

    //原值
    const todoItem = document.getElementById('info-todo-item').value;
    const todoObj = {
        title: todoItem
    };
    //欲改變的值
    let todoItemChange = document.getElementById('info-todo-item-change').value; 
    const todoChangeObj = {
        title: todoItemChange
    };
    const localData = localStorage.getItem(date); // string
    let localArray = JSON.parse(localData);
    const index = localArray.findIndex(item=>item.title === todoObj.title);
    //變更localArray的指定索引值
    localArray[index] = todoChangeObj;
    localStorage.setItem(date , JSON.stringify(localArray));
    Init();
}

//Delete Set
function DeleteTodoItem(){
    const date = document.getElementById('info-date').value;
    const todoItem = document.getElementById('info-todo-item').value;

    //進階版 todoObj {A: a}
    const todoObj = {
        title: todoItem
    };
    
    const localData = localStorage.getItem(date); // string 
    let localArray = JSON.parse(localData); // array > 
    //item指每個object

    const index = localArray.findIndex(item=>item.title === todoObj.title);// 0
    localArray.splice(index,1);
    localStorage.setItem(date , JSON.stringify(localArray));
    Init();
}
function PreMon(){
    month--;
    Init();
}

function NextMon(){
    month++;
    Init();
}

function Reset(){
    localStorage.clear();
    Init();
}


    //原本寫法 let localNewArray = localArray.filter(item=>item.index === index);
    // if(localArray.length === 0){
    //     localArray = '';
    //     localStorage.removeItem(date);
    //     Init();
    // else
    // {
        //將選取到日期的localStorage資料,重新設定為已轉JSON格式的localArray
    // }
    
    //Hard core版
    // let todoObj = {
    //     title: todoItem
    // };//todoObj {A: a}
    
    // let todoValue = todoObj.title;
    // console.log(todoValue); // 寫爆CODE
    
    // let localData = localStorage.getItem(date);
    // let localArray = JSON.parse(localData);
    
    // let localValueArray = []; //["寫爆CODE"]
    // localArray.forEach(function(item , index){
    //     localValueArray.push(item.title)
    // })
    // console.log(localValueArray);
    // let index = localValueArray.indexOf(todoValue);  // 0