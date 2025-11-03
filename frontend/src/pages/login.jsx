import React , {useState} from 'react';
import Logo from '../components/ui/logo';
import Signup from './signup'
function  Login()  {

  const [email,setEmail]=useState('');
  const [password , setPassword]=useState('');
  const handleSubmit =(event)=>{
    event.preventDefault();
    console.log('Logging in with: ', {email,password});
  };
  return (
    
    <div className='  min-h-screen flex justify-center items-center'>
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className='text-center'>
          <Logo />
         <h3 className='mt-4 text-3xl font-bold text-gray-900'>
          Welcome to Chit Chat 
          </h3>

          <p clasName="mt-2 text-sm text-gray-600">
            Sign in to continue
          </p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
         <div >
          <label 
          htmlfor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input 
             id="email"
             name="email"
             type="email"
             required
             value={email}
             onChange={(e)=> setEmail(e.target.value)} 
             className="w-full px-3 py-2 mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
             placeholder="you@example.com" />
            </div>
            <div>
              <lable 
              htmlFor="password"
              classname="block text-sm font-medium text-gray-700"
              >
                Password
              </lable>
              <input
              name="password"
              type="password"

              required
              value={password}
              onChange={(e)=> setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="123456"
              />
              </div>
              <div className="text-sm text-right">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your Password?
                </a>
              </div>
              <div>
          <button 
           type="submit"
           className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-offset-2 focus:ring-blue-500"
           >
             Sign In 
             </button>
      </div>
       </form>
       <p className="text-sm text-center text-gray-600">
        Don't have an accout?{''}
        <a href={<Signup />} className="font-medium text-blue-600 hover:text-blue-500">
          Sign Up
        </a>
       </p>
    </div>
    </div>
  );
}

export default Login;