import React, { useState } from 'react';
import styled from 'styled-components';
import FormInput from '../components/forms/FormInput';
import FormValidation from '../components/forms/FormValidation';
import Button from '../components/common/Button';

const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setError('All fields are required.');
      setSuccess(false);
    } else {
      setError('');
      setSuccess(true);
      // Here you would typically send the form data to your server
      console.log({ name, email, message });
      // Reset form fields
      setName('');
      setEmail('');
      setMessage('');
    }
  };

  return (
    <ContactContainer>
      <Title>Contact Us</Title>
      <Form onSubmit={handleSubmit}>
        <FormInput
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={error && !name ? 'Name is required' : undefined}
          required
        />
        <FormInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error && !email ? 'Email is required' : undefined}
          required
        />
        <FormInput
          label="Message"
          as="textarea"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          error={error && !message ? 'Message is required' : undefined}
          required
        />
        <Button type="submit">Send Message</Button>
      </Form>
      {success && <SuccessMessage>Your message has been sent successfully!</SuccessMessage>}
      {error && <FormValidation error={error} />}
    </ContactContainer>
  );
};

const ContactContainer = styled.div`
  padding: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const Form = styled.form`
  max-width: 400px;
  margin: 0 auto;
`;

const SuccessMessage = styled.p`
  color: green;
  margin-top: 1rem;
`;

export default Contact;