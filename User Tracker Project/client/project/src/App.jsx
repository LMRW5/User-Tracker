import { useState, useEffect } from 'react';
import './static/app.css';

function App() {
  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [email, setEmail] = useState('');
  const [userVal, setUserVal] = useState([]);

  useEffect(() => {
    async function getUsers() {
      try {
        const response = await fetch('http://localhost:6969/');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const users = await response.json();
        setUserVal(users);
      } catch (err) {
        console.log(err);
      }
    }

    getUsers();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!fName || !lName || !email){
      return
    }
    try {
      const response = await fetch('http://localhost:6969/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstname: fName,
          lastname: lName,
          email: email,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to add user');
      }
      setFName('');
      setLName('');
      setEmail('');
      const newUser = {
        firstname: fName,
        lastname: lName,
        email: email,
      };
      setUserVal([...userVal, newUser]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDelete(uid) {
    try {
      const response = await fetch(`http://localhost:6969/remove/${uid}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error(`Failed to delete user: ${response.statusText}`);
      }
  
      console.log('User deleted successfully:', uid);
  
      // Update state immediately after successful delete
      setUserVal(prevUsers => prevUsers.filter((element) => element._id !== uid));
  
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  }
  

  return (
    <>
      <h1>User Tracker</h1>
      <div className="App">
        <div className="TableContainer">
          <h3>Current Users</h3>
          <table className="Table">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {userVal.map((element, id) => (
                <tr key={id}>
                  <td>{element.firstname}</td>
                  <td>{element.lastname}</td>
                  <td>{element.email}</td>
                  <td>
                    <button onClick={() => handleDelete(element._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="FormContainer">
          <h3>Add User</h3>
          <form>
            <input type="text" placeholder="First Name" onChange={(e) => setFName(e.target.value)} value={fName} />
            <input type="text" placeholder="Last Name" onChange={(e) => setLName(e.target.value)} value={lName} />
            <input type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} value={email} />
            <button onClick={handleSubmit}>Submit</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default App;
