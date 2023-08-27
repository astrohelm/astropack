'use strict';

const phonePurify = phone => phone.replace(/[^+\d]/g, '');
const phonePrettify = p =>
  p.replace(/\D+/g, '').replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '+$1 ($2) $3-$4-$5');

const normalizeEmail = email => {
  const at = email.lastIndexOf('@');
  const domain = email.slice(at).toLowerCase();
  return email.slice(0, at) + domain;
};

module.exports = { phonePrettify, phonePurify, normalizeEmail };
