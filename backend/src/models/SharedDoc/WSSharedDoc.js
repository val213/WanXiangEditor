const Y = require('yjs');
const syncProtocol = require('y-protocols/dist/sync.cjs');
const awarenessProtocol = require('y-protocols/dist/awareness.cjs');
const encoding = require('lib0/dist/encoding.cjs');
const decoding = require('lib0/dist/decoding.cjs');
const map = require('lib0/dist/map.cjs');
const ConnectionStatus = require('tsrpc');

// 是否启用垃圾回收
const gcEnabled = process.env.GC !== 'false' && process.env.GC !== '0';

// // 用于存储持久化对象
// let persistence: IPersistence | null = null;

// // 设置持久化对象
// export const setPersistence = (persistence_: IPersistence) => {
// 	persistence = persistence_;
// };

// // 获取持久化对象
// export const getPersistence = () => persistence;

// 文档集合
export const docs = new Map();

// 两种消息类型
const messageSync = 0; // 同步更新 
const messageAwareness = 1; // 意识状态更新
// const messageAuth = 2

class WSSharedDoc extends Y.Doc {
	constructor(name) {
		super({ gc: gcEnabled });
		this.name = name; // 文档名称
		this.conns = new Map(); // 连接到文档的客户端集合
		this.awareness = new awarenessProtocol.Awareness(this); // 跟踪其他用户的光标位置、选择区域
		this.awareness.setLocalState(null);

		// 处理awareness状态的变化
		// 会根据变化的客户端ID更新连接的客户端集合
		// 然后，将awareness状态通过WebSocket更新广播给所有连接的客户端
		const awarenessChangeHandler = (
			{
				added, // 新增的客户端ID
				updated, // 更新的客户端ID
				removed, // 移除的客户端ID
			},
			conn // 表示触发awareness状态变化的连接对象
		) => {
			// 合并了所有发生变化的客户端ID
			const changedClients = added.concat(updated, removed);
			if (conn !== null) { // 如果conn不为空，说明是某个连接触发了awareness状态变化，需要更新对应连接的客户端集合
				const connControlledIDs = /** @type {Set<number>} */ this.conns.get(conn);
				if (connControlledIDs !== undefined) {
					added.forEach((clientID) => {
						connControlledIDs.add(clientID);
					});
					removed.forEach((clientID) => {
						connControlledIDs.delete(clientID);
					});
				}
			}
			// 广播awareness状态更新
			// 创建一个编码器
			const encoder = encoding.createEncoder();
			// 编码同步消息的类型，将messageAwareness编码到编码器中，表示这是一个awareness更新消息
			encoding.writeVarUint(encoder, messageAwareness);
			// 将awareness状态更新编码为二进制数据，并将结果写入编码器中
			encoding.writeVarUint8Array(
				encoder,
				awarenessProtocol.encodeAwarenessUpdate(this.awareness, changedClients),
			);
			// 二进制数据转换为Uint8Array类型，并存储在buff变量中
			const buff = encoding.toUint8Array(encoder);
			// 遍历文档对象的所有连接，并将更新广播给所有连接客户端
			this.conns.forEach((_, conn) => {
				send(this, conn, buff);
			});
		};
		// 注册了awareness变化的事件监听器
		this.awareness.on('update', awarenessChangeHandler);

		// 注册了文档变化的事件监听器
		this.on('update', updateHandler);
	}
}

// 更新处理函数：接收到更新操作后，将其编码为二进制格式的消息，并通过WebSocket发送给客户端
// update: 表示接收到的更新操作，以Uint8Array类型存储
// origin: 表示更新操作的来源，可以是任意类型的数据（注意：暂时好像没用到）
const updateHandler = (update, origin, doc) => {
	// 创建一个编码器，用于将更新操作编码为二进制数据
	const encoder = encoding.createEncoder();
	// 编码同步消息的类型，将messageSync编码到编码器中，表示这是一个同步更新消息
	encoding.writeVarUint(encoder, messageSync);
	// 编码更新操作，将接收到的更新操作update编码到编码器中，这个操作会将更新操作转换为二进制数据，以便在网络上传输
	syncProtocol.writeUpdate(encoder, update);
	// 转换为Uint8Array类型
	const message = encoding.toUint8Array(encoder);
	// 发送更新消息
	doc.conns.forEach((_, conn) => send(doc, conn, message));
};

// 用于向客户端发送消息
const send = (doc, conn, updatedDoc) => {
	console.log('发送消息时连接状态： ', conn.status);
	if (conn.status !== 'OPENED') { // 如果不是打开状态就关闭
		closeConn(doc, conn);
	}
	try {
		conn.sendMsg("SharedDoc/UpdateDoc", {
			updatedDoc: updatedDoc,
		});
	} catch (e) {
		closeConn(doc, conn);
	}
};

// 用于关闭与客户端的连接
const closeConn = (doc, conn) => {
	console.log('关闭与客户端的连接');
	if (doc.conns.has(conn)) {
		const controlledIds = doc.conns.get(conn);
		doc.conns.delete(conn);
		if (controlledIds) {
			awarenessProtocol.removeAwarenessStates(doc.awareness, Array.from(controlledIds), null);
		}
		// if (doc.conns.size === 0 && persistence !== null) {
		// 	// if persisted, we store state and destroy ydocument
		// 	persistence.writeState(doc.name, doc).then(() => {
		// 		doc.destroy();
		// 	});
		// 	docs.delete(doc.name);
		// }
	}
	conn.close();
};


// 用于获取具有给定名称的文档对象，无论是在内存还是磁盘上
export const getYDoc = (docname, gc = true) =>  
	// 根据文档名称从docs中获取文档对象，如果不存在，则创建一个新的文档对象
	map.setIfUndefined(docs, docname, () => {
		const doc = new WSSharedDoc(docname);
		doc.gc = gc;
		// if (persistence !== null) { // 如果存在持久化对象，则绑定文档状态
		// 	persistence.bindState(docname, doc);
		// }
		docs.set(docname, doc);
		return doc;
	});

// 用于处理从客户端接收到的信息
export const messageListener = (conn, doc, message) => {
	try {
		const encoder = encoding.createEncoder(); // 编码器
		const decoder = decoding.createDecoder(message); // 解码器
		const messageType = decoding.readVarUint(decoder); // 消息类型
		switch (messageType) {
			case messageSync:
				encoding.writeVarUint(encoder, messageSync);
				// 解析并处理同步消息
				syncProtocol.readSyncMessage(decoder, encoder, doc, conn);
				// 如果encoder中包含了除了消息类型外的其他消息内容，则将其转换为Uint8Array
				// 并使用send发送消息给连接的客户端
				if (encoding.length(encoder) > 1) {
					send(doc, conn, encoding.toUint8Array(encoder));
				}
				break;
			case messageAwareness: {
				// 从解码器中读取awareness状态更新消息
				awarenessProtocol.applyAwarenessUpdate(
					doc.awareness,
					decoding.readVarUint8Array(decoder),
					conn,
				);
				break;
			}
		}
	} catch (err) {
		console.error(err);
	}
};

// const pingTimeout = 30000;

// 在连接建立时，首先发送同步消息的第一步，并向连接发送文档对象的awareness状态更新消息
export const setupWSConnection = (doc, conn) => {
	// let pongReceived = true;
	// const pingInterval = setInterval(() => {
	// 	if (!pongReceived) {
	// 		if (doc.conns.has(conn)) {
	// 			closeConn(doc, conn);
	// 		}
	// 		clearInterval(pingInterval);
	// 	} else if (doc.conns.has(conn)) {
	// 		pongReceived = false;
	// 		try {
	// 			conn.ping();
	// 		} catch (e) {
	// 			closeConn(doc, conn);
	// 			clearInterval(pingInterval);
	// 		}
	// 	}
	// }, pingTimeout);
	// conn.on('close', () => {
	// 	closeConn(doc, conn);
	// 	clearInterval(pingInterval);
	// });
	// conn.on('pong', () => {
	// 	pongReceived = true;
	// });

    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, messageSync);
    // syncProtocol.writeSyncStep1(encoder, doc);
    send(doc, conn, encoding.toUint8Array(encoder));
    const awarenessStates = doc.awareness.getStates();
    if (awarenessStates.size > 0) {
        const encoder = encoding.createEncoder();
        encoding.writeVarUint(encoder, messageAwareness);
        encoding.writeVarUint8Array(
            encoder,
            awarenessProtocol.encodeAwarenessUpdate(doc.awareness, Array.from(awarenessStates.keys())),
        );
        send(doc, conn, encoding.toUint8Array(encoder));
    }
}