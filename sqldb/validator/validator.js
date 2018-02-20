'use strict'

const pattern = {
  name: /^[a-z ,.'\-áéíóúñãâàẽêèĩîìõôòũûùüçĝỹ]+$/i,
  number: /^\d+$/,
  email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  phone: /^((\(\d+\) )?\d+-)?\d+$/,
  dni: /^[0-9a-z]+$/i,
  license: /^\d{1,7}$/,
  ICDCode: /^[A-Z][A-Z0-9][A-Z0-9](\.[0-9]{1,3})?$/,
  PCSCode: /^[A-Z0-9]{7}$/
}

export function validateName (value) {
  return pattern.name.test(value)
}

export function validateDni (value) {
  return pattern.dni.test(value)
}
