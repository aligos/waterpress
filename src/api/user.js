//libs
const hasher = require('wordpress-hash-node')

//util
import {
  includes,
  assign,
  eachKey,
  findValue,
  forEach,
  has,
  makeObject,
  merge,

} from '../core/util'

//:: reference
/*
 * wp_capabilities:
 * ----------------
 * a:1:{s:10:"subscriber";b:1;} - Subscriber
 * a:1:{s:11:"contributor";b:1;} - Contributor
 * a:1:{s:6:"author";b:1;} - Author
 * a:1:{s:6:"editor";b:1;} - Editor
 * a:1:{s:13:"administrator";b:1;} - Administrator
 *
 * wp_user_level:
 * --------------
 * 0 - Subscriber
 * 1 - Contributor
 * 2 - Author
 * 3 - Editor
 * 4 - Administrator
 *
 * meta fields:
 * ------------
 * nickname
 * first_name
 * last_name
 * description
 * wp_user_level
 * wp_capabilities
 *
 * */

//methods

let find = function (params, cb, next) {
  if (this.collections) {
    this.collections
      .user
      .findWithMeta(params, (e, userArr)=> {
        cb(e, userArr, next)
      })
  } else {
    cb('Not connected', null, next)
  }
}
let one = function (params, cb, next) {
  if (this.collections) {
    this.collections
      .user
      .findOneWithMeta(params, (err, user)=> {
        cb(err, user, next)
      })
  } else {
    cb('Not connected', null, next)
  }
}
let byRole = function (roleName, cb, next) {
  if (this.collections) {
    this.collections
      .usermeta
      .find()
      .where({key: 'wp_capabilities', value: {'contains': roleName}})
      .exec((err, meta)=> {
        let userIdArr = []
        if (meta) {
          meta.map((item)=> {
            userIdArr.push(item.user)
          })
          this.collections
            .user
            .findWithMeta({id: userIdArr}, (e, userArr)=> {
              cb(e, userArr, next)
            })
        } else {
          cb(err, null, next)
        }
      })
  } else {
    cb('Not connected', null, next)
  }
}
let existsByEmail = function (email, cb, next) {
  one.call(this, {email}, function (err, user) {
    let result = false
    if (user) result = true
    cb(err, result, next)
  })
}
let save = function (userObj, cb, next) {
  if (this.collections) {
    let { id, email } = userObj
    const updateAction = ()=> {
      this.collections
        .user
        .update({id}, userObj)
        .exec((e, users)=> {
          //TODO: validate the response before callback
          let resultUser = undefined
          if (Array.isArray(users)) {
            if (users.length > 0) {
              resultUser = users[0]
            }
          }
          cb(e, resultUser, next)

        })
    }
    const createAction = ()=> {
      this.collections
        .user
        .create(userObj)
        .exec((e, user)=> {
          //TODO: validate the response before callback
          cb(e, user, next)
        })
    }

    this.collections
      .user
      .findOne({email}, (err, user)=> {
        if (user) {
          updateAction()
        } else {
          createAction()
        }
      })

  } else {
    cb('Not connected', null, next)
  }
}
let checkLogin = function (email, password, cb, next) {
  if (this.collections) {
    let hash = hasher.HashPassword(password)
    this.collections
      .user
      .findOne({email, password: hash}, (err, user)=> {
        cb(err, user, next)
      })
  } else {
    cb('Not connected', null, next)
  }
}

//api export
export default {
  find,
  one,
  byRole,
  existsByEmail,
  save,
  checkLogin,
}
