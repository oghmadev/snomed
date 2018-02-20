'use strict'

import * as utils from '../../components/controllerUtils/controllerUtils'
import moment from 'moment'
import {
  Address,
  Contact,
  Family,
  Insurance,
  Name,
  Patient,
  PatientInsurance,
  PersonalHistory,
  ProblemHistory,
  sequelize,
  Telecom
} from '../../sqldb'
import { FAMILY } from '../../sqldb/enum'
import { APIParamInvalidError, APIParamMissingError, PatientNotUniqueError } from '../../components/errors'

export function findByCriteria (req, res) {
  return new Promise((resolve, reject) => {
    if (req.query.criteria == null) {
      return reject(new APIParamMissingError({
        missingParams: ['name'],
        endpoint: req.originalUrl,
        method: req.method,
        controllerFunction: findByCriteria.name,
        message: 'patient.criteria.missing'
      }))
    }

    const criteria = req.query.criteria.trim()
      .split(/\s/)
      .map(word => `unaccent("name"."given") ilike unaccent('%${word}%') OR
                    unaccent("name"."family") ilike unaccent('%${word}%') OR
                    "patient"."dni" ILIKE '%${word}%'`)
      .join(' OR ')

    return resolve(Patient.findAll({
      where: sequelize.literal(`(${criteria})`),
      attributes: {exclude: ['createdAt', 'updatedAt']},
      include: [Telecom, {
        model: Contact,
        attributes: {exclude: ['createdAt', 'updatedAt']},
        include: [Telecom, Name]
      }, {
        model: PatientInsurance,
        attributes: {exclude: ['createdAt', 'updatedAt']},
        include: [Insurance]
      }, {
        model: Name,
        attributes: {exclude: ['createdAt', 'updatedAt']}
      }, {
        association: Patient.Family,
        include: [Name]
      }, {
        model: Address,
        attributes: {exclude: ['createdAt', 'updatedAt']}
      }]
    }))
  })
    .then(utils.handleEntityNotFound(res))
    .then(utils.respondWithResult(res))
    .catch(utils.handleError(res, req.requestId))
}

export function show (req, res) {
  return new Promise((resolve, reject) => {
    if (req.params.id == null) {
      return reject(new APIParamMissingError({
        missingParams: ['id'],
        endpoint: req.originalUrl,
        method: req.method,
        controllerFunction: show.name,
        message: 'patient.id.missing'
      }))
    }

    return resolve(Patient.findById(req.params.id, {
      attributes: {exclude: ['createdAt', 'updatedAt']},
      include: [Telecom, {
        model: Contact,
        attributes: {exclude: ['createdAt', 'updatedAt']},
        include: [Telecom, Name]
      }, {
        model: PatientInsurance,
        attributes: {exclude: ['createdAt', 'updatedAt']},
        include: [Insurance]
      }, {
        model: Name,
        attributes: {exclude: ['createdAt', 'updatedAt']}
      }, {
        association: Patient.Family,
        include: [Name]
      }, {
        model: Address,
        attributes: {exclude: ['createdAt', 'updatedAt']}
      }]
    }))
  })
    .then(utils.handleEntityNotFound(res))
    .then(utils.respondWithResult(res))
    .catch(utils.handleError(res, req.requestId))
}

export function create (req, res) {
  return isUniqueAsync(req.body.name, req.body.birthDate, req.body.dni)
    .then(() => {
      return Patient.create(req.body, {
        include: [Telecom, Name, PatientInsurance, ProblemHistory, PersonalHistory, Address, {
          model: Contact,
          include: [Telecom, Name]
        }]
      })
    })
    .then(utils.respondWithResult(res, 201))
    .catch(utils.handleError(res, req.requestId))
}

export function upsert (req, res) {
  return new Promise((resolve, reject) => {
    if (req.params.id == null) {
      return reject(new APIParamMissingError({
        missingParams: ['id'],
        endpoint: req.originalUrl,
        method: req.method,
        controllerFunction: upsert.name,
        message: 'patient.id.missing'
      }))
    }

    if (req.body.id != null) delete req.body.id

    return resolve(isUniqueAsync(req.body.name, req.body.birthDate, req.body.dni, req.params.id))
  })
    .then(() => {
      return sequelize.transaction(transaction => {
        const patient = utils.deepClone(req.body)
        const updatePromises = []

        if (req.body.contactChanges != null) {
          if (req.body.contactChanges.added.length > 0) updatePromises.push(createContacts(req.params.id, req.body.contactChanges.added, transaction))
          if (req.body.contactChanges.changed.length > 0) updatePromises.push(updateContacts(req.body.contactChanges.changed, transaction))
          if (req.body.contactChanges.removed.length > 0) updatePromises.push(removeContacts(req.body.contactChanges.removed, transaction))

          delete patient.contactChanges
        }

        if (req.body.familyChanges != null) {
          if (req.body.familyChanges.added != null) updatePromises.push(setFamilyMembers(req.params.id, req.body.familyChanges.added, transaction))
          if (req.body.familyChanges.changed != null) updatePromises.push(updateFamilyMembers(req.params.id, req.body.familyChanges.changed, transaction))
          if (req.body.familyChanges.removed != null) updatePromises.push(removeFamilyMembers(req.params.id, req.body.familyChanges.removed, transaction))

          delete patient.familyChanges
        }

        if (req.body.patientInsurance.insurance != null) {
          const newInsurance = {
            affiliateId: req.body.patientInsurance.affiliateId,
            patientId: req.params.id,
            insuranceId: req.body.patientInsurance.insurance.id
          }

          updatePromises.push(PatientInsurance.upsert(newInsurance, {transaction: transaction}))
        } else if (patient.patientInsurance.deleteInsurance) {
          updatePromises.push(PatientInsurance.destroy({where: {patientId: req.params.id}, transaction: transaction}))
        }

        delete patient.patientInsurance

        if (req.body.telecomChanges != null) {
          if (req.body.telecomChanges.added.length > 0) {
            for (let telecom of req.body.telecomChanges.added) {
              telecom.patientId = req.params.id
            }

            updatePromises.push(createTelecoms(req.body.telecomChanges.added, transaction))
          }

          if (req.body.telecomChanges.changed.length > 0) updatePromises.push(updateTelecoms(req.body.telecomChanges.changed, transaction))
          if (req.body.telecomChanges.removed.length > 0) updatePromises.push(removeTelecoms(req.body.telecomChanges.removed, transaction))

          delete patient.telecomChanges
        }

        if (req.body.nameChanges != null) {
          updatePromises.push(Name.update(req.body.nameChanges, {
            where: {patientId: req.params.id},
            transaction: transaction
          }))

          delete patient.nameChanges
        }

        if (req.body.addressChanges != null) {
          updatePromises.push(Address.update(req.body.addressChanges, {
            where: {patientId: req.params.id},
            transaction: transaction
          }))

          delete patient.addressChanges
        }

        updatePromises.push(Patient.update(patient, {where: {id: req.params.id}, transaction: transaction}))

        return Promise.all(updatePromises)
      })
        .then(() => show(req, res))
    })
    .catch(utils.handleError(res, req.requestId))
}

export function count (req, res) {
  return new Promise((resolve, reject) => {
    if (req.query.criteria == null) {
      return reject(new APIParamMissingError({
        missingParams: ['criteria'],
        endpoint: req.originalUrl,
        method: req.method,
        controllerFunction: count.name,
        message: 'patient.criteria.missing'
      }))
    }

    const criteria = req.query.criteria.trim()
      .split(/\s/)
      .map(word => `unaccent("name"."given") ilike unaccent('%${word}%') OR 
                    unaccent("name"."family") ilike unaccent('%${word}%') OR
                    "patient"."dni" ILIKE '%${word}%'`)
      .join(' OR ')

    return resolve(Patient.count({
      include: [{
        model: Name,
        where: sequelize.literal(`(${criteria})`)
      }]
    }))
  })
    .then(utils.respondWithResult(res))
    .catch(utils.handleError(res, req.requestId))
}

export function getPageByCriteria (req, res) {
  return new Promise((resolve, reject) => {
    const missingParams = []

    if (req.query.skip == null) missingParams.push('skip')
    if (req.query.limit == null) missingParams.push('limit')
    if (req.query.criteria == null) missingParams.push('criteria')
    if (req.query.direction == null) missingParams.push('direction')

    if (missingParams.length > 0) {
      return reject(new APIParamMissingError({
        missingParams: missingParams,
        endpoint: req.originalUrl,
        method: req.method,
        controllerFunction: getPageByCriteria.name,
        message: 'patient.params.missing'
      }))
    }

    const invalidParams = []

    if (isNaN(req.query.skip)) invalidParams.push('skip')
    if (isNaN(req.query.limit)) invalidParams.push('limit')
    if (isNaN(req.query.direction)) invalidParams.push('direction')

    if (invalidParams.length > 0) {
      return reject(new APIParamInvalidError({
        invalidParams: invalidParams,
        endpoint: req.originalUrl,
        method: req.method,
        controllerFunction: getPageByCriteria.name,
        message: 'patient.params.invalid'
      }))
    }

    const limit = Number(req.query.limit)
    const skip = Number(req.query.skip)
    const criteria = req.query.criteria.trim()
      .split(/\s/)
      .map(word => `unaccent("name"."given") ilike unaccent('%${word}%') OR 
                    unaccent("name"."family") ilike unaccent('%${word}%') OR
                    "patient"."dni" ILIKE '%${word}%'`)
      .join(' OR ')
    const direction = req.query.direction > 0 ? 'DESC' : 'ASC'
    const order = []

    if (req.query.field === 'name') order.push([sequelize.literal('"name.family"'), direction])
    else order.push([req.query.field, direction])

    return resolve(Patient.findAll({
      include: [Telecom, {
        association: Patient.Family,
        include: [Name]
      }, {
        model: Contact,
        attributes: {exclude: ['createdAt', 'updatedAt']},
        include: [Telecom, Name]
      }, {
        model: PatientInsurance,
        attributes: {exclude: ['createdAt', 'updatedAt']},
        include: [Insurance]
      }, {
        model: Name,
        attributes: {exclude: ['createdAt', 'updatedAt']},
        where: sequelize.literal(`(${criteria})`)
      }, {
        model: Address,
        attributes: {exclude: ['createdAt', 'updatedAt']}
      }],
      offset: skip,
      limit: limit,
      order: order
    }))
  })
    .then(utils.handleEntityNotFound(res))
    .then(utils.respondWithResult(res))
    .catch(utils.handleError(res, req.requestId))
}

function createContacts (id, newContacts, transaction) {
  const promises = newContacts.map(contact => {
    contact.patientId = id

    Contact.create(contact, {include: [Name, Telecom], transaction: transaction})
  })

  return Promise.all(promises)
}

function updateContacts (changedContacts, transaction) {
  const promises = []

  for (let contact of changedContacts) {
    const telecomChanges = utils.deepClone(contact.telecomChanges)

    delete contact.telecomChanges
    delete contact.telecoms

    const contactPromise = Contact.update(contact, {where: {id: contact.id}, transaction: transaction})
    const namePromise = Name.update(contact.name, {where: {id: contact.name.id}, transaction: transaction})

    promises.push(contactPromise, namePromise)

    if (telecomChanges.added.length > 0) {
      for (let telecom of telecomChanges.added) {
        telecom.contactId = contact.id
      }

      promises.push(createTelecoms(telecomChanges.added, transaction))
    }

    if (telecomChanges.changed.length > 0) promises.push(updateTelecoms(telecomChanges.changed, transaction))
    if (telecomChanges.removed.length > 0) promises.push(removeTelecoms(telecomChanges.removed, transaction))
  }

  return Promise.all(promises)
}

function removeContacts (removedContacts, transaction) {
  const promises = removedContacts.map(contact => Contact.destroy({where: {id: contact.id}, transaction: transaction}))

  return Promise.all(promises)
}

function createTelecoms (newTelecoms, transaction) {
  const promises = newTelecoms.map(telecom => Telecom.create(telecom, {transaction: transaction}))

  return Promise.all(promises)
}

function updateTelecoms (changedTelecoms, transaction) {
  const promises = changedTelecoms.map(telecom => Telecom.update(telecom, {
    where: {id: telecom.id},
    transaction: transaction
  }))

  return Promise.all(promises)
}

function removeTelecoms (removedTelecoms, transaction) {
  const promises = removedTelecoms.map(telecom => Telecom.destroy({where: {id: telecom.id}, transaction: transaction}))

  return Promise.all(promises)
}

function setFamilyMembers (id, newMembers, transaction) {
  const promises = newMembers.map(familyMember => {
    const l = FAMILY.RELATIONSHIP.length - 1
    const index = FAMILY.RELATIONSHIP.indexOf(familyMember.familyMember.relationship)

    const sideA = Family.create({
      patientId: id,
      memberId: familyMember.id,
      relationship: FAMILY.RELATIONSHIP[l - index]
    }, {transaction: transaction})

    const sideB = Family.create({
      patientId: familyMember.id,
      memberId: id,
      relationship: familyMember.familyMember.relationship
    }, {transaction: transaction})

    return Promise.all([sideA, sideB])
  })

  return Promise.all(promises)
}

function updateFamilyMembers (id, updatedMembers, transaction) {
  const promises = updatedMembers.map(familyMember => {
    const l = FAMILY.RELATIONSHIP.length - 1
    const index = FAMILY.RELATIONSHIP.indexOf(familyMember.familyMember.relationship)

    const sideA = Family.update({relationship: FAMILY.RELATIONSHIP[l - index]}, {
      where: {
        memberId: familyMember.id,
        patientId: id
      },
      transaction: transaction
    })

    const sideB = Family.update({relationship: familyMember.familyMember.relationship}, {
      where: {
        memberId: id,
        patientId: familyMember.id
      },
      transaction: transaction
    })

    return Promise.all([sideA, sideB])
  })

  return Promise.all(promises)
}

function removeFamilyMembers (id, removedMembers, transaction) {
  const promises = removedMembers.map(familyMember => {
    const sideA = Family.destroy({
      where: {
        memberId: familyMember.id,
        patientId: id
      },
      transaction: transaction
    })

    const sideB = Family.destroy({
      where: {
        memberId: id,
        patientId: familyMember.id
      },
      transaction: transaction
    })

    return Promise.all([sideA, sideB])
  })

  return Promise.all(promises)
}

function isUniqueAsync (name, birthDate, dni, id) {
  const date = moment(birthDate)

  let where = `(SELECT date_part('year', "patient"."birthDate")) = ${date.year()} 
               AND (SELECT date_part('month', "patient"."birthDate")) = ${date.month() + 1} 
               AND (SELECT date_part('day', "patient"."birthDate")) = ${date.date()} 
               AND "patient"."dni" = '${dni}'`
  let literal = `unaccent("name"."given") = unaccent('${name.given}') 
                 AND unaccent("name"."family") = unaccent('${name.family}')`

  if (id != null) {
    where = where.concat(` AND "patient"."id" <> '${id}'`)
    literal = literal.concat(` AND "name"."patientId" <> '${id}'`)
  }

  return Patient.findAll({
    attributes: ['birthDate', 'dni'],
    where: sequelize.literal(where),
    include: [{
      model: Name,
      attributes: ['given', 'family'],
      where: sequelize.literal(literal)
    }]
  })
    .then(results => {
      if (results.length > 0) {
        throw new PatientNotUniqueError({
          given: name.given,
          family: name.family,
          birthDate: birthDate,
          dni: dni,
          id: id,
          entity: 'Patient',
          message: 'patient.notUnique'
        })
      }
    })
}
