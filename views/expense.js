async function addExpense(event){
    try{
        event.preventDefault();
        const obj = {
            amount:event.target.amount.value,
            description:event.target.description.value,
            category:event.target.category.value
        }
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:5000/expense/add-expense', obj, {headers:{"Authorization":token}});
        showExpenseOnScreen(response.data.newExpenseAdded);
    } catch(error){
        console.log(error);
        document.body.innerHTML = document.body.innerHTML + '<h4>Something went wrong!</h4>'
    }
   }
    function showExpenseOnScreen(obj){
        const parentElement = document.getElementById('expenseTable');
        const childElement = `<tr id=${obj.id}><td>${obj.amount}</td><td>${obj.description}</td><td>${obj.category}</td>
            <td><button class="btn btn-primary" onclick="editExpense('${obj.id}','${obj.amount}','${obj.description}','${obj.category}')">Edit Expense
                <button class="btn btn-danger" onclick="deleteExpense(${obj.id})">Delete Expense
            </td></tr>`
        parentElement.innerHTML = parentElement.innerHTML + childElement;        
    }

    async function deleteExpense(expenseID){
        try{
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/expense/delete-expense/${expenseID}`,{headers:{"Authorization":token}});
            removeExpenseFromScreen(expenseID);
        } catch(error){
            console.log(error);
            document.body.innerHTML = document.body.innerHTML + '<h4>Something went wrong!</h4>'
        }
    }

    function removeExpenseFromScreen(expenseID){
        document.getElementById(expenseID).remove();
    }

    function editExpense(id,amount,description,category){
        document.getElementById('amount').value = amount;
        document.getElementById('description').value = description;
        document.getElementById('category').value = category;
        deleteExpense(id);
    }

    document.getElementById('rzp-button1').onclick = async function (e){
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/purchase/premiummembership',{headers:{"Authorization":token}});
        console.log(response);
        var options = {
            "key": response.data.key_id,
            "order_id":response.data.order.id,
            "handler":async function (response){
                    await axios.post('http://localhost:5000/purchase/updatetransactionstatus-success',{
                    order_id:options.order_id,
                    payment_id:response.razorpay_payment_id,
                },{headers:{"Authorization":token}})
                alert('You are a Premium User now');
                removePremiumButton();
                showLeaderBoard();
            },
        };
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed', async function (response){
        console.log(response);
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:5000/purchase/updatetransactionstatus-fail',{
                    order_id:options.order_id,
                    payment_id:response.razorpay_payment_id
                },{headers:{"Authorization":token}});
        alert('Something went wrong');
    });
    }

    function removePremiumButton(){
            document.getElementById('rzp-button1').remove();
            document.getElementById('message').innerHTML = `You are a premium user <button id="leaderboard" class="btn btn-primary">Show leadership</button>`;
            // document.getElementById('rzp-button1').style.visibility = "hidden";
            // document.getElementById('message').innerHTML = 'You are a premium user';

    }

    function showLeaderBoard(){
        document.getElementById('leaderboard').onclick = async () => {
        const token = localStorage.getItem('token');
        const userLeaderBoardArray = await axios.get('http://localhost:5000/premium/showLeaderBoard',{headers:{"Authorization":token}});
        console.log(userLeaderBoardArray);

        var leaderBoardElements = document.getElementById('leaderBoardElements');
        leaderBoardElements.innerHTML = leaderBoardElements.innerHTML + '<h1>Leaderboard</h1>'

        for(var i=0;i<userLeaderBoardArray.data.length;i++){
            console.log(userLeaderBoardArray.data[i]);
            var leaderBoardElements = document.getElementById('leaderBoardElements');
            const childElement = `<li>Name - ${userLeaderBoardArray.data[i].username} - Total Expense - ${userLeaderBoardArray.data[i].totalExpense}</li>`
            leaderBoardElements.innerHTML = leaderBoardElements.innerHTML + childElement;
        }
    }
    }

    window.addEventListener("DOMContentLoaded",async ()=>{
        try{
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/expense/get-expense',{headers:{"Authorization":token}});
            for(var i=0;i<response.data.allExpenses.length;i++){
                showExpenseOnScreen(response.data.allExpenses[i]);
            }
        } catch(error){
            console.log(error);
            document.body.innerHTML = document.body.innerHTML + '<h4>Something went wrong!</h4>'
        }
    });

    window.addEventListener("DOMContentLoaded",async ()=>{
        try{
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/purchase/getstatus',{headers:{"Authorization":token}});
            console.log(response);
            console.log(response.data.allStatus)
            console.log(response.data.allStatus.status)
            if(response.data.allStatus.status === 'SUCCESSFUL'){
                removePremiumButton();
                showLeaderBoard();
            }
        } catch(error){
            console.log(error);
            //document.body.innerHTML = document.body.innerHTML + '<h4>Something went wrong!</h4>'
        }
    });