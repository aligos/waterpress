import pluginUtils from '../core/util'
import dataTools from '../assemblers/dataTools'
import striptags from 'striptags'
import truncate from 'html-truncate'
const hasher = require('wordpress-hash-node')
const generatePassword = require('password-generator')
const slugger = require('slug')
import expressUtils from './expressUtils'

export default {
  pluginUtils,
  dataTools,
  striptags,
  truncate,
  hasher,
  generatePassword,
  slugger,
  expressUtils,
}
