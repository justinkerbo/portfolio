/*
add event handler,
define all of the values,
add to data structure,
add new item to ui
calculate budget
update UI

I want to add a database, where it saves each users from cookies.

I want to add a Calendar with a to-do Payment list.
*/

//data encapsulation allows to hide details of a module from outside scope
//in closures and inner variable always has access to its outer function

//IIFE
//budget controller
//function constructor for lots of objects (exp and inc),use capital letter to distinguish.
//cant use arrow functions for function constructors.
const budgetController = (() => {
    const Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        //when it's not defined we use -1
        this.percentage = -1;
    };

    // Expense.prototype.calcPercentage = totalIncome => {
    //     if (totalIncome > 0) {
    //         this.percentage = Math.round((this.value / totalIncome) * 100);
    //     } else {
    //         this.percentage = -1;
    //     }
    // };

    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };
    Expense.prototype.getPercentage = function () {
        return this.percentage;
    };

    const Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    const calculateTotal = type => {
        let sum = 0;
        data.allItems[type].forEach((cur) => {
            sum += cur.value;
        });
        data.totals[type] = sum;
    };




    //where all the data goes
    const data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 6,

        percentage: -1,

    };
    return {
        //this returns an object, a new item and it defines if it's expense or income
        addItem: (type, des, val) => {
            let newItem, ID;
            //IF there is no ID, then create one and make it 0
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else ID = 0;
            //create new item based on 'inc or 'exp'
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            //pushes new item to end of newItem array.
            data.allItems[type].push(newItem);
            //return it so the other module can call it and have direct access.
            return newItem;
        },

        deleteItem: (type, id) => {
            let ids = data.allItems[type].map((current) => {
                return current.id;

            });
            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: () => {

            //calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            //calculate income - expenses fro data structure
            data.budget = data.totals.inc - data.totals.exp;

            //calc percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        calculatePercentages: () => {
            data.allItems.exp.forEach((cur) => {
                dataPercent = cur.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: () => {
            let allPerc = data.allItems.exp.map((cur) => {
                return cur.getPercentage();
            });
            return allPerc;
        },

        getBudget: () => {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },

        testing: () => {
            console.log(data);
        }
    }
})();  //end of budget controller


//ui controller
const UIcontroller = (() => {

    //put all of the values in this object for easy access later on.
    const DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentLabel: '.budget__expenses--percentage',
        container: '.container',
        expensePercent: '.item__percentage',
        dateLabel: '.budget__title--month'

    };

    let = formatNumber = (num, type) => {
        let numSplit, int, dec;
        // checks for + or -, type, and comma seperator
        //example 2310.013 -> 2,310.01 = 2310.013.toFixed(2)
        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit = num.split('.');
        int = numSplit[0];
        if (int.length > 3) {
            //check every 3 0's and adds a comma
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);//input 2310, output 2,310 23100 -> 23,100
        }
        dec = numSplit[1];
        // type === 'exp' ? sign = '-' : sign = '+';
        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };

    //accepts first parameter which is the query DOM nodes / elements.
    //function loops through the function, taking in a call back function
    let nodeListForEach = (list, callback) => {
        for (let i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    return {
        getInput: () => {
            //getInput is all of the input values
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        //Create HTML string with placeholder text, decides to put in inc or exp list
        addListItem: (obj, type) => {
            let html, newHtml, element;
            if (type === 'inc') {
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                element = DOMstrings.incomeContainer;
            } else if (type === 'exp') {
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                element = DOMstrings.expensesContainer;
            }
            //replace method, all placeholder data text
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
            //insert the HTML into the DOM!
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        deleteListItem: selectorID => {
            let el;
            el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },
        //finds fields needed to be emptied, finds the array in the prototype and calls fields
        //loops through and deletes the values.
        clearFields: () => {
            let fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' +
                DOMstrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach((current, index, array) => {
                current.value = '';
            });
            //puts the focus on the description
            fieldsArr[0].focus();
        },
        displayBudget: (obj) => {
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentLabel).textContent = '---';
            }
        },
        //Looping function for Arrays
        //function takes in percentage Array
        displayPercentages: (percentages) => {
            //node list, each element is a node in a DOMtree
            //function selects an element from the DOM
            let fields = document.querySelectorAll(DOMstrings.expensePercent);

            //callback function 
            nodeListForEach(fields, (current, index) => {
                //selects which percentage goes to which field
                if (percentages[index] > 0) {
                    //accepts the main parent's parameter
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '--';
                }

            });

        },

        displayMonth: function () {
            var now, months, month, year;

            now = new Date();
            //var christmas = new Date(2016, 11, 25);

            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            //getMonth gives a number, thats why i made the months array ^
            month = now.getMonth();

            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
        },

        //changes color of fields depending on type
        changeType: () => {
            let fields;
            fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue);

            nodeListForEach(fields, (cur) => {
                cur.classList.toggle('red-focus');
            });
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        },

        //DOMstrings is an object on line 75
        getDOMstrings: () => {
            return DOMstrings;
        }
    };

})();


//global app controller
const controller = ((budgetCtrl, UICtrl) => {

    //set a function where all the event listeners will be placed
    //all event listeners are places here
    const setupEvenListeners = () => {
        //getDOMstrings() is now called DOM within this IIFE
        //We only need DOM for the event listeners
        const DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', (event) => {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
        document.querySelector(DOM.container).addEventListener('click', ctrlDelItem);
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType);
    };

    const updateBudget = () => {

        //1. calculate the budget
        budgetCtrl.calculateBudget();

        //2. return the budget
        let budget = budgetCtrl.getBudget();

        //3 display the budget on the UI
        UICtrl.displayBudget(budget);

    };

    const updatePercentages = () => {

        //calculate percentages
        budgetCtrl.calculatePercentages();

        //read percentages from the budget controller
        var percentages = budgetCtrl.getPercentages();
        //display them on the UI
        UICtrl.displayPercentages(percentages);
    };



    const ctrlAddItem = () => {
        let input, newItem;
        //input is an object with the values the user input.
        input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            //add item to budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            //add item to the UI
            UICtrl.addListItem(newItem, input.type);
            //clear fields
            UICtrl.clearFields();
            //calculate and update the budget
            updateBudget();
            //update Percentages
            updatePercentages();
        }
    }

    //delete item
    //Event Delegation / bubbles up to parent node
    const ctrlDelItem = event => {
        let itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        console.log(itemID);
        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            //1. delete item from structure
            budgetCtrl.deleteItem(type, ID);
            //delete item from user interface
            UICtrl.deleteListItem(itemID);

            //update and show new budget.
            updateBudget();
        }
    };
    return {
        init: () => {
            console.log('App has started');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0
            }
            );
            setupEvenListeners();

        }
    };


})(budgetController, UIcontroller);

//without this code nothing will work, this initializes setupEventListeners which then inits CtrlAddItem
controller.init();




