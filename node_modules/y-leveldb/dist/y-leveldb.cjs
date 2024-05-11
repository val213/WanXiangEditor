'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Y = require('yjs');
var encoding = require('lib0/dist/encoding.cjs');
var decoding = require('lib0/dist/decoding.cjs');
var binary = require('lib0/dist/binary.cjs');
var promise = require('lib0/dist/promise.cjs');
var buffer$1 = require('lib0/dist/buffer.cjs');
var defaultLevel = require('level');
var buffer = require('buffer');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}

var Y__namespace = /*#__PURE__*/_interopNamespace(Y);
var encoding__namespace = /*#__PURE__*/_interopNamespace(encoding);
var decoding__namespace = /*#__PURE__*/_interopNamespace(decoding);
var binary__namespace = /*#__PURE__*/_interopNamespace(binary);
var promise__namespace = /*#__PURE__*/_interopNamespace(promise);
var buffer__namespace = /*#__PURE__*/_interopNamespace(buffer$1);
var defaultLevel__default = /*#__PURE__*/_interopDefaultLegacy(defaultLevel);

const PREFERRED_TRIM_SIZE = 500;

const YEncodingString = 0;
const YEncodingUint32 = 1;

const valueEncoding = {
  buffer: true,
  type: 'y-value',
  encode: /** @param {any} data */ data => data,
  decode: /** @param {any} data */ data => data
};

/**
 * Write two bytes as an unsigned integer in big endian order.
 * (most significant byte first)
 *
 * @function
 * @param {encoding.Encoder} encoder
 * @param {number} num The number that is to be encoded.
 */
const writeUint32BigEndian = (encoder, num) => {
  for (let i = 3; i >= 0; i--) {
    encoding__namespace.write(encoder, (num >>> (8 * i)) & binary__namespace.BITS8);
  }
};

/**
 * Read 4 bytes as unsigned integer in big endian order.
 * (most significant byte first)
 *
 * @todo use lib0/decoding instead
 *
 * @function
 * @param {decoding.Decoder} decoder
 * @return {number} An unsigned integer.
 */
const readUint32BigEndian = decoder => {
  const uint =
    (decoder.arr[decoder.pos + 3] +
    (decoder.arr[decoder.pos + 2] << 8) +
    (decoder.arr[decoder.pos + 1] << 16) +
    (decoder.arr[decoder.pos] << 24)) >>> 0;
  decoder.pos += 4;
  return uint
};

const keyEncoding = {
  buffer: true,
  type: 'y-keys',
  /* istanbul ignore next */
  encode: /** @param {Array<string|number>} arr */  arr => {
    const encoder = encoding__namespace.createEncoder();
    for (let i = 0; i < arr.length; i++) {
      const v = arr[i];
      if (typeof v === 'string') {
        encoding__namespace.writeUint8(encoder, YEncodingString);
        encoding__namespace.writeVarString(encoder, v);
      } else /* istanbul ignore else */ if (typeof v === 'number') {
        encoding__namespace.writeUint8(encoder, YEncodingUint32);
        writeUint32BigEndian(encoder, v);
      } else {
        throw new Error('Unexpected key value')
      }
    }
    return buffer.Buffer.from(encoding__namespace.toUint8Array(encoder))
  },
  decode: /** @param {Uint8Array} buf */ buf => {
    const decoder = decoding__namespace.createDecoder(buf);
    const key = [];
    while (decoding__namespace.hasContent(decoder)) {
      switch (decoding__namespace.readUint8(decoder)) {
        case YEncodingString:
          key.push(decoding__namespace.readVarString(decoder));
          break
        case YEncodingUint32:
          key.push(readUint32BigEndian(decoder));
          break
      }
    }
    return key
  }
};

/**
 * level returns an error if a value is not found.
 *
 * This helper method for level returns `null` instead if the key is not found.
 *
 * @param {any} db
 * @param {any} key
 */
const levelGet = async (db, key) => {
  let res;
  try {
    res = await db.get(key);
  } catch (err) {
    /* istanbul ignore else */
    if (err.notFound) {
      return null
    } else {
      throw err
    }
  }
  return res
};

/**
 * Level expects a Buffer, but in Yjs we typically work with Uint8Arrays.
 *
 * Since Level thinks that these are two entirely different things,
 * we transform the Uint8array to a Buffer before storing it.
 *
 * @param {any} db
 * @param {any} key
 * @param {Uint8Array} val
 */
const levelPut = async (db, key, val) => db.put(key, buffer.Buffer.from(val));

/**
 * A "bulkier" implementation of level streams. Returns the result in one flush.
 *
 * @param {any} db
 * @param {object} opts
 * @return {Promise<Array<any>>}
 */
const getLevelBulkData = (db, opts) => promise__namespace.create((resolve, reject) => {
  /**
   * @type {Array<any>} result
   */
  const result = [];
  db.createReadStream(
    opts
  ).on('data', /** @param {any} data */ data =>
    result.push(data)
  ).on('end', () =>
    resolve(result)
  ).on('error', reject);
});

/**
 * Get all document updates for a specific document.
 *
 * @param {any} db
 * @param {string} docName
 * @param {any} [opts]
 * @return {Promise<Array<Buffer>>}
 */
const getLevelUpdates = (db, docName, opts = { values: true, keys: false }) => getLevelBulkData(db, {
  gte: createDocumentUpdateKey(docName, 0),
  lt: createDocumentUpdateKey(docName, binary__namespace.BITS32),
  ...opts
});

/**
 * Get all document updates for a specific document.
 *
 * @param {any} db
 * @param {boolean} values
 * @param {boolean} keys
 * @return {Promise<Array<any>>}
 */
const getAllDocs = (db, values, keys) => getLevelBulkData(db, {
  gte: ['v1_sv'],
  lt: ['v1_sw'],
  keys,
  values
});

/**
 * @param {any} db
 * @param {string} docName
 * @return {Promise<number>} Returns -1 if this document doesn't exist yet
 */
const getCurrentUpdateClock = (db, docName) => getLevelUpdates(db, docName, { keys: true, values: false, reverse: true, limit: 1 }).then(keys => {
  if (keys.length === 0) {
    return -1
  } else {
    return keys[0][3]
  }
});

/**
 * @param {any} db
 * @param {Array<string|number>} gte Greater than or equal
 * @param {Array<string|number>} lt lower than (not equal)
 * @return {Promise<void>}
 */
const clearRange = async (db, gte, lt) => {
  /* istanbul ignore else */
  if (db.supports.clear) {
    await db.clear({ gte, lt });
  } else {
    const keys = await getLevelBulkData(db, { values: false, keys: true, gte, lt });
    const ops = keys.map(key => ({ type: 'del', key }));
    await db.batch(ops);
  }
};

/**
 * @param {any} db
 * @param {string} docName
 * @param {number} from Greater than or equal
 * @param {number} to lower than (not equal)
 * @return {Promise<void>}
 */
const clearUpdatesRange = async (db, docName, from, to) => clearRange(db, createDocumentUpdateKey(docName, from), createDocumentUpdateKey(docName, to));

/**
 * Create a unique key for a update message.
 * We encode the result using `keyEncoding` which expects an array.
 *
 * @param {string} docName
 * @param {number} clock must be unique
 * @return {Array<string|number>}
 */
const createDocumentUpdateKey = (docName, clock) => ['v1', docName, 'update', clock];

/**
 * @param {string} docName
 * @param {string} metaKey
 */
const createDocumentMetaKey = (docName, metaKey) => ['v1', docName, 'meta', metaKey];

/**
 * @param {string} docName
 */
const createDocumentMetaEndKey = (docName) => ['v1', docName, 'metb']; // simple trick

/**
 * We have a separate state vector key so we can iterate efficiently over all documents
 * @param {string} docName
 */
const createDocumentStateVectorKey = (docName) => ['v1_sv', docName];

/**
 * @param {string} docName
 */
const createDocumentFirstKey = (docName) => ['v1', docName];

/**
 * We use this key as the upper limit of all keys that can be written.
 * Make sure that all document keys are smaller! Strings are encoded using varLength string encoding,
 * so we need to make sure that this key has the biggest size!
 *
 * @param {string} docName
 */
const createDocumentLastKey = (docName) => ['v1', docName, 'zzzzzzz'];

// const emptyStateVector = (() => Y.encodeStateVector(new Y.Doc()))()

/**
 * For now this is a helper method that creates a Y.Doc and then re-encodes a document update.
 * In the future this will be handled by Yjs without creating a Y.Doc (constant memory consumption).
 *
 * @param {Array<Uint8Array>} updates
 * @return {{update:Uint8Array, sv: Uint8Array}}
 */
const mergeUpdates = (updates) => {
  const ydoc = new Y__namespace.Doc();
  ydoc.transact(() => {
    for (let i = 0; i < updates.length; i++) {
      Y__namespace.applyUpdate(ydoc, updates[i]);
    }
  });
  return { update: Y__namespace.encodeStateAsUpdate(ydoc), sv: Y__namespace.encodeStateVector(ydoc) }
};

/**
 * @param {any} db
 * @param {string} docName
 * @param {Uint8Array} sv state vector
 * @param {number} clock current clock of the document so we can determine when this statevector was created
 */
const writeStateVector = async (db, docName, sv, clock) => {
  const encoder = encoding__namespace.createEncoder();
  encoding__namespace.writeVarUint(encoder, clock);
  encoding__namespace.writeVarUint8Array(encoder, sv);
  await levelPut(db, createDocumentStateVectorKey(docName), encoding__namespace.toUint8Array(encoder));
};

/**
 * @param {Uint8Array} buf
 * @return {{ sv: Uint8Array, clock: number }}
 */
const decodeLeveldbStateVector = buf => {
  const decoder = decoding__namespace.createDecoder(buf);
  const clock = decoding__namespace.readVarUint(decoder);
  const sv = decoding__namespace.readVarUint8Array(decoder);
  return { sv, clock }
};

/**
 * @param {any} db
 * @param {string} docName
 */
const readStateVector = async (db, docName) => {
  const buf = await levelGet(db, createDocumentStateVectorKey(docName));
  if (buf === null) {
    // no state vector created yet or no document exists
    return { sv: null, clock: -1 }
  }
  return decodeLeveldbStateVector(buf)
};

/**
 * @param {any} db
 * @param {string} docName
 * @param {Uint8Array} stateAsUpdate
 * @param {Uint8Array} stateVector
 * @return {Promise<number>} returns the clock of the flushed doc
 */
const flushDocument = async (db, docName, stateAsUpdate, stateVector) => {
  const clock = await storeUpdate(db, docName, stateAsUpdate);
  await writeStateVector(db, docName, stateVector, clock);
  await clearUpdatesRange(db, docName, 0, clock); // intentionally not waiting for the promise to resolve!
  return clock
};

/**
 * @param {any} db
 * @param {string} docName
 * @param {Uint8Array} update
 * @return {Promise<number>} Returns the clock of the stored update
 */
const storeUpdate = async (db, docName, update) => {
  const clock = await getCurrentUpdateClock(db, docName);
  if (clock === -1) {
    // make sure that a state vector is aways written, so we can search for available documents
    const ydoc = new Y__namespace.Doc();
    Y__namespace.applyUpdate(ydoc, update);
    const sv = Y__namespace.encodeStateVector(ydoc);
    await writeStateVector(db, docName, sv, 0);
  }
  await levelPut(db, createDocumentUpdateKey(docName, clock + 1), update);
  return clock + 1
};

class LeveldbPersistence {
  /**
   * @param {string} location
   * @param {object} [opts]
   * @param {any} [opts.level] Level-compatible adapter. E.g. leveldown, level-rem, level-indexeddb. Defaults to `level`
   * @param {object} [opts.levelOptions] Options that are passed down to the level instance
   */
  constructor (location, /* istanbul ignore next */ { level = defaultLevel__default["default"], levelOptions = {} } = {}) {
    const db = level(location, { ...levelOptions, valueEncoding, keyEncoding });
    this.tr = promise__namespace.resolve();
    /**
     * Execute an transaction on a database. This will ensure that other processes are currently not writing.
     *
     * This is a private method and might change in the future.
     *
     * @todo only transact on the same room-name. Allow for concurrency of different rooms.
     *
     * @template T
     *
     * @param {function(any):Promise<T>} f A transaction that receives the db object
     * @return {Promise<T>}
     */
    this._transact = f => {
      const currTr = this.tr;
      this.tr = (async () => {
        await currTr;
        let res = /** @type {any} */ (null);
        try {
          res = await f(db);
        } catch (err) {
          /* istanbul ignore next */
          console.warn('Error during y-leveldb transaction', err);
        }
        return res
      })();
      return this.tr
    };
  }

  /**
   * @param {string} docName
   */
  flushDocument (docName) {
    return this._transact(async db => {
      const updates = await getLevelUpdates(db, docName);
      const { update, sv } = mergeUpdates(updates);
      await flushDocument(db, docName, update, sv);
    })
  }

  /**
   * @param {string} docName
   * @return {Promise<Y.Doc>}
   */
  getYDoc (docName) {
    return this._transact(async db => {
      const updates = await getLevelUpdates(db, docName);
      const ydoc = new Y__namespace.Doc();
      ydoc.transact(() => {
        for (let i = 0; i < updates.length; i++) {
          Y__namespace.applyUpdate(ydoc, updates[i]);
        }
      });
      if (updates.length > PREFERRED_TRIM_SIZE) {
        await flushDocument(db, docName, Y__namespace.encodeStateAsUpdate(ydoc), Y__namespace.encodeStateVector(ydoc));
      }
      return ydoc
    })
  }

  /**
   * @param {string} docName
   * @return {Promise<Uint8Array>}
   */
  getStateVector (docName) {
    return this._transact(async db => {
      const { clock, sv } = await readStateVector(db, docName);
      let curClock = -1;
      if (sv !== null) {
        curClock = await getCurrentUpdateClock(db, docName);
      }
      if (sv !== null && clock === curClock) {
        return sv
      } else {
        // current state vector is outdated
        const updates = await getLevelUpdates(db, docName);
        const { update, sv } = mergeUpdates(updates);
        await flushDocument(db, docName, update, sv);
        return sv
      }
    })
  }

  /**
   * @param {string} docName
   * @param {Uint8Array} update
   * @return {Promise<number>} Returns the clock of the stored update
   */
  storeUpdate (docName, update) {
    return this._transact(db => storeUpdate(db, docName, update))
  }

  /**
   * @param {string} docName
   * @param {Uint8Array} stateVector
   */
  async getDiff (docName, stateVector) {
    const ydoc = await this.getYDoc(docName);
    return Y__namespace.encodeStateAsUpdate(ydoc, stateVector)
  }

  /**
   * @param {string} docName
   * @return {Promise<void>}
   */
  clearDocument (docName) {
    return this._transact(async db => {
      await db.del(createDocumentStateVectorKey(docName));
      await clearRange(db, createDocumentFirstKey(docName), createDocumentLastKey(docName));
    })
  }

  /**
   * @param {string} docName
   * @param {string} metaKey
   * @param {any} value
   * @return {Promise<void>}
   */
  setMeta (docName, metaKey, value) {
    return this._transact(db => levelPut(db, createDocumentMetaKey(docName, metaKey), buffer__namespace.encodeAny(value)))
  }

  /**
   * @param {string} docName
   * @param {string} metaKey
   * @return {Promise<any>}
   */
  delMeta (docName, metaKey) {
    return this._transact(db => db.del(createDocumentMetaKey(docName, metaKey)))
  }

  /**
   * @param {string} docName
   * @param {string} metaKey
   * @return {Promise<any>}
   */
  getMeta (docName, metaKey) {
    return this._transact(async db => {
      const res = await levelGet(db, createDocumentMetaKey(docName, metaKey));
      if (res === null) {
        return// return void
      }
      return buffer__namespace.decodeAny(res)
    })
  }

  /**
   * @return {Promise<Array<string>>}
   */
  getAllDocNames () {
    return this._transact(async db => {
      const docKeys = await getAllDocs(db, false, true);
      return docKeys.map(key => key[1])
    })
  }

  /**
   * @return {Promise<Array<{ name: string, sv: Uint8Array, clock: number }>>}
   */
  getAllDocStateVectors () {
    return this._transact(async db => {
      const docs = /** @type {any} */ (await getAllDocs(db, true, true));
      return docs.map(doc => {
        const { sv, clock } = decodeLeveldbStateVector(doc.value);
        return { name: doc.key[1], sv, clock }
      })
    })
  }

  /**
   * @param {string} docName
   * @return {Promise<Map<string, any>>}
   */
  getMetas (docName) {
    return this._transact(async db => {
      const data = await getLevelBulkData(db, {
        gte: createDocumentMetaKey(docName, ''),
        lt: createDocumentMetaEndKey(docName),
        keys: true,
        values: true
      });
      const metas = new Map();
      data.forEach(v => { metas.set(v.key[3], buffer__namespace.decodeAny(v.value)); });
      return metas
    })
  }

  /**
   * Close connection to a leveldb database and discard all state and bindings
   *
   * @return {Promise<void>}
   */
  destroy () {
    return this._transact(db => db.close())
  }

  /**
   * Delete all data in database.
   */
  clearAll () {
    return this._transact(async db => db.clear())
  }
}

exports.LeveldbPersistence = LeveldbPersistence;
exports.PREFERRED_TRIM_SIZE = PREFERRED_TRIM_SIZE;
exports.getAllDocs = getAllDocs;
exports.getCurrentUpdateClock = getCurrentUpdateClock;
exports.getLevelBulkData = getLevelBulkData;
exports.getLevelUpdates = getLevelUpdates;
exports.keyEncoding = keyEncoding;
exports.readUint32BigEndian = readUint32BigEndian;
exports.writeUint32BigEndian = writeUint32BigEndian;
//# sourceMappingURL=y-leveldb.cjs.map
