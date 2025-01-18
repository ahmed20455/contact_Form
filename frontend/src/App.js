import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useState } from 'react';
import Contable from'./components/Contable'
export default function FormPropsTextFields() {
  const [person, setPerson] = useState({ firstname: '', lastname: '', email: '', company: '', phonenumber: '', title: '' });
  const [errors, setErrors] = useState({});
  const [serverErrors, setServerErrors] = useState([]);

  const validateFields = () => {
    const newErrors = {};
    Object.keys(person).forEach((key) => {
      if (!person[key]) {
        newErrors[key] = 'This field is required';
      }
    });
    if (person.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(person.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (person.phonenumber && !/^\d{10}$/.test(person.phonenumber)) {
      newErrors.phonenumber = 'Please enter a valid 10-digit phone number';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateFields();

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const data = { ...person };

      try {
        const response = await fetch('https://orange-space-engine-p595xgxwpxgf55x-3001.app.github.dev/demo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.status === 409) {
          const data = await response.json();
      alert(data.message)
        } 
        else if(response.ok){
          console.log('User created successfully:', result);
          alert("Contact saved successfully, note: Refresh the page to see contact in the list")

          
          setPerson({
            firstname: '',
            lastname: '',
            email: '',
            company: '',
            phonenumber: '',
            title: ''
          });
          
          setErrors({});
          setServerErrors([]);
        }
          
        else {
          setServerErrors(result.errors || ['An error occurred. Please try again.']);
      } 
        }catch (error) {
        console.error('Error:', error);
        setServerErrors(['Network error. Please try again later.']);
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        alignItems: 'flex-start',
        marginTop: '60px',
        position: 'relative', 
      }}
    >
     
      {['firstname', 'lastname', 'email', 'company', 'phonenumber', 'title'].map((field) => (
        <TextField
          key={field}
          required
          id={`outlined-required-${field}`}
          label={field.replace(/^\w/, (c) => c.toUpperCase())}
          type="text"
          placeholder={field.replace(/^\w/, (c) => c.toUpperCase())}
          onChange={(e) => setPerson({ ...person, [field]: e.target.value })}
          value={person[field]}
          error={!!errors[field]}
          helperText={errors[field]}
          sx={{
            width: '150px', 
            margin: '8px 0',
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'blue' },
              '&:hover fieldset': { borderColor: 'green' },
              '&.Mui-focused fieldset': { borderColor: 'purple' },
            },
          }}
        />
      ))}

      <Button
        variant="contained"
        type="submit"
        sx={{
          margin: '8px 0',
        }}
        onClick={handleSubmit}
      >
        Create Contact
      </Button>

      {serverErrors.length > 0 && (
        <Box sx={{ color: 'red', marginTop: 2 }}>
          {serverErrors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </Box>
      )}
      <Contable />
    </Box>
  );
}
