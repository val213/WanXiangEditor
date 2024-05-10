// @ts-nocheck
/**
 * @module bindings/textarea
 */

import { createMutex } from 'lib0/mutex'
import * as math from 'lib0/math'
import * as Y from 'yjs'
import * as func from 'lib0/function'
import * as eventloop from 'lib0/eventloop'
import { Observable } from 'lib0/observable'
import * as diff from 'lib0/diff'
import CodeMirror from 'codemirror'

export const cmOrigin = 'y-codemirror'

/**
 * 观察文本类型的变化并在编辑器中进行相应的更新操作
 * @param {CodemirrorBinding} binding
 * @param {any} event
 */
const typeObserver = (binding, event) => {
  binding._mux(() => {
    // 获取与绑定相关联的CodeMirror文档对象
    const cmDoc = binding.cmDoc
    // 从文档对象中获取与之关联的CodeMirror编辑器实例
    const cm = cmDoc.getEditor()

    // 首先获取当前光标的锚点位置和头部位置，然后根据条件判断是否需要将它们进行交换
    // 确保锚点位置小于头部位置
    let anchor = cm.indexFromPos(cm.getCursor('anchor'))
    let head = cm.indexFromPos(cm.getCursor('head'))
    const switchSel = head < anchor
    // normalize selection so that anchor < head, switch back later
    if (switchSel) {
      const tmp = head
      head = anchor
      anchor = tmp
    }
    // 执行实际的文本变更操作。
    const performChange = () => {
      const delta = event.delta
      let index = 0
      for (let i = 0; i < event.delta.length; i++) {
        const d = delta[i]
        if (d.retain) { // 保留原有的文本
          index += d.retain
        } else if (d.insert) { // 插入新的文本
          if (index < anchor || (anchor < head && index === anchor)) {
            anchor += d.insert.length
          }
          if (index < head) { 
            head += d.insert.length
          }
          const pos = cmDoc.posFromIndex(index)
          cmDoc.replaceRange(d.insert, pos, pos, cmOrigin)
          index += d.insert.length
        } else if (d.delete) {// 删除文本
          if (index < anchor) {
            anchor = math.max(anchor - d.delete, index)
          }
          if (index < head) {
            head = math.max(head - d.delete, index)
          }
          const start = cmDoc.posFromIndex(index)
          const end = cmDoc.posFromIndex(index + d.delete)
          // 在相应范围内删除文本
          cmDoc.replaceRange('', start, end, cmOrigin)
        }
      }
    }
    
    // 如果存在编辑器实例，则使用cm.operation方法执行文本变更操作
    // 该方法会在单个操作中捆绑多个编辑操作，以提高性能
    if (cm) {
      cm.operation(performChange)
    } else {
      performChange()
    }
    if (switchSel) {
      const tmp = head
      head = anchor
      anchor = tmp
    }
    // 更新编辑器的选择区域
    // scorll：是否将文本选择区域滚动到可见区域内
    cm.setSelection(cm.posFromIndex(anchor), cm.posFromIndex(head), {
      scroll: false
    })
  })
}

/**
 * 观察CodeMirror编辑器中的变化并将这些变化同步到YJS文本类型中
 * @param {CodemirrorBinding} binding
 * @param {Array<any>} changes
 */
const targetObserver = (binding, changes) => {
  binding._mux(() => {
    // 对共享文档的每个更改都发生在一个事件流程中。观察者调用和更新事务是在每个事件流程后
    // 应该将更改放到单个事件流程以降低事件调用的数量
    binding.doc.transact(() => {
      const hasPaste = binding.yUndoManager &&
        changes.some((change) => change.origin === 'paste')
      if (hasPaste) { // 如果有粘贴操作。会调用binding.yUndoManager.startCapturing()方法
        // 以避免将粘贴操作视为单个操作。
        binding.yUndoManager.stopCapturing()
      }

      if (changes.length > 1) {
        // 如果有多个连续的变化，则无法可靠地计算位置
        // 因此采用了计算差异并应用变化的方式
        const d = diff.simpleDiffString(
          binding.type.toString(),
          binding.cmDoc.getValue()
        )
        binding.type.delete(d.index, d.remove)
        binding.type.insert(d.index, d.insert)
      } else { // 如果只有一个变化操作，则根据变化的具体内容执行相应的删除和插入操作，将变化同步到YJS文本类型中
        const change = changes[0]
        const start = binding.cmDoc.indexFromPos(change.from)
        const delLen = change.removed.map((s) => s.length).reduce(math.add) +
          change.removed.length - 1
        if (delLen > 0) {
          binding.type.delete(start, delLen)
        }
        if (change.text.length > 0) {
          binding.type.insert(start, change.text.join('\n'))
        }
      }

      if (hasPaste) {
        binding.yUndoManager.stopCapturing()
      }
    }, binding)
  })
  // 检测到光标事件时，触发cursorActivity事件
  if (binding._pendingCursorEvent) {
    binding._pendingCursorEvent = false
    binding.emit('cursorActivity', [binding])
  }
}

// 创建一个表示远程光标的HTML元素，并设置其样式和行为
// username：用户名    color：光标颜色
const createRemoteCaret = (username, color) => {
  // 创建一个<span>元素，用于表示光标
  // <span>元素：是HTML中的一个行内元素，用于再文档中标记或包裹文本内容，通常用于设置特定样式或应用脚本操作
  const caret = document.createElement('span')
  // 给<span>元素添加类名remote-caret，用于表示远程光标
  caret.classList.add('remote-caret')
  // 设置<span>元素的样式，设置边框颜色
  caret.setAttribute('style', `border-color: ${color}`)
  // 创建一个<div>元素，用于表示用户信息
  const userDiv = document.createElement('div')
  // 设置<div>元素的样式，设置背景颜色
  userDiv.setAttribute('style', `background-color: ${color}`)
  // 在<div>元素中添加文本节点，用于显示用户名
  userDiv.insertBefore(document.createTextNode(username), null)
  // 将<div>元素添加到<span>元素中
  caret.insertBefore(userDiv, null)
  // 在2秒后，给光标<span>元素添加类名hide-name，用于隐藏用户名
  // 使远程光标的显示更加简洁，减少用户分心
  setTimeout(() => {
    caret.classList.add('hide-name')
  }, 2000)
  return caret
}

// 创建一个表示空行的HTML元素，并设置其样式
const createEmptyLinePlaceholder = (color) => {
  const placeholder = document.createElement('span')
  // 用于禁止用户选择该元素的内容
  placeholder.setAttribute('style', 'user-select: none;')
  const emptyTxt = document.createElement('span')
  // 插入一个空文本节点
  emptyTxt.insertBefore(document.createTextNode(''), null)
  const sel = document.createElement('span')
  sel.setAttribute('class', 'y-line-selection')
  sel.setAttribute(
    'style',
    `display: inline-block; position: absolute; left: 4px; right: 4px; top: 0; bottom: 0; background-color: ${color}70`
  )
  placeholder.insertBefore(sel, null)
  placeholder.insertBefore(emptyTxt, null)
  return placeholder
}

// 用户在编辑器中移动光标时更新用户的本地状态
const codemirrorCursorActivity = (y, cm, type, awareness) => {
  const aw = awareness.getLocalState()
  // 如果编辑器没有焦点，或者文档对象为空，或者编辑器的文档对象没有焦点，则直接返回
  if (
    !cm.hasFocus() || aw == null || !cm.display.wrapper.ownerDocument.hasFocus()
  ) {
    return
  }
  // 将当前光标位置转换为相对位置，并将其与之前保存的光标位置进行比较， 以确定光标位置是否发生了变化
  const newAnchor = Y.createRelativePositionFromTypeIndex(
    type,
    cm.indexFromPos(cm.getCursor('anchor'))
  )
  const newHead = Y.createRelativePositionFromTypeIndex(
    type,
    cm.indexFromPos(cm.getCursor('head'))
  )
  let currentAnchor = null
  let currentHead = null
  if (aw.cursor != null) {
    currentAnchor = Y.createRelativePositionFromJSON(
      JSON.parse(aw.cursor.anchor)
    )
    currentHead = Y.createRelativePositionFromJSON(JSON.parse(aw.cursor.head))
  }
  if (
    aw.cursor == null ||
    !Y.compareRelativePositions(currentAnchor, newAnchor) ||
    !Y.compareRelativePositions(currentHead, newHead)
  ) {
    // 发生变化
    awareness.setLocalStateField('cursor', {
      anchor: JSON.stringify(newAnchor),
      head: JSON.stringify(newHead)
    })
  }
}

/**
 * A binding that binds a YText to a CodeMirror editor.
 *
 * @example
 *   const ytext = ydocument.define('codemirror', Y.Text)
 *   const editor = new CodeMirror(document.querySelector('#container'), {
 *     mode: 'javascript',
 *     lineNumbers: true
 *   })
 *   const binding = new CodemirrorBinding(ytext, editor)
 */
// 将Y.Text对象与CodeMirror编辑器绑定
export class CodemirrorBinding extends Observable {
  /**
   * @param {Y.Text} textType
   * @param {import('codemirror').Editor} codeMirror
   * @param {any | null} [awareness]
   * @param {{ yUndoManager?: Y.UndoManager }} [options]
   */
  constructor(
    textType, // 要绑定的文本数据
    codeMirror, // CodeMi rror编辑器实例
    awareness = null, // 用于跟踪其他用户的光标位置（可选）
    { yUndoManager = null } = {} // 包含配置选项，这里主要包含yUndoManager，用于跟踪撤消/重做操作
  ) {
    super()
    const doc = textType.doc // 文档对象
    const cmDoc = codeMirror.getDoc() // 编辑器文档对象
    this.doc = doc
    this.type = textType
    this.cm = codeMirror
    this.cmDoc = cmDoc
    this.awareness = awareness || null
    this.yUndoManager = yUndoManager
    // 当撤消/重做操作的栈项被添加时触发
    // 这段代码实现了在撤消/重做操作过程中存储和恢复光标位置的功能，确保用户在撤消/重做操作后
    // 能够回到正确的光标位置
    this._onStackItemAdded = ({ stackItem, changedParentTypes }) => {
      // only store metadata if this type was affected
      if (changedParentTypes.has(textType) && this._beforeChangeSelection) {
        stackItem.meta.set(this, this._beforeChangeSelection)
      }
    }
    this._onStackItemPopped = ({ stackItem }) => {
      const sel = stackItem.meta.get(this)
      if (sel) {
        const anchor =
          Y.createAbsolutePositionFromRelativePosition(sel.anchor, doc).index
        const head =
          Y.createAbsolutePositionFromRelativePosition(sel.head, doc).index
        codeMirror.setSelection(
          codeMirror.posFromIndex(anchor),
          codeMirror.posFromIndex(head)
        )
        this._beforeChange()
      }
    }
    // 在yUndoManager中添加当前编辑器绑定
    // 为CodeMirror编辑器添加了撤销和重做的键盘映射，并且监听了上面那两个事件
    if (yUndoManager) {
      // 将当前的编辑器绑定实例添加到撤消管理器的跟踪队列中
      yUndoManager.trackedOrigins.add(this) // track changes performed by this editor binding
      
      // 执行撤消操作
      const editorUndo = (cm) => {
        // Keymaps always start with an active operation.
        // End the current operation so that the event is fired at the correct moment.
        // @todo check cm.curOp in typeListener and endOperation always.
        cm.endOperation()
        yUndoManager.undo()
        cm.startOperation()
      }
      // 执行重做操作
      const editorRedo = (cm) => {
        cm.endOperation()
        yUndoManager.redo()
        cm.startOperation()
      }
      codeMirror.addKeyMap({
        // pc
        'Ctrl-Z': editorUndo,
        'Shift-Ctrl-Z': editorRedo,
        'Ctrl-Y': editorRedo,
        // mac
        'Cmd-Z': editorUndo,
        'Shift-Cmd-Z': editorRedo,
        'Cmd-Y': editorRedo
      })

      // 监听事件
      yUndoManager.on('stack-item-added', this._onStackItemAdded)
      yUndoManager.on('stack-item-popped', this._onStackItemPopped)
    }

    // 设置互斥锁
    this._mux = createMutex()
    // 设置初始值
    cmDoc.setValue(textType.toString())
    // 观察者函数：观察YText对象的变化
    this._typeObserver = (event) => typeObserver(this, event)
    // 观察者函数：观察CodeMirror编辑器的变化
    this._targetObserver = (instance, changes) => {
      if (instance.getDoc() === cmDoc) {
        targetObserver(this, changes)
      }
    }
    // 跟踪光标位置
    this._cursors = new Map()
    // 跟踪光标变化
    this._changedCursors = new Set()

    this._debounceCursorEvent = eventloop.createDebouncer(10)
    // 监听光标变化
    this._awarenessListener = (event) => {
      // 检查当前的CodeMirror编辑器是否与传入的cmDoc对应的文档相匹配
      if (codeMirror.getDoc() !== cmDoc) {
        return
      }
      const f = (clientId) => {
        if (clientId !== doc.clientID) {
          this._changedCursors.add(clientId)
        }
      }
      event.added.forEach(f)
      event.removed.forEach(f)
      event.updated.forEach(f)
      if (this._changedCursors.size > 0) {
        this._debounceCursorEvent(() => {
          this._changedCursors.forEach((clientId) => {
            updateRemoteSelection(
              doc,
              codeMirror,
              textType,
              this._cursors,
              clientId,
              awareness
            )
          })
          this._changedCursors.clear()
        })
      }
    }
    // 监听编辑器的光标活动
    this._pendingCursorEvent = false
    this._cursorListener = () => {
      if (codeMirror.getDoc() === cmDoc) {
        this._pendingCursorEvent = true
        setTimeout(() => {
          if (this._pendingCursorEvent) {
            this._pendingCursorEvent = false
            this.emit('cursorActivity', [codeMirror])
          }
        }, 0)
      }
    }
    // 添加事件监听器：在光标活动时执行一些操作，可能是更新位置、同步光标位置或其他相关操作
    this.on('cursorActivity', () => {
      codemirrorCursorActivity(doc, codeMirror, textType, awareness)
    })
    // 事件监听器：当编辑器失去焦点时，将光标位置设置为null
    this._blurListeer = () => awareness.setLocalStateField('cursor', null)

    // 将_typeObserver添加到textType的观察者列表中
    // 这使得textType对象发生变化时触发_typeObserver函数
    textType.observe(this._typeObserver)
    // 添加事件监听器：当CodeMirror编辑器发生变化时，触发_targetObserver函数
    // @ts-ignore
    codeMirror.on('changes', this._targetObserver)
    /**
     * @type {{ anchor: Y.RelativePosition, head: Y.RelativePosition } | null}
     */
    this._beforeChangeSelection = null // 用于存储编辑器变更前的选择内容
    // 用在编辑器内容变更前执行的操作
    this._beforeChange = () => {
      // update the the beforeChangeSelection that is stored befor each change to the editor (except when applying remote changes)
      this._mux(() => {
        // store the selection before the change is applied so we can restore it with the undo manager.
        // getCursor() 获取编辑器当前光标位置
        // getCursor('anchor') 获取当前选择的锚点位置(选择区域的起始点)
        // getCursor('head') 获取当前选择的头部位置（选择区域的结束点）
        // indexFromPos() 将光标位置转换为相对于文本类型textType的索引
        // createRelativePositionFromTypeIndex() 创建相对位置
        const anchor = Y.createRelativePositionFromTypeIndex(
          textType,
          codeMirror.indexFromPos(codeMirror.getCursor('anchor'))
        )
        const head = Y.createRelativePositionFromTypeIndex(
          textType,
          codeMirror.indexFromPos(codeMirror.getCursor('head'))
        )
        // 以便在应用撤消操作时恢复选择内容
        this._beforeChangeSelection = { anchor, head }
      })
    }
    // 注册监听器，在编辑器准备发生文本变化之前，调用_befroreChange
    codeMirror.on('beforeChange', this._beforeChange)
    if (awareness) {
      // 注册监听器：当编辑器失去焦点时，把光标位置设置为null
      codeMirror.on('swapDoc', this._blurListeer)
      // 注册监听器：当编辑器获得焦点时，触发光标监听器
      awareness.on('change', this._awarenessListener)
      // @ts-ignore
      codeMirror.on('cursorActivity', this._cursorListener)
      codeMirror.on('blur', this._blurListeer)
      codeMirror.on('focus', this._cursorListener)
    }
  }

  destroy() {
    this.type.unobserve(this._typeObserver)
    this.cm.off('swapDoc', this._blurListeer)
    // @ts-ignore
    this.cm.off('changes', this._targetObserver)
    this.cm.off('beforeChange', this._beforeChange)
    // @ts-ignore
    this.cm.off('cursorActivity', this._cursorListener)
    this.cm.off('focus', this._cursorListener)
    this.cm.off('blur', this._blurListeer)
    if (this.awareness) {
      this.awareness.off('change', this._awarenessListener)
    }
    if (this.yUndoManager) {
      this.yUndoManager.off('stack-item-added', this._onStackItemAdded)
      this.yUndoManager.off('stack-item-popped', this._onStackItemPopped)
      this.yUndoManager.trackedOrigins.delete(this)
    }
    this.type = null
    this.cm = null
    this.cmDoc = null
    super.destroy()
  }
}

export const CodeMirrorBinding = CodemirrorBinding


// 更新远程用于的选择状态和光标位置在CodeMirror中的显示（就是旁边显示的远程用户信息）
const updateRemoteSelection = (y, cm, type, cursors, clientId, awareness) => {
  // 获取指定客户端的awareness clientId是唯一的，yjs自带的
  const aw = awareness.getStates().get(clientId)
  // 获取光标信息
  const m = cursors.get(clientId)
  if (m !== undefined) { // 如果当前客户端已经存在光标信息，则清除之前的光标标记
    if (m.caret) {
      m.caret.clear()
    }
    m.sel.forEach((sel) => sel.clear())
    cursors.delete(clientId)
  }
  if (aw === undefined) {
    return
  }

  // 设置用户的默认颜色和名称
  const user = aw.user || {}
  if (user.color == null) {
    user.color = '#ffa500'
  }
  if (user.name == null) {
    user.name = `User: ${clientId}`
  }

  // 获取当前客户端的光标信息
  const cursor = aw.cursor
  if (cursor == null || cursor.anchor == null || cursor.head == null) {
    return
  }
  // 将相对位置转换为绝对位置
  const anchor = Y.createAbsolutePositionFromRelativePosition(
    JSON.parse(cursor.anchor),
    y
  )
  const head = Y.createAbsolutePositionFromRelativePosition(
    JSON.parse(cursor.head),
    y
  )
  if (
    anchor !== null && head !== null && anchor.type === type &&
    head.type === type
  ) {
    const headpos = cm.posFromIndex(head.index)
    const anchorpos = cm.posFromIndex(anchor.index)
    let from, to
    if (head.index < anchor.index) {
      from = headpos
      to = anchorpos
    } else {
      from = anchorpos
      to = headpos
    }
    const caretEl = createRemoteCaret(user.name, user.color)
    // 如果光标位置跟之前的光标位置相同，则隐藏用户名，否则显示用户名
    if (
      m && func.equalityFlat(aw.cursor.anchor, m.awCursor.anchor) &&
      func.equalityFlat(aw.cursor.head, m.awCursor.head)
    ) {
      caretEl.classList.add('hide-name')
    }
    const sel = []

    // 在远程用户选择的文本范围内为其添加标记，并在文本编辑器中显示光标
    // 用于检查选择的文本方位是否跨越多行，如果是跨越多行的选择，需要分别处理每一行的选择
    if (head.index !== anchor.index) {
      // 如果选择范围的起始行和结束行不相同，并且起始位置的字符索引不为0
      // 说明选择范围的起始位置不在行首，需要在当前行添加一个简单的文本标记
      if (from.line !== to.line && from.ch !== 0) {
        // start of selection will only be a simple text-selection
        sel.push(
          cm.markText(from, new CodeMirror.Pos(from.line + 1, 0), {
            css: `background-color: ${user.color}70;`,
            inclusiveRight: false,
            inclusiveLeft: false
          })
        )
        from = new CodeMirror.Pos(from.line + 1, 0)
      }
      // 用于处理跨越多行的选择范围，在每一行的起始位置添加一个带有背景填充的占位符
      while (from.line !== to.line) {
        // middle of selection is always a whole-line selection. We add a widget at the first position which will fill the background.
        sel.push(
          cm.setBookmark(new CodeMirror.Pos(from.line, 0), {
            widget: createEmptyLinePlaceholder(user.color)
          })
        )
        from = new CodeMirror.Pos(from.line + 1, 0)
      }
      // 将创建的文本选择标记或者占位符添加到sel数组中
      sel.push(
        cm.markText(from, to, {
          css: `background-color: ${user.color}70;`,
          inclusiveRight: false,
          inclusiveLeft: false
        })
      )
    }
    // 根据选择的结束位置以及光标信息，在编辑器中设置光标标记，如果选择的是当前的整行文本
    // 并且选择的结束位置在行首，说明光标在当前行最左侧，此时不需要显示光标
    const caret = sel.length > 0 && to === headpos && headpos.ch === 0
      ? null
      : cm.setBookmark(headpos, { widget: caretEl, insertLeft: true })
    cursors.set(clientId, { caret, sel, awCursor: cursor })
  }
}