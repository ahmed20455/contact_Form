const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

async function main() {
  try {
    await mongoose.connect('');
    console.log('DB connected');
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
}
main();

const PersonSchema = new mongoose.Schema({
  firstname: { type: String, required: true, trim: true },
  lastname: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: function (email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); },
      message: 'Invalid email address format',
    },
  },
  company: { type: String, trim: true },
  phonenumber: { type: String, match: [/^\d{10}$/, 'Please enter a 10-digit phone number'], required: true },
  title: { type: String, trim: true },
});

const Person = mongoose.model('Person', PersonSchema);

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// POST: creating a contact
app.post('/demo', async (req, res) => {
  const { email } = req.body;

  try {
    const existingContact = await Person.findOne({ email });
    if (existingContact) {
      return res.status(409).json({ message: 'A contact with this email already exists.' });
    }
    const user = new Person(req.body);
    const doc = await user.save();
    res.status(201).json(doc);
   }catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      res.status(400).json({ message: 'Validation error', errors });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

// GET: Displaying the contacts
app.get('/demo', async (req, res) => {
  const { page = 1, limit = 10, sortField = 'firstname', sortOrder = 'asc' } = req.query;
  const sortOptions = { [sortField]: sortOrder === 'asc' ? 1 : -1 };

  try {
    const contacts = await Person.find()
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalContacts = await Person.countDocuments();
    res.json({
      data: contacts,
      totalPages: Math.ceil(totalContacts / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// PUT: Updating the contact
app.put('/demo/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedPerson = await Person.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedPerson) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json(updatedPerson);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      res.status(400).json({ message: 'Validation error', errors });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

// DELETE: Deleting the contact
app.delete('/demo/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPerson = await Person.findByIdAndDelete(id);
    
    if (!deletedPerson) {
      return res.status(404).json({ message: 'Person not found' });
    }
    
    res.status(200).json({ message: 'Person deleted successfully', deletedPerson });
  } catch (error) {
    console.error('Error deleting person:', error);
    res.status(500).json({ message: 'Error deleting person' });
  }
});


app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
