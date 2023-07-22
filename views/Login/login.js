async function login(event){
    try{
        event.preventDefault();
        const obj = {
            email:event.target.email.value,
            password:event.target.password.value
        }
        const response = await axios.post('http://13.51.199.65:3000/user/login',obj);
        alert(response.data.message);
        localStorage.setItem('token',response.data.token);
        window.location.href = "../Expense/expense.html";
    } catch(error){
        console.log(JSON.stringify(error));
        //document.body.innerHTML = document.body.innerHTML + '<h4>Something went wrong!</h4>';
        document.body.innerHTML = document.body.innerHTML + `<div style="color:red">${error.message}</div>`
    }
}

document.getElementById('forgot').onclick = async ()=>{
    try{
        window.location.href = "../Forgot/forgot.html"
    }catch(error){
        console.log(error);
        document.body.innerHTML = document.body.innerHTML + `<div style="color:red">${error.message}</div>`
    }
}