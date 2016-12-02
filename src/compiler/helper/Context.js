
import * as env from '../../config/env'
import * as array from '../../util/array'
import * as object from '../../util/object'

export default class Context {

  /**
   * @param {Object} data
   * @param {?Context} parent
   */
  constructor(data, parent) {
    let instance = this
    instance.data = data
    instance.parent = parent
    instance.used = [ ]
    let cache = instance.cache = { }
    cache[env.THIS] = data
  }

  push(data) {
    return new Context(data, this)
  }

  set(keypath, value) {
    let { data, cache } = this
    if (object.has(cache, keypath)) {
      delete cache[keypath]
    }
    object.set(data, keypath, value)
  }

  get(keypath) {

    let instance = this
    let { cache, used } = instance
    if (!object.has(cache, keypath)) {
      let result
      while (instance) {
        result = object.get(instance.data, keypath)
        if (result) {
          cache[keypath] = result.value
          break
        }
        else {
          instance = instance.parent
        }
      }
    }

    if (!array.has(used, keypath)) {
      used.push(keypath)
    }

    return cache[keypath]

  }
}
