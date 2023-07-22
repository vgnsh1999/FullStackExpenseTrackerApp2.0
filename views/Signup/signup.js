async function signUp(event){
    try{
        event.preventDefault();
        const obj = {
            username:event.target.username.value,
            email:event.target.email.value,
            password:event.target.password.value
        }
        const response = await axios.post('http://13.51.199.65:3000/user/signup',obj);
        if(response.status === 201){
          window.location.href = "../Login/login.html";
          localStorage.setItem('username',obj.username);
        } else {
          throw new Error('Failed to login');
        }
    } catch(error){
        console.log(error);
        //document.body.innerHTML = document.body.innerHTML + '<h4>Something went wrong!</h4>';
        document.body.innerHTML = document.body.innerHTML + `<div style="color:red";>${error}</div>`
    }
}