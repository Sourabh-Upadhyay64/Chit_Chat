import React, {useState} from 'react';

const signup = () => {
    const [email , setemail]=useState('');
    const [password , setpassword]=useState('');
    const submit=(event)=>{
        event.preventDefault();
        Console.log("Signup successfully " , {email,password});
    };
    return (
    <div>signup</div>
  )
}

export default signup