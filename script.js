'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP


/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale


const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');




const transactionDates = function (date){ 
  const CalcDaysPassed = (date1,date2) => Math.round(Math.abs((date2 - date1)/ (1000 * 60 * 60 * 24)));

  const daysPassed =  CalcDaysPassed(new Date(), date);

  if(daysPassed === 0) return "Today";
  if(daysPassed === 1) return "Yesterday";
  if(daysPassed <= 7) return `${daysPassed} days ago`;
  else{
    const day = `${date.getDate ()}`.padStart(2,0);
    const month = `${date.getMonth() + 1}`.padStart(2,0);
    const year = date.getFullYear();
    return `${day}/${month }/${year}`
  }



  
  

  


}
//transaction info
const showTransactions = function (account, sort = false){
  containerMovements.innerHTML = " ";
  const movs = sort ? account.movements.slice().sort((a,b)=> a-b) :account.movements
  movs.forEach(function(value,index){

  const date = new Date(account.movementsDates[index]); 
  const displayDate = transactionDates(date);
  
    const transactionType = value < 0 ? 'withdrawal' : 'deposit'
    const html = `
    <div class="movements__row">
      <div class="movements__type
       movements__type--${transactionType}">${index + 1} ${transactionType}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${value.toFixed(2)}€</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin",html);


  });
};


//account balance
const calculatedShowBalance = function (account){
    const balance =  account.movements.reduce((accu,curr) => accu + curr, 0);
    labelBalance.textContent = `${balance.toFixed(2)}€`
    account.balance = balance;

};



const calcShowSummary = function (account){
  const income = account.movements.filter((val) => val > 0).reduce((accu,curr) => accu + curr,0);
  labelSumIn.textContent = `${income.toFixed(2)}€`


  const out = account.movements.filter((val) => val < 0).reduce((accu,curr) => accu 
  + Math.abs(curr),0);
  labelSumOut.textContent = `${out.toFixed(2)}€`


  const interest =  account.movements.filter((val) => val > 0).map((val) => val * account.interestRate/100)
  .filter((val,i,arr) => {
    return val >= 1
  })
  .reduce((accu,curr) => accu + curr,0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
}

// create username
const createUsername = function (accounts) {
  accounts.forEach((obj)=>{
    const username = obj.owner.toLowerCase().split(" ").map((name)=> name[0]).join("");
    obj.username = username;
  });
}
createUsername(accounts);

//update Ui

const  updateUi = function (account){
  //display trnsactions
  showTransactions(account);

  //display balance
  calculatedShowBalance(account);

  //display summary
  calcShowSummary(account);


}


const startLogOutTimer = function (){
  let time = 300;

  const tick = function(){
    const min = String(Math.trunc(time / 60)).padStart(2,"0");
    const sec = String(time % 60).padStart(2,"0");
    labelTimer.textContent = `${min}:${sec}`;

  
    if(time === 0){
      clearInterval(timer)
      labelWelcome.textContent = `Login in to get started`;
      containerApp.style.opacity = 0;
    }

    time--;
    
  };
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};


//login
let currentAcccount,timer;


btnLogin.addEventListener("click", function (e){
  //prevents form from submitting
  e.preventDefault()
  console.log(inputLoginPin.value);
  currentAcccount = accounts.find((account) => account.username === inputLoginUsername.value);
  console.log(currentAcccount);

  if(currentAcccount?.pin === +(inputLoginPin.value)){
    console.log("LOgin");

    labelWelcome.textContent = `Welcome back ${currentAcccount.owner.split(" ")[0]}`;
    containerApp.style.opacity = 100;


    const currentDate = new Date();
    const day = `${currentDate.getDay()}`.padStart(2,0);
    const month = `${currentDate.getMonth()}`.padStart(2,0);
    const year = currentDate.getFullYear();
    const hour = currentDate.getHours();
    const mins = currentDate.getMinutes();

    labelDate.textContent =  `${day}/${month + 1}/${year}, ${hour}:${mins}`;


    //clear input fields

    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    
    if(timer) clearInterval(timer);
    timer = startLogOutTimer();
    updateUi(currentAcccount);

    


  }
});


//transfere
btnTransfer.addEventListener("click",function(e){
  e.preventDefault()
  const amount = +(inputTransferAmount.value);
  const recieverAcc = accounts.find((acc)=> acc.username === inputTransferTo.value);

  console.log(amount,recieverAcc);

  if(amount > 0 && recieverAcc && currentAcccount.balance >= amount
    && recieverAcc?.username !== currentAcccount.username){
      console.log("valid");

      //doing transfere
      currentAcccount.movements.push(-amount);
      recieverAcc.movements.push(amount);
      //add date
      currentAcccount.movementsDates.push(new Date().toISOString());
      recieverAcc.movementsDates.push(new Date().toISOString());


      updateUi(currentAcccount);

      clearInterval(timer);
      timer = startLogOutTimer();
    };

    inputTransferAmount.value = inputTransferTo.value = "";
});


//loan
btnLoan.addEventListener("click", function (e) {
  e.preventDefault()
  const amount = Math.floor(inputLoanAmount.value);

  if(amount > 0 && currentAcccount.movements.some((mov) => mov >= amount * 0.1)){

    setTimeout(function (){
    //add amaount

    currentAcccount.movements.push(amount);
    //add date

    currentAcccount.movementsDates.push(new Date().toISOString());
      //update UI
    updateUi(currentAcccount)
    },3000)

    clearInterval(timer);
    timer = startLogOutTimer();
  }
  inputLoanAmount.value = "";
});






//close account
btnClose.addEventListener("click",function (e){
  e.preventDefault();
  console.log("delete");

  if(inputCloseUsername.value === currentAcccount.username &&
    +(inputClosePin.value) === currentAcccount.pin){

      const index = accounts.findIndex( (acc) => acc.username === currentAcccount.username);

        //delete account
        accounts.splice(index,1);

        //hide Ui
        containerApp.style.opacity = 0;
    };

    inputCloseUsername.value = inputClosePin.value = "";

})

// sort
let sorted = false
btnSort.addEventListener("click", function(e){
  e.preventDefault()
  showTransactions(currentAcccount,!sorted);
  sorted =!sorted

});



