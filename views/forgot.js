async function forgotpassword(event){
    try{
        event.preventDefault();
        const obj = {
            email:event.target.email.value
        }
        console.log(obj)
        const response = await axios.post('http://localhost:5000/password/forgotpassword',obj);
        console.log(response)
        if(response.status === 202){
            document.body.innerHTML += '<div style="color:red;">Mail Successfuly sent <div>'
        } else {
            throw new Error('Something went wrong!')
        }
    } catch(error){
        console.log(JSON.stringify(error));
        //document.body.innerHTML = document.body.innerHTML + '<h4>Something went wrong!</h4>';
        document.body.innerHTML = document.body.innerHTML + `<div style="color:red">${error}</div>`
    }
}