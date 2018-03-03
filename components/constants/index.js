'use strict'

export default {
  SNOMED: {
    TYPES: {
      RELATIONSHIP: {IS_A: {id: '116680003'}},
      DESCRIPTION: {
        FSN: {id: '900000000000003001'},
        SYNONYM: {id: '900000000000013009'},
        DEFINITION: {id: '900000000000550004'}
      }
    },
    HIERARCHY: {
      BODY_STRUCTURE: {id: '123037004'},
      FINDING: {
        id: '404684003',
        DISORDER: {
          id: '64572001',
          ALLERGY: {id: '609328004'}
        }
      },
      ENVIRONMENT_LOCATION: {id: '308916002'},
      EVENT: {id: '272379006'},
      OBSERVABLE_ENTITY: {id: '363787002'},
      ORGANISM: {id: '410607006'},
      PHYSICAL_FORCE: {id: '78621006'},
      PHYSICAL_OBJECT: {id: '260787004'},
      PROCEDURE: {id: '71388002'},
      QUALIFIER_VALUE: {id: '362981000'},
      RECORD_ARTIFACT: {id: '419891008'},
      SITUATION: {id: '243796009'},
      SOCIAL_CONTEXT: {id: '48176007'},
      SPECIMEN: {id: '123038009'},
      STAGING: {id: '254291000'},
      SUBSTANCE: {id: '105590001'}
    }
  }
}
