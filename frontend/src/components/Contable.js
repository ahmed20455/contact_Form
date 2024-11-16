import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';

export default function Contable() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editContact, setEditContact] = useState(null);
  const [open, setOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch('http://localhost:3001/demo');
        const data = await response.json();
        if (response.ok) {
          setContacts(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch contacts');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      setProcessing(true);
      try {
        const response = await fetch(`http://localhost:3001/demo/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setContacts((prev) => prev.filter((contact) => contact._id !== id));
          setSnackbarMessage('Contact deleted successfully');
        } else {
          const data = await response.json();
          throw new Error(data.message || 'Failed to delete contact');
        }
      } catch (err) {
        setSnackbarMessage(err.message);
      } finally {
        setProcessing(false);
      }
    }
  };

  const handleEditOpen = (contact) => {
    setEditContact({ ...contact });
    setOpen(true);
  };

  const handleEditClose = () => {
    setEditContact(null);
    setOpen(false);
  };

  const handleEditSave = async () => {
    if (!editContact) return;

    if (
      !editContact.firstname ||
      !editContact.lastname ||
      !editContact.email ||
      !editContact.company ||
      !editContact.phonenumber ||
      !editContact.title
    ) {
      setSnackbarMessage('All fields are required');
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch(`http://localhost:3001/demo/${editContact._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editContact),
      });
      if (response.ok) {
        const updatedContact = await response.json();
        setContacts((prev) =>
          prev.map((contact) =>
            contact._id === updatedContact._id ? updatedContact : contact
          )
        );
        setSnackbarMessage('Contact updated successfully');
        handleEditClose();
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update contact');
      }
    } catch (err) {
      setSnackbarMessage(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Box sx={{ width: '100%', mt: 4 }}>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="contact table">
            <caption><b>Contact List</b></caption>
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact._id}>
                  <TableCell>{contact.firstname}</TableCell>
                  <TableCell>{contact.lastname}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.company}</TableCell>
                  <TableCell>{contact.phonenumber}</TableCell>
                  <TableCell>{contact.title}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEditOpen(contact)}
                      disabled={processing}
                      aria-label={`Edit ${contact.firstname}`}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDelete(contact._id)}
                      disabled={processing}
                      aria-label={`Delete ${contact.firstname}`}
                    >
                      {processing ? <CircularProgress size={20} /> : 'Delete'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={handleEditClose}>
        <DialogTitle>Edit Contact</DialogTitle>
        <DialogContent>
          {['firstname', 'lastname', 'email', 'company', 'phonenumber', 'title'].map((field) => (
            <TextField
              key={field}
              margin="dense"
              label={field.replace(/^\w/, (c) => c.toUpperCase())}
              type="text"
              fullWidth
              value={editContact?.[field] || ''}
              onChange={(e) =>
                setEditContact({ ...editContact, [field]: e.target.value })
              }
              error={!editContact?.[field]}
              helperText={!editContact?.[field] && 'This field is required'}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleEditSave} color="primary" disabled={processing}>
            {processing ? <CircularProgress size={20} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={4000}
        message={snackbarMessage}
        onClose={() => setSnackbarMessage(null)}
      />
    </Box>
  );
}
