
         'use strict'

      if (process.env.NODE_ENV === 'production') {
        module.exports = require('./f-ecs.cjs.production.js')
      } else {
        module.exports = require('./f-ecs.cjs.development.js')
      }