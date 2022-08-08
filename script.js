'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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



//transaction info
const showTransactions = function (movements){
  containerMovements.innerHTML = " ";
  movements.forEach(function(value,index){
    const transactionType = value < 0 ? 'withdrawal' : 'deposit'
    const html = `
    <div class="movements__row">
      <div class="movements__type
       movements__type--${transactionType}">${index + 1} ${transactionType}</div>
      <div class="movements__date">3 days ago</div>
      <div class="movements__value">${value}€</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin",html);


  });
};


//account balance
const calculatedShowBalance = function (account){
    const balance =  account.movements.reduce((accu,curr) => accu + curr, 0);
    labelBalance.textContent = `${balance}€`
    account.balance = balance;

};



const calcShowSummary = function (account){
  const income = account.movements.filter((val) => val > 0).reduce((accu,curr) => accu + curr,0);
  labelSumIn.textContent = `${income}€`


  const out = account.movements.filter((val) => val < 0).reduce((accu,curr) => accu 
  + Math.abs(curr),0);
  labelSumOut.textContent = `${out}€`


  const interest =  account.movements.filter((val) => val > 0).map((val) => val * account.interestRate/100)
  .filter((val,i,arr) => {
    return val >= 1
  })
  .reduce((accu,curr) => accu + curr,0);
  labelSumInterest.textContent = `${interest}€`;
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
  showTransactions(account.movements);

  //display balance
  calculatedShowBalance(account);

  //display summary
  calcShowSummary(account);


}




//login
let currentAcccount;


btnLogin.addEventListener("click", function (e){
  //prevents form from submitting
  e.preventDefault()
  console.log(inputLoginPin.value);
  currentAcccount = accounts.find((account) => account.username === inputLoginUsername.value);
  console.log(currentAcccount);

  if(currentAcccount?.pin === Number(inputLoginPin.value)){
    console.log("LOgin");

    labelWelcome.textContent = `Welcome back ${currentAcccount.owner.split(" ")[0]}`;
    containerApp.style.opacity = 100;

    //clear input fields

    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur()
    

    updateUi(currentAcccount);

    


  }
});


//transfere
btnTransfer.addEventListener("click",function(e){
  e.preventDefault()
  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find((acc)=> acc.username === inputTransferTo.value);

  console.log(amount,recieverAcc);

  if(amount > 0 && recieverAcc && currentAcccount.balance >= amount
    && recieverAcc?.username !== currentAcccount.username){
      console.log("valid");

      //doing transfere
      currentAcccount.movements.push(-amount);
      recieverAcc.movements.push(amount);

      updateUi(currentAcccount);
    };

    inputTransferAmount.value = inputTransferTo.value = "";
});


//loan
btnLoan.addEventListener("click", function (e) {
  e.preventDefault()
  const amount = Number(inputLoanAmount.value);

  if(amount > 0 && currentAcccount.movements.some((mov) => mov >= amount * 0.1)){
    //add amaount
    currentAcccount.movements.push(amount);
    //update ui
    updateUi(currentAcccount)

  }else{
    console.log("cant give loan")
  }

  inputLoanAmount.value = "";
});






//close account
btnClose.addEventListener("click",function (e){
  e.preventDefault();
  console.log("delete");

  if(inputCloseUsername.value === currentAcccount.username &&
    Number(inputClosePin.value) === currentAcccount.pin){

      const index = accounts.findIndex( (acc) => acc.username === currentAcccount.username);

        //delete account
        accounts.splice(index,1);

        //hide Ui
        containerApp.style.opacity = 0;
    };

    inputCloseUsername.value = inputClosePin.value = "";

})

/////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////

