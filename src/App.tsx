import React from 'react';
// import './index.css';

function App() {
  return (
    <>
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center gap-x-4">
    <div className="shrink-0">
      {/* <img className="size-12" src="/img/logo.svg" alt="ChitChat Logo"> */}
    </div>
    <div>
      <div className="text-xl font-medium text-black">ChitChat</div>
      <p className="text-slate-500">You have a new message!</p>
    </div>
  </div>
  <p>Hover button</p>
    <button className="bg-sky-500 hover:bg-sky-700">Save changes</button>
    <button className="bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300 ...">
  Save changes
</button>
<p>Error state</p>
<form>
  <label className="block">
    <span className="block text-sm font-medium text-slate-700">Username</span>
    <input type="text" value="tbone" disabled className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
      focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
      disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
      invalid:border-pink-500 invalid:text-pink-600
      focus:invalid:border-pink-500 focus:invalid:ring-pink-500
    "/>
  </label>
</form>
<blockquote className="text-2xl font-semibold italic text-center text-slate-900">
  When you look
  <span className="before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-pink-500 relative inline-block">
    <span className="relative text-white">annoyed</span>
  </span>
  all the time, people think that you're busy.
</blockquote>
<button className="py-2 px-5 bg-violet-500 text-white font-semibold rounded-full shadow-md hover:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-400 focus:ring-opacity-75">
  Save changes
</button>

<button className="btn-primary">
  Save changes
</button>
</>
    
  );
}

export default App;
