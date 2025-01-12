import React, { useState } from 'react';
import FormGroup from '../forms/FormGroup';
import FormInput from '../forms/FormInput';
import Button from '../common/Button';

const LeadForm: React.FC<{ onSubmit: (lead: Lead) => void }> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lead = { name, email, phone, notes };
    onSubmit(lead);
    // Reset form fields
    setName('');
    setEmail('');
    setPhone('');
    setNotes('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormGroup label="Name">
        <FormInput
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter lead's name"
        />
      </FormGroup>
      <FormGroup label="Email">
        <FormInput
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter lead's email"
        />
      </FormGroup>
      <FormGroup label="Phone">
        <FormInput
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter lead's phone number"
        />
      </FormGroup>
      <FormGroup label="Notes">
        <FormInput
          as="textarea"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter any additional notes"
        />
      </FormGroup>
      <Button type="submit">Add Lead</Button>
    </form>
  );
};

export default LeadForm;

// Define the Lead type
interface Lead {
  name: string;
  email: string;
  phone: string;
  notes: string;
}