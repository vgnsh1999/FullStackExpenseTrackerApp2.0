async function submit(event){
    try{
        event.preventDefault();
        const obj = {
            email:event.target.email.value
        }
        const response = await axios.post('http://localhost:5000/password/forgotpassword ',obj);
    } catch(error){
        console.log(JSON.stringify(error));
        //document.body.innerHTML = document.body.innerHTML + '<h4>Something went wrong!</h4>';
        document.body.innerHTML = document.body.innerHTML + `<div style="color:red">${error.message}</div>`
    }
}