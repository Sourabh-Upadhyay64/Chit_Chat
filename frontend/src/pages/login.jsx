import React , {useState} from 'react';
const Logo = () => (
  <svg className="w-12 h-12 mx-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
  </svg>
);
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
        <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
          Sign Up
        </a>
       </p>
    </div>
    </div>
  );
}

export default Login;